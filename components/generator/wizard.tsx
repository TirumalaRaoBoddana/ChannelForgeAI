"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Check, Loader2, Sparkles, AlertCircle, ArrowLeft, RefreshCw, Star, Palette, ImageIcon, Monitor, Droplets, FileText, KeyRound, Quote, SwatchBook, LayoutTemplate } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CONTENT_TYPES, PERSONALITIES, LANGUAGES, IDEA_DEFAULTS, ASSET_CHOICES } from "@/lib/validation/schemas";
import { clientGuestToken, guestQuery } from "@/lib/utils/guest-client";
import type { BrandIdentity, GeneratedChannelName, ColorPalette, AssetChoice } from "@/lib/db/types";

type Step = "idea" | "names" | "colors" | "assets" | "generating";

interface IdeaForm {
  idea: string; targetAudience: string; category: string; contentType: string;
  language: string; personality: string; keywords: string;
}

type AssetState = "pending" | "working" | "done" | "failed";

const ASSET_META: Record<AssetChoice, { label: string; hint: string; icon: typeof ImageIcon }> = {
  logo: { label: "Channel Logo", hint: "800×800 square avatar", icon: ImageIcon },
  banner: { label: "Channel Banner", hint: "2560×1440 header art", icon: Monitor },
  watermark: { label: "Watermark", hint: "300×300 video overlay", icon: Droplets },
  description: { label: "Channel Description", hint: "Short + full SEO text", icon: FileText },
  keywords: { label: "Channel Keywords", hint: "Categorized SEO terms", icon: KeyRound },
  tagline: { label: "Channel Tagline", hint: "Memorable one-liner", icon: Quote },
  palette: { label: "Brand Palette", hint: "colors.json export", icon: SwatchBook },
  thumbnailGuide: { label: "Thumbnail Style Guide", hint: "Do / avoid rules", icon: LayoutTemplate },
};

const H = () => ({ "Content-Type": "application/json", "x-cf-client": "1", "x-cf-guest": clientGuestToken() });

// Derive a companion color when the user only picks one swatch: dark neutral
// secondary + accent hue-rotated from the primary (spec §9 manual mode).
const hexToHsl = (hex: string): [number, number, number] => {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16) / 255, g = parseInt(n.slice(2, 4), 16) / 255, b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0; const l = (max + min) / 2; const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
};
const hslToHex = (h: number, s: number, l: number): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + [r + m, g + m, b + m].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
};
const deriveColors = (primary: string) => {
  const [h, s] = hexToHsl(primary);
  return { primary, secondary: "#111827", accent: hslToHex((h + 150) % 360, Math.min(1, Math.max(0.5, s + 0.15)), 0.55) };
};
const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

function WizardInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<Step>("idea");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // ── Step state ──
  const [form, setForm] = useState<IdeaForm>({
    idea: params.get("idea") ?? "",
    targetAudience: "", category: "", keywords: "",
    language: IDEA_DEFAULTS.language,
    contentType: IDEA_DEFAULTS.contentType,
    personality: IDEA_DEFAULTS.personality,
  });
  const [projectId, setProjectId] = useState("");
  const [generation, setGeneration] = useState(0);
  const [names, setNames] = useState<GeneratedChannelName[]>([]);
  const [selectedName, setSelectedName] = useState<GeneratedChannelName | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [colorsSource, setColorsSource] = useState<"user" | "ai">("ai");
  const [paletteName, setPaletteName] = useState<string | null>(null);
  const [colors, setColors] = useState({ primary: "#4f46e5", secondary: "#111827", accent: "#f59e0b" });
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [chosen, setChosen] = useState<AssetChoice[]>([...ASSET_CHOICES]);
  const [assetStates, setAssetStates] = useState<Record<string, AssetState>>({});
  const pollTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);

  useEffect(() => () => { Object.values(pollTimers.current).forEach(clearTimeout); }, []);

  const api = async (url: string, init?: RequestInit) => {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}${guestQuery()}`, { ...init, headers: { ...H(), ...(init?.headers ?? {}) } });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Something went wrong. Please try again.");
    return json.data;
  };

  // ── Step 1 → 2: generate names ──
  const generateNames = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.idea.trim().length < 8) { setError("Tell us a little more about your idea (at least 8 characters)."); return; }
    setError(""); setBusy(true);
    try {
      const data = await api("/api/channel/names", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          targetAudience: form.targetAudience.trim() || IDEA_DEFAULTS.targetAudience,
        }),
      });
      setProjectId(data.projectId);
      setGeneration(data.generation);
      setNames(data.names);
      setSelectedName(null);
      setStep("names");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  const regenerateNames = async () => {
    if (!projectId) return;
    setError(""); setBusy(true);
    try {
      const data = await api("/api/channel/names", { method: "POST", body: JSON.stringify({ projectId }) });
      setGeneration(data.generation);
      setNames(data.names);
      setSelectedName(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't generate your channel names right now.");
    } finally { setBusy(false); }
  };

  // ── Step 2 → 3: confirm name, load color suggestions ──
  const confirmName = async () => {
    if (!selectedName) { setError("Please select a channel name to continue."); return; }
    setError(""); setBusy(true);
    try {
      const data = await api(`/api/projects/${projectId}`, { method: "PATCH", body: JSON.stringify({ selectedNameId: selectedName.id }) });
      setBrandIdentity(data.brandIdentity ?? null);
      setColorsSource("ai");
      setStep("colors");
      // AI-recommended palettes (spec §8: color_preference is null here).
      void api("/api/channel/colors", { method: "POST", body: JSON.stringify({ projectId }) })
        .then(d => setPalettes(d.palettes))
        .catch(() => setPalettes([]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  const confirmColors = async () => {
    setError(""); setBusy(true);
    try {
      const data = await api(`/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ colors: { ...colors, paletteName, source: colorsSource } }),
      });
      setBrandIdentity(data.brandIdentity ?? null);
      setStep("assets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  const confirmAssets = async () => {
    if (chosen.length === 0) { setError("Select at least one asset to generate."); return; }
    setError(""); setBusy(true);
    try {
      await api(`/api/projects/${projectId}`, { method: "PATCH", body: JSON.stringify({ chosenAssets: chosen, stage: "generating" }) });
      setStep("generating");
      void runGeneration();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  // ── Step 5: selective generation (spec §13-§16) ──
  const mark = (key: string, state: AssetState) => setAssetStates(s => ({ ...s, [key]: state }));

  const runGeneration = async () => {
    const states = Object.fromEntries(chosen.map(a => [a, "pending" as AssetState]));
    setAssetStates(states);

    // Instant assets come from the confirmed identity — no API calls needed.
    if (chosen.includes("tagline")) { mark("tagline", "working"); await new Promise(r => setTimeout(r, 250)); mark("tagline", "done"); }
    if (chosen.includes("palette")) { mark("palette", "working"); await new Promise(r => setTimeout(r, 250)); mark("palette", "done"); }

    // Text assets: awaited sequentially, each independently retryable.
    const textJobs: [AssetChoice, string, string][] = [
      ["description", "/api/channel/description", "description"],
      ["keywords", "/api/channel/keywords", "keywords"],
      ["thumbnailGuide", "/api/channel/thumbnail-guide", "thumbnailGuide"],
    ];
    for (const [asset, url] of textJobs) {
      if (!chosen.includes(asset) || states[asset] === "done") continue;
      await runTextAsset(asset, url);
    }

    // Image assets: queued jobs, polled in parallel.
    for (const asset of ["logo", "banner", "watermark"] as const) {
      if (chosen.includes(asset)) void startImageJob(asset);
    }
  };

  const runTextAsset = async (asset: AssetChoice, url: string): Promise<boolean> => {
    mark(asset, "working");
    try {
      await api(url, { method: "POST", body: JSON.stringify({ projectId }) });
      mark(asset, "done");
      return true;
    } catch {
      mark(asset, "failed");
      return false;
    }
  };

  const startImageJob = (asset: "logo" | "banner" | "watermark") => {
    mark(asset, "working");
    void (async () => {
      try {
        const data = await api(`/api/generate/${asset}`, { method: "POST", body: JSON.stringify({ projectId }) });
        pollJob(asset, data.jobId);
      } catch { mark(asset, "failed"); }
    })();
  };

  const pollJob = (asset: string, jobId: string) => {
    const tick = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}?${guestQuery()}`);
        const json = await res.json();
        if (!json.success) throw new Error(json?.error?.message ?? "Job lookup failed");
        const { status } = json.data;
        if (status === "completed") { mark(asset, "done"); checkAllDone(); return; }
        if (status === "failed") { mark(asset, "failed"); return; }
        pollTimers.current[asset] = setTimeout(tick, 800);
      } catch { mark(asset, "failed"); }
    };
    pollTimers.current[asset] = setTimeout(tick, 700);
  };

  const checkAllDone = () => {
    setAssetStates(s => {
      const allDone = chosen.every(a => s[a] === "done");
      if (allDone) {
        void api(`/api/projects/${projectId}`, { method: "PATCH", body: JSON.stringify({ stage: "complete" }) }).catch(() => {});
        void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json", "x-cf-client": "1" }, body: JSON.stringify({ name: "channel_generation_completed" }) }).catch(() => {});
        setTimeout(() => router.push(`/kit/${projectId}?${guestQuery()}`), 600);
      }
      return s;
    });
  };

  // Also advance after text/image completions land via mark().
  useEffect(() => {
    if (step === "generating" && chosen.length > 0 && chosen.every(a => assetStates[a] === "done")) checkAllDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetStates, step]);

  const retry = (asset: AssetChoice) => {
    setError("");
    if (asset === "logo" || asset === "banner" || asset === "watermark") startImageJob(asset);
    else if (asset === "description") void runTextAsset(asset, "/api/channel/description").then(checkAllDone);
    else if (asset === "keywords") void runTextAsset(asset, "/api/channel/keywords").then(checkAllDone);
    else if (asset === "thumbnailGuide") void runTextAsset(asset, "/api/channel/thumbnail-guide").then(checkAllDone);
  };

  const doneCount = chosen.filter(a => assetStates[a] === "done").length;
  const stepIndex = { idea: 0, names: 1, colors: 2, assets: 3, generating: 4 }[step];

  return (
    <div className="section py-10">
      <div className="mx-auto max-w-3xl">
        {/* Step indicator */}
        <ol className="mb-8 flex items-center gap-2 text-xs font-medium" aria-label="Wizard progress">
          {["Idea", "Names", "Colors", "Assets", "Generating"].map((label, i) => (
            <li key={label} className={`flex items-center gap-2 ${i < 4 ? "flex-1" : ""}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i <= stepIndex ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-700"}`} aria-current={i === stepIndex ? "step" : undefined}>
                {i < stepIndex ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
              </span>
              <span className={i <= stepIndex ? "text-slate-700 dark:text-slate-200" : "text-slate-400"}>{label}</span>
              {i < 4 && <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" aria-hidden />}
            </li>
          ))}
        </ol>

        {error && (
          <div role="alert" className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> <span>{error}</span>
          </div>
        )}

        {/* ── Step 1: Idea ── */}
        {step === "idea" && (
          <form onSubmit={generateNames} className="space-y-5">
            <div>
              <label className="label" htmlFor="idea">Your channel idea <span className="text-red-500">*</span></label>
              <textarea id="idea" className="input min-h-28" value={form.idea} onChange={e => setForm({ ...form, idea: e.target.value })} maxLength={500} placeholder="e.g. A channel explaining physics concepts with everyday experiments" required minLength={8} />
              <p className="mt-1 text-xs text-slate-400">{form.idea.length}/500</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="targetAudience">Target audience</label>
                <input id="targetAudience" className="input" value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} placeholder={IDEA_DEFAULTS.targetAudience} maxLength={200} />
                <p className="mt-1 text-xs text-slate-400">default: {IDEA_DEFAULTS.targetAudience}</p>
              </div>
              <div>
                <label className="label" htmlFor="category">Category / niche</label>
                <input id="category" className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Science & Technology" maxLength={100} />
                <p className="mt-1 text-xs text-slate-400">optional — helps name suggestions</p>
              </div>
              <div>
                <label className="label" htmlFor="contentType">Content type</label>
                <select id="contentType" className="input" value={form.contentType} onChange={e => setForm({ ...form, contentType: e.target.value })}>
                  {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <p className="mt-1 text-xs text-slate-400">default: {IDEA_DEFAULTS.contentType}</p>
              </div>
              <div>
                <label className="label" htmlFor="language">Language</label>
                <select id="language" className="input" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <p className="mt-1 text-xs text-slate-400">default: {IDEA_DEFAULTS.language}</p>
              </div>
              <div>
                <label className="label" htmlFor="personality">Brand personality</label>
                <select id="personality" className="input" value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })}>
                  {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <p className="mt-1 text-xs text-slate-400">default: {IDEA_DEFAULTS.personality}</p>
              </div>
              <div>
                <label className="label" htmlFor="keywords">Keywords (optional)</label>
                <input id="keywords" className="input" value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="science, experiments, physics" maxLength={200} />
                <p className="mt-1 text-xs text-slate-400">comma separated</p>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />} Generate Channel Names
            </button>
          </form>
        )}

        {/* ── Step 2: Names ── */}
        {step === "names" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Choose your channel name</h2>
              <div className="flex items-center gap-2 text-sm">
                <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => setStep("idea")}><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous</button>
                <Badge>Generation {generation}</Badge>
                <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={regenerateNames} disabled={busy}>
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden />} Regenerate
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {names.map(n => {
                const active = selectedName?.id === n.id;
                const fav = favorites.includes(n.id);
                return (
                  <div key={n.id} className={`relative rounded-2xl border p-4 transition ${active ? "border-brand-500 ring-2 ring-brand-500/40" : "border-slate-200 hover:border-brand-300 dark:border-slate-700"}`}>
                    <button aria-label={fav ? "Remove from favorites" : "Add to favorites"} onClick={() => setFavorites(f => fav ? f.filter(x => x !== n.id) : [...f, n.id])} className="absolute right-3 top-3 text-slate-300 hover:text-amber-400" aria-pressed={fav}>
                      <Star className={`h-4 w-4 ${fav ? "fill-amber-400 text-amber-400" : ""}`} aria-hidden />
                    </button>
                    <p className="pr-7 text-lg font-bold">{n.name}</p>
                    <p className="mt-1 text-xs italic text-slate-500">“{n.tagline}”</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{n.rationale}</p>
                    <p className="mt-2 text-xs text-slate-400">Personality: {n.personality}</p>
                    <button className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-brand-600 text-white" : "border border-slate-300 hover:border-brand-400 dark:border-slate-600"}`} onClick={() => setSelectedName(n)} aria-pressed={active}>
                      {active ? "✓ Selected" : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn-primary" onClick={confirmName} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null} Continue with {selectedName ? `“${selectedName.name}”` : "Selection"}
              </button>
            </div>
            {!selectedName && <p className="mt-2 text-right text-xs text-slate-400">Please select a channel name to continue.</p>}
          </div>
        )}

        {/* ── Step 3: Colors ── */}
        {step === "colors" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Brand colors</h2>
              <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => setStep("names")}><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous</button>
            </div>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No color preference was provided. We’ll use our AI-recommended palette — or pick your own colors below.
            </p>

            {palettes.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Preparing AI-recommended palettes…</p>
            ) : (
              <div>
                <p className="mb-2 text-sm font-medium">AI-recommended palettes</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {palettes.map(p => {
                    const active = colorsSource === "ai" && colors.primary === p.primary && colors.secondary === p.secondary && colors.accent === p.accent;
                    return (
                      <div key={p.id} className={`rounded-2xl border p-4 ${active ? "border-brand-500 ring-2 ring-brand-500/40" : "border-slate-200 dark:border-slate-700"}`}>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{p.name}</p>
                          <div className="flex gap-1.5" aria-hidden>
                            {[p.primary, p.secondary, p.accent].map(c => <span key={c} className="h-5 w-5 rounded-full border border-slate-200 dark:border-slate-600" style={{ background: c }} />)}
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{p.reason}</p>
                        <button className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-brand-600 text-white" : "border border-slate-300 hover:border-brand-400 dark:border-slate-600"}`}
                          onClick={() => { setColors({ primary: p.primary, secondary: p.secondary, accent: p.accent }); setColorsSource("ai"); setPaletteName(p.name); }} aria-pressed={active}>
                          {active ? "✓ Using This Palette" : "Use This Palette"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-medium">Or choose your own</p>
              <div className="grid grid-cols-3 gap-3">
                {(["primary", "secondary", "accent"] as const).map(key => (
                  <div key={key}>
                    <label className="label capitalize" htmlFor={`hex-${key}`}>{key}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" aria-label={`${key} color picker`} value={isHex(colors[key]) ? colors[key] : "#4f46e5"}
                        onChange={e => {
                          if (key === "primary") setColors(deriveColors(e.target.value));
                          else setColors(c => ({ ...c, [key]: e.target.value }));
                          setColorsSource("user"); setPaletteName(null);
                        }}
                        className="h-9 w-9 cursor-pointer rounded border border-slate-200 dark:border-slate-700" />
                      <input id={`hex-${key}`} className="input !py-1.5 font-mono text-xs" value={colors[key]} maxLength={7}
                        onChange={e => { setColors(c => ({ ...c, [key]: e.target.value })); setColorsSource("user"); setPaletteName(null); }} />
                    </div>
                  </div>
                ))}
              </div>
              {!isHex(colors.primary) || !isHex(colors.secondary) || !isHex(colors.accent) ? (
                <p className="mt-2 text-xs text-red-500">Please use full hex colors like #4f46e5.</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-900 dark:bg-brand-950/30">
              <p className="text-sm font-medium">Selected: <span className="font-mono text-xs">{colors.primary}</span> · <span className="font-mono text-xs">{colors.secondary}</span> · <span className="font-mono text-xs">{colors.accent}</span></p>
              <div className="mt-3 flex gap-2">
                <button className="btn-secondary !px-4 !py-2 !text-sm" onClick={() => { setColors({ primary: "#4f46e5", secondary: "#111827", accent: "#f59e0b" }); setPaletteName(null); }}><Palette className="h-4 w-4" aria-hidden /> Change Colors</button>
                <button className="btn-primary !px-4 !py-2 !text-sm" onClick={confirmColors} disabled={busy || !isHex(colors.primary) || !isHex(colors.secondary) || !isHex(colors.accent)}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null} Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Assets ── */}
        {step === "assets" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">What should we create?</h2>
              <div className="flex items-center gap-2">
                <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => setStep("colors")}><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous</button>
                <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => setChosen([...ASSET_CHOICES])}>Select All</button>
                <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => setChosen([])}>Clear All</button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {ASSET_CHOICES.map(a => {
                const meta = ASSET_META[a];
                const active = chosen.includes(a);
                return (
                  <button key={a} onClick={() => setChosen(c => active ? c.filter(x => x !== a) : [...c, a])} aria-pressed={active}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${active ? "border-brand-500 bg-brand-50/40 ring-1 ring-brand-500/30 dark:bg-brand-950/20" : "border-slate-200 hover:border-brand-300 dark:border-slate-700"}`}>
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 dark:border-slate-600"}`}>
                      {active && <Check className="h-3.5 w-3.5" aria-hidden />}
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 font-semibold"><meta.icon className="h-4 w-4 text-brand-600" aria-hidden /> {meta.label}</span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{meta.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">{chosen.length} of {ASSET_CHOICES.length} assets selected</p>
              <button className="btn-primary" onClick={confirmAssets} disabled={busy || chosen.length === 0}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />} Generate Branding
              </button>
            </div>
          </div>
        )}

        {/* ── Step 5: Generating ── */}
        {step === "generating" && (
          <div>
            <h2 className="text-lg font-semibold">Creating your brand assets</h2>
            <p className="mt-1 text-sm text-slate-500">This may take a moment. You can close this page and come back — completed assets are saved.</p>
            <div className="mt-4"><Progress value={chosen.length ? Math.round((doneCount / chosen.length) * 100) : 0} label="Overall progress" /></div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-2 text-sm text-emerald-600"><Check className="h-4 w-4" aria-hidden /> Channel name confirmed</li>
              <li className="flex items-center gap-2 text-sm text-emerald-600"><Check className="h-4 w-4" aria-hidden /> Brand identity created</li>
              {chosen.map(a => {
                const st = assetStates[a] ?? "pending";
                const meta = ASSET_META[a];
                return (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    {st === "done" && <Check className="h-4 w-4 text-emerald-600" aria-hidden />}
                    {st === "working" && <Loader2 className="h-4 w-4 animate-spin text-brand-600" aria-hidden />}
                    {st === "pending" && <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600" aria-hidden />}
                    {st === "failed" && <AlertCircle className="h-4 w-4 text-red-500" aria-hidden />}
                    <meta.icon className="h-4 w-4 text-slate-400" aria-hidden />
                    <span className={st === "done" ? "text-slate-400 line-through" : st === "failed" ? "text-red-600" : ""}>{meta.label}</span>
                    {st === "failed" && (
                      <button className="btn-secondary !px-2.5 !py-1 !text-xs" onClick={() => retry(a)}><RefreshCw className="h-3 w-3" aria-hidden /> Retry {meta.label.split(" ").pop()}</button>
                    )}
                  </li>
                );
              })}
            </ul>
            {chosen.every(a => assetStates[a] === "done") && (
              <p className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600"><Check className="h-4 w-4" aria-hidden /> All done! Opening your brand kit…</p>
            )}
            {chosen.some(a => assetStates[a] === "failed") && !chosen.some(a => assetStates[a] === "working") && (
              <p className="mt-6 text-sm text-slate-500">Some assets failed. Retry them above — completed assets will not be regenerated.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function GenerateWizard() {
  return (
    <Suspense fallback={<div className="section py-16 text-center text-slate-400">Loading…</div>}>
      <WizardInner />
    </Suspense>
  );
}
