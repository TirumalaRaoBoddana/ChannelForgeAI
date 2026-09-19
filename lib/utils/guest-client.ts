// Client-side guest identity, resilient to blocked third-party cookies
// (the app runs inside a cross-site preview iframe where some browsers
// refuse to store cookies). Strategy:
//   1. Use the server-issued cf_guest cookie when readable.
//   2. Otherwise persist our own token in localStorage and send it as the
//      x-cf-guest header on API calls / ?g= query param on navigations.
// The server treats cookie, header and query param as equivalent identities.

const LS_KEY = "cf_guest_local";

function randomToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return "g_" + Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export function clientGuestToken(): string {
  try {
    const m = document.cookie.match(/(?:^|;\s*)cf_guest=([^;]+)/);
    if (m) {
      localStorage.setItem(LS_KEY, m[1]); // keep in sync for cookie-blocked fallback
      return m[1];
    }
    let t = localStorage.getItem(LS_KEY);
    if (!t) { t = randomToken(); localStorage.setItem(LS_KEY, t); }
    return t;
  } catch {
    return randomToken(); // storage unavailable: ephemeral identity, best effort
  }
}

// Query string (without "?") carrying the guest identity for page navigations
// and plain <a> links, which cannot set custom headers.
export function guestQuery(): string {
  return `g=${encodeURIComponent(clientGuestToken())}`;
}
