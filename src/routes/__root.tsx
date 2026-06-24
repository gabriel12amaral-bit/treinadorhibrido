import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useStore } from "@/lib/store";
import { registerPWA } from "@/pwa-register";
import { CalendarDays, Dumbbell, Home, LineChart, Sparkles, User } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Página não encontrada.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Voltar</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Tentar de novo</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Hybrid Trainer — Treinador Híbrido Inteligente" },
      { name: "description", content: "Musculação, corrida e esportes em um único plano personalizado por IA." },
      { name: "theme-color", content: "#0a0a0f" },
      { property: "og:title", content: "Hybrid Trainer — Treinador Híbrido Inteligente" },
      { property: "og:description", content: "Musculação, corrida e esportes em um único plano personalizado por IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Hybrid Trainer — Treinador Híbrido Inteligente" },
      { name: "twitter:description", content: "Musculação, corrida e esportes em um único plano personalizado por IA." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/834341c0-fffe-461e-9006-0faf36402c72/id-preview-347c8d23--22b6fcb3-f4c7-41d6-8fd9-96aa8bbb9120.lovable.app-1781754717452.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/834341c0-fffe-461e-9006-0faf36402c72/id-preview-347c8d23--22b6fcb3-f4c7-41d6-8fd9-96aa8bbb9120.lovable.app-1781754717452.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Hybrid Trainer" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppFrame />
    </QueryClientProvider>
  );
}

function AppFrame() {
  const hydrate = useStore((s) => s.hydrate);
  const onboarded = useStore((s) => s.onboarded);
  const hydrated = useStore((s) => s.hydrated);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { registerPWA(); }, []);

  const hideNav = !hydrated || !onboarded || pathname.startsWith("/onboarding");

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[430px] overflow-x-hidden bg-background text-foreground">
      <div style={{ paddingBottom: hideNav ? undefined : "calc(80px + env(safe-area-inset-bottom))" }}>
        <Outlet />
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

const TABS = [
  { to: "/", label: "Hoje", icon: Home },
  { to: "/treinos", label: "Treinos", icon: Dumbbell },
  { to: "/coach", label: "Coach", icon: Sparkles },
  { to: "/calendario", label: "Agenda", icon: CalendarDays },
  { to: "/evolucao", label: "Evolução", icon: LineChart },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border/60 bg-background/80 px-4 pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur-xl">
      <ul className="flex items-center justify-between">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link to={to} activeOptions={{ exact: to === "/" }} className="group flex flex-col items-center gap-1 py-1">
              {({ isActive }) => (
                <>
                  <Icon className={`size-5 transition ${isActive ? "text-primary" : "text-muted-foreground"}`} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span className={`font-mono text-[9px] uppercase tracking-widest ${isActive ? "text-primary" : "text-muted-foreground/70"}`}>{label}</span>
                  <span className={`h-0.5 w-6 rounded-full transition ${isActive ? "bg-primary" : "bg-transparent"}`} />
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
