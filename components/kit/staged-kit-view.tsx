"use client";
import { useState } from "react";
import { Download, RefreshCw, Loader2, Palette, Copy, Check, History, Pencil, ImageIcon, Monitor, Droplets, FileText, KeyRound, Quote, SwatchBook, LayoutTemplate } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { LOGO_STYLES } from "@/lib/validation/schemas";
import { clientGuestToken, guestQuery } from "@/lib/utils/guest-client";
import type { BrandIdentity, AssetChoice, ThumbnailGuide } from "@/lib/db/types";

export interface StagedKitViewProps {
  project: { id: string; idea: string; createdAt: string; stage: string | null };
  selectedName: { name: string; tagline: string; personality: string } | null;
  allNames: { id: string; name: string }[];
  brandIdentity: BrandIdentity | null;
  tagline: string | null;
  description: { short: string; seo: string } | null;
  keywords: { category: string; keywords: string[] }[] | null;
  thumbnailGuide: ThumbnailGuide | null;
  chosenAssets: AssetChoice[];
  assets: { id: string; assetType: "logo" | "banner" | "watermark"; width: number; height: number; version: number; current: boolean }[];
  isGuest: boolean;
}

const TYPE_META = {
  logo: { label: "Logo", icon: ImageIcon, dim: "800 × 800" },
  banner: { label: "Banner", icon: Monitor, dim: "2560 × 1440" },
  watermark: { label: "Watermark", icon: Droplets, dim: "300 × 300" },
} as const;

const H = () => ({ "Content-Type": "application/json", "x-cf-client": "1", "x-cf-guest": clientGuestToken() });

export function StagedKitView(props: StagedKitViewProps) {
  const { brandIdentity: bi, assets, selectedName } = props;
  const [jobs, setJobs] = useState<Record<string, { progress: number; status: string }>>({});
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [editForm, setEditForm] = useState({
    primary: bi?.primaryColor ?? "#4f46e5",
    secondary: bi?.secondaryColor ?? "#111827",
    accent: bi?.accentColor ?? "#f59e0b",
    logoStyle: bi?.logoStyle ?? "Modern",
    typographyStyle: bi?.typographyStyle ?? "Bold modern sans-serif",
  });

  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 1500); } catch { /* clipboard unavailable */ }
  };
  const downloadText = (filename: string, content: string) => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const el = document.createElement("a");
    el.href = url; el.download = filename; el.click();
    URL.revokeObjectURL(url);
  };

  const regenerate = async (assetType: "logo" | "banner" | "watermark") => {
    setNotice("");
    const res = await fetch(`/api/generate/${assetType}?${guestQuery()}`, {
      method: "POST", headers: H(),
      body: JSON.stringify({ projectId: props.project.id }),
    });
    const json = await res.json();
    if (!json.success) { setNotice(json.error?.message ?? `${TYPE_META[assetType].label} generation failed.`); return; }
    pollJob(json.data.jobId, assetType);
  };

  const pollJob = (jobId: string, assetType: string) => {
    setJobs(j => ({ ...j, [assetType]: { progress: 5, status: "processing" } }));
    const tick = async () => {
      const res = await fetch(`/api/jobs/${jobId}?${guestQuery()}`);
      const json = await res.json();
      if (!json.success) { setJobs(j => ({ ...j, [assetType]: { progress: 100, status: "failed" } })); return; }
      const { status, progress } = json.data;
      if (status === "completed" || status === "failed") {
        setJobs(j => ({ ...j, [assetType]: { progress: 100, status } }));
        if (status === "completed") setTimeout(() => window.location.reload(), 500);
        else setNotice(`${TYPE_META[assetType as keyof typeof TYPE_META].label} generation failed. Please try again.`);
      } else {
        setJobs(j => ({ ...j, [assetType]: { progress: Math.max(progress, j[assetType]?.progress ?? 0), status } }));
        setTimeout(tick, 700);
      }
    };
    setTimeout(tick, 500);
  };

  const restore = async (assetId: string) => {
    const res = await fetch(`/api/assets/${assetId}/restore?${guestQuery()}`, { method: "POST", headers: H() });
    const json = await res.json();
    if (json.success) window.location.reload();
    else setNotice(json.error?.message ?? "Could not restore that version.");
  };

  const saveBranding = async (andRegenerate: boolean) => {
    setNotice("");
    const colorsChanged = bi && (editForm.primary !== bi.primaryColor || editForm.secondary !== bi.secondaryColor || editForm.accent !== bi.accentColor);
    const res = await fetch(`/api/projects/${props.project.id}?${guestQuery()}`, {
      method: "PATCH", headers: H(),
      body: JSON.stringify({
        colors: { primary: editForm.primary, secondary: editForm.secondary, accent: editForm.accent, paletteName: null, source: "user" as const },
        logoStyle: editForm.logoStyle,
        typographyStyle: editForm.typographyStyle,
      }),
    });
    const json = await res.json();
    if (!json.success) { setNotice(json.error?.message ?? "Could not save branding."); return; }
    setEditOpen(false);
    if (andRegenerate && colorsChanged) {
      // Regenerate existing image assets with the new identity (spec §20).
      for (const t of ["logo", "banner", "watermark"] as const) {
        if (assets.some(a => a.assetType === t)) void regenerate(t);
      }
    } else {
      window.location.reload();
    }
  };

  const grouped = (t: "logo" | "banner" | "watermark") => assets.filter(a => a.assetType === t).sort((a, b) => b.version - a.version);

  return (
    <div className="section py-10">
      {notice && <div role="alert" className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">{notice}</div>}

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{bi?.channelName ?? selectedName?.name ?? "Your Brand Kit"}</h1>
          <Badge variant="violet">Brand Kit</Badge>
        </div>
        {props.tagline && <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">“{props.tagline}”</p>}
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">From the idea: “{props.project.idea}”</p>
        {bi && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[bi.primaryColor, bi.secondaryColor, bi.accentColor].map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs dark:border-slate-700">
                <span className="h-3 w-3 rounded-full" style={{ background: c }} aria-hidden /> {c}
              </span>
            ))}
            {bi.paletteName && <span className="text-xs text-slate-400">({bi.paletteName})</span>}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={`/api/projects/${props.project.id}/download?${guestQuery()}`} className="btn-primary">
            <Download className="h-4 w-4" aria-hidden /> Download Complete Kit
          </a>
          <button className="btn-secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" aria-hidden /> Change Branding
          </button>
        </div>
      </header>

      {/* ── Image assets with version history ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {(["logo", "banner", "watermark"] as const).map(t => {
          const versions = grouped(t);
          const current = versions.find(v => v.current) ?? versions[0];
          const meta = TYPE_META[t];
          const job = jobs[t];
          return (
            <Card key={t} className={t === "banner" ? "lg:col-span-2" : ""}>
              <CardTitle className="flex items-center gap-2"><meta.icon className="h-4 w-4 text-brand-600" aria-hidden /> {meta.label} <span className="text-xs font-normal text-slate-400">{meta.dim}</span></CardTitle>
              {current ? (
                <>
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800" style={t === "logo" || t === "watermark" ? { maxWidth: 240 } : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/assets/${current.id}/file?${guestQuery()}`} alt={`${meta.label} version ${current.version}`} className="w-full" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`/api/assets/${current.id}/file?${guestQuery()}`} download={`${props.project.id}-${t}.png`} className="btn-secondary !px-3 !py-2 !text-xs"><Download className="h-3.5 w-3.5" aria-hidden /> Download</a>
                    <button onClick={() => regenerate(t)} disabled={job?.status === "processing" || job?.status === "queued"} className="btn-secondary !px-3 !py-2 !text-xs">
                      {job && job.status !== "completed" && job.status !== "failed" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden />} Regenerate
                    </button>
                  </div>
                  {job && job.status !== "completed" && job.status !== "failed" && (
                    <div className="mt-3" role="status" aria-live="polite"><Progress value={job.progress} label={`Generating ${meta.label}`} /></div>
                  )}
                  {versions.length > 1 && (
                    <details className="mt-4">
                      <summary className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500"><History className="h-3.5 w-3.5" aria-hidden /> {versions.length} versions</summary>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {versions.map(v => (
                          <button key={v.id} onClick={() => !v.current && restore(v.id)} disabled={v.current}
                            className={`rounded-lg border p-1 ${v.current ? "border-brand-500 ring-1 ring-brand-500" : "border-slate-200 hover:border-brand-300 dark:border-slate-700"}`}
                            title={v.current ? `Version ${v.version} (current)` : `Restore version ${v.version}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`/api/assets/${v.id}/file?${guestQuery()}`} alt={`Version ${v.version}`} className="h-10 w-10 rounded object-cover" />
                          </button>
                        ))}
                      </div>
                    </details>
                  )}
                </>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
                  Not generated yet.
                  <button className="btn-secondary mt-3 !px-3 !py-2 !text-xs" onClick={() => regenerate(t)} disabled={job?.status === "processing"}>
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Generate {meta.label}
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ── Text assets ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {props.description && (
          <Card>
            <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-brand-600" aria-hidden /> Channel Description</CardTitle>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{props.description.short}</p>
            <details className="mt-2"><summary className="cursor-pointer text-xs font-medium text-brand-600">Full SEO description</summary>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{props.description.seo}</p></details>
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => copy(`${props.description!.short}\n\n${props.description!.seo}`, "desc")}>{copied === "desc" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />} Copy</button>
              <button className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => downloadText("channel-description.txt", `${props.description!.short}\n\n${props.description!.seo}`)}><Download className="h-3.5 w-3.5" aria-hidden /> Download</button>
            </div>
          </Card>
        )}
        {props.keywords && props.keywords.length > 0 && (
          <Card>
            <CardTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-brand-600" aria-hidden /> Channel Keywords <Badge>AI suggested</Badge></CardTitle>
            <div className="mt-3 space-y-3">
              {props.keywords.map(g => (
                <div key={g.category}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{g.category}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">{g.keywords.map(k => <span key={k} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{k}</span>)}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
        {props.thumbnailGuide && (
          <Card className="lg:col-span-2">
            <CardTitle className="flex items-center gap-2"><LayoutTemplate className="h-4 w-4 text-brand-600" aria-hidden /> Thumbnail Style Guide</CardTitle>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Style</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{props.thumbnailGuide.style}</p></div>
              <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Layout</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{props.thumbnailGuide.layout}</p></div>
              <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Typography</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{props.thumbnailGuide.typography}</p></div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Do</p><ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-slate-600 dark:text-slate-300">{props.thumbnailGuide.doList.map(d => <li key={d}>{d}</li>)}</ul></div>
              <div><p className="text-xs font-semibold uppercase tracking-wide text-red-500">Avoid</p><ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-slate-600 dark:text-slate-300">{props.thumbnailGuide.avoidList.map(d => <li key={d}>{d}</li>)}</ul></div>
            </div>
          </Card>
        )}
        {bi && (
          <Card>
            <CardTitle className="flex items-center gap-2"><SwatchBook className="h-4 w-4 text-brand-600" aria-hidden /> Brand Palette</CardTitle>
            <div className="mt-3 flex gap-3">
              {[{ c: bi.primaryColor, n: "Primary" }, { c: bi.secondaryColor, n: "Secondary" }, { c: bi.accentColor, n: "Accent" }].map(x => (
                <div key={x.n} className="text-center">
                  <div className="h-14 w-14 rounded-xl border border-slate-200 dark:border-slate-700" style={{ background: x.c }} />
                  <p className="mt-1 text-[11px] text-slate-500">{x.n}</p>
                  <p className="text-[11px] font-mono text-slate-400">{x.c}</p>
                </div>
              ))}
            </div>
            <button className="btn-secondary mt-3 !px-3 !py-1.5 !text-xs" onClick={() => downloadText("colors.json", JSON.stringify({ paletteName: bi.paletteName, source: bi.source, primary: bi.primaryColor, secondary: bi.secondaryColor, accent: bi.accentColor }, null, 2))}><Download className="h-3.5 w-3.5" aria-hidden /> colors.json</button>
          </Card>
        )}
        {props.tagline && (
          <Card>
            <CardTitle className="flex items-center gap-2"><Quote className="h-4 w-4 text-brand-600" aria-hidden /> Tagline</CardTitle>
            <p className="mt-3 text-lg font-medium">“{props.tagline}”</p>
            <button className="btn-secondary mt-3 !px-3 !py-1.5 !text-xs" onClick={() => copy(props.tagline!, "tagline")}>{copied === "tagline" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />} Copy</button>
          </Card>
        )}
      </div>

      {/* ── Change Branding dialog (spec §20) ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Change Branding">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {([["primary", "Primary"], ["secondary", "Secondary"], ["accent", "Accent"]] as const).map(([key, label]) => (
              <div key={key}>
                <label className="label" htmlFor={`c-${key}`}>{label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" aria-label={`${label} color picker`} value={editForm[key]} onChange={e => setEditForm({ ...editForm, [key]: e.target.value })} className="h-9 w-9 cursor-pointer rounded border border-slate-200 dark:border-slate-700" />
                  <input id={`c-${key}`} className="input !py-1.5 font-mono text-xs" value={editForm[key]} onChange={e => setEditForm({ ...editForm, [key]: e.target.value })} maxLength={7} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="label" htmlFor="logo-style">Logo style</label>
            <select id="logo-style" className="input" value={editForm.logoStyle} onChange={e => setEditForm({ ...editForm, logoStyle: e.target.value })}>
              {LOGO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="typo-style">Typography style</label>
            <input id="typo-style" className="input" value={editForm.typographyStyle} onChange={e => setEditForm({ ...editForm, typographyStyle: e.target.value })} maxLength={80} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setEditOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => {
              const colorsChanged = bi && (editForm.primary !== bi.primaryColor || editForm.secondary !== bi.secondaryColor || editForm.accent !== bi.accentColor);
              if (colorsChanged && assets.length > 0) setConfirmRegen(true);
              else void saveBranding(false);
            }}><Palette className="h-4 w-4" aria-hidden /> Save Branding</button>
          </div>
        </div>
      </Dialog>

      <Dialog open={confirmRegen} onClose={() => setConfirmRegen(false)} title="Regenerate assets?">
        <p className="text-sm text-slate-600 dark:text-slate-300">Changing your brand colors may affect visual consistency. Would you like to regenerate the related assets?</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => { setConfirmRegen(false); void saveBranding(false); }}>Keep Existing Assets</button>
          <button className="btn-primary" onClick={() => { setConfirmRegen(false); void saveBranding(true); }}><RefreshCw className="h-4 w-4" aria-hidden /> Yes, Regenerate</button>
        </div>
      </Dialog>
    </div>
  );
}
