import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/coach")({
  head: () => ({ meta: [{ title: "Coach removido - Hybrid Trainer" }] }),
  component: CoachPage,
});

function CoachPage() {
  return (
    <div className="min-h-screen px-5 pt-10 pb-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        Recurso removido
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase leading-none">Coach IA desativado</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        A parte de Coach IA foi retirada. O foco agora e gerar, importar e editar programas
        completos de treino.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-primary px-4 py-3 font-mono text-xs uppercase text-primary-foreground"
      >
        Voltar ao treino
      </Link>
    </div>
  );
}
