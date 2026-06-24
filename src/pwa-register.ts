// Guarded PWA registration. Refuses in dev, iframe, and Lovable preview hosts.
// Supports `?sw=off` kill switch.

const SW_PATH = "/sw.js";

function isUnsafeHost(): boolean {
  if (typeof window === "undefined") return true;
  const { hostname } = window.location;
  if (window.self !== window.top) return true; // inside iframe (Lovable preview)
  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return true;
  if (hostname === "lovableproject.com" || hostname.endsWith(".lovableproject.com")) return true;
  if (hostname === "lovableproject-dev.com" || hostname.endsWith(".lovableproject-dev.com")) return true;
  if (hostname === "beta.lovable.dev" || hostname.endsWith(".beta.lovable.dev")) return true;
  return false;
}

async function unregisterMatching() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs
      .filter((r) => {
        const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
        return url.endsWith(SW_PATH);
      })
      .map((r) => r.unregister()),
  );
}

export async function registerPWA() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const url = new URL(window.location.href);
  const killSwitch = url.searchParams.get("sw") === "off";
  const isProd = import.meta.env.PROD;

  if (!isProd || isUnsafeHost() || killSwitch) {
    await unregisterMatching();
    return;
  }

  try {
    const { registerSW } = await import("virtual:pwa-register");
    registerSW({ immediate: true });
  } catch {
    // virtual module not available in this build mode; ignore
  }
}
