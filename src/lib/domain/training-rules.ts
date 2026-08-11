import type {
  DayPlan,
  Exercise,
  Profile,
  StrengthSlot,
  TrainingBlockSlot,
  WeekdayKey,
} from "../hybrid";

export type TrainingGoalKey =
  | "hipertrofia"
  | "emagrecimento"
  | "futebol"
  | "corrida"
  | "ciclismo"
  | "basquete"
  | "volei"
  | "natacao"
  | "funcional"
  | "hibrido";

type MovementCategoryResolver = (slot: StrengthSlot) => string;
type ExerciseResolver = (id: string) => Exercise | undefined;

type ModalityRule = {
  aliases: string[];
  priorities: string[];
  keepStrengthGroups: string[];
  conditioningFrequency: "none" | "low" | "moderate" | "high";
  conditioningModalities: string[];
  coreFrequency: "low" | "moderate" | "high";
  mobilityFocus: string[];
  recoveryFocus: string;
  strengthVolumeFactor: number;
};

export const CONDITIONING_BANK: TrainingBlockSlot[] = [
  {
    nome: "Corrida Zona 2",
    tipo: "Condicionamento",
    modalidade: "Corrida",
    duracao: "30 minutos",
    prescricao: "Ritmo conversavel",
    objetivos: ["Corrida", "Emagrecimento", "Hibrido", "Futebol"],
  },
  {
    nome: "Sprint 10x100m",
    tipo: "Condicionamento",
    modalidade: "Sprint",
    duracao: "20 minutos",
    prescricao: "10 tiros de 100m",
    objetivos: ["Futebol", "Basquete", "Volei", "Hibrido"],
  },
  {
    nome: "HIIT Bike",
    tipo: "Condicionamento",
    modalidade: "Bike",
    duracao: "18 minutos",
    prescricao: "8x 30s forte / 90s leve",
    objetivos: ["Emagrecimento", "Ciclismo", "Hibrido"],
  },
  {
    nome: "Circuito Funcional",
    tipo: "Condicionamento",
    modalidade: "Funcional",
    duracao: "24 minutos",
    prescricao: "40s trabalho / 20s pausa",
    objetivos: ["Funcional", "Hibrido"],
  },
  {
    nome: "Tecnica de Mudanca de Direcao",
    tipo: "Condicionamento",
    modalidade: "Agilidade",
    duracao: "18 minutos",
    prescricao: "6 blocos curtos com pausa completa",
    objetivos: ["Futebol", "Basquete", "Volei", "Hibrido"],
  },
  {
    nome: "Nado Continuo Tecnico",
    tipo: "Condicionamento",
    modalidade: "Natacao",
    duracao: "25 minutos",
    prescricao: "Blocos leves focando respiracao e eficiencia",
    objetivos: ["Natacao", "Emagrecimento", "Hibrido"],
  },
];

export const CORE_BANK: TrainingBlockSlot[] = [
  { nome: "Prancha", tipo: "Core", prescricao: "3x45s" },
  { nome: "Dead Bug", tipo: "Core", prescricao: "3x10 por lado" },
  { nome: "Pallof Press", tipo: "Core", prescricao: "3x12 por lado" },
  { nome: "Farmer Carry", tipo: "Core", prescricao: "4x30m" },
];

export const MOBILITY_BANK: TrainingBlockSlot[] = [
  { nome: "Mobilidade de Quadril", tipo: "Mobilidade", duracao: "5 minutos" },
  { nome: "Mobilidade de Tornozelo", tipo: "Mobilidade", duracao: "5 minutos" },
  { nome: "Mobilidade de Ombro", tipo: "Mobilidade", duracao: "5 minutos" },
  { nome: "Mobilidade Toracica", tipo: "Mobilidade", duracao: "5 minutos" },
];

export const RECOVERY_BANK: TrainingBlockSlot[] = [
  { nome: "Caminhada regenerativa", tipo: "Recuperacao", duracao: "20 minutos" },
  { nome: "Respiracao e alongamento leve", tipo: "Recuperacao", duracao: "10 minutos" },
  { nome: "Soltura miofascial leve", tipo: "Recuperacao", duracao: "8 minutos" },
];

export const MODALITY_RULES: Record<TrainingGoalKey, ModalityRule> = {
  hipertrofia: {
    aliases: ["hipertrofia", "massa"],
    priorities: ["Volume equilibrado", "Progressao", "Amplitude"],
    keepStrengthGroups: ["Peito", "Costas", "Ombros", "Bracos", "Pernas"],
    conditioningFrequency: "low",
    conditioningModalities: ["Corrida", "Bike"],
    coreFrequency: "moderate",
    mobilityFocus: ["Ombro", "Quadril"],
    recoveryFocus: "Sono, descanso entre grupos e deload quando volume acumular.",
    strengthVolumeFactor: 1.15,
  },
  emagrecimento: {
    aliases: ["emagrecimento", "perda de gordura", "definicao"],
    priorities: ["Gasto calorico", "Zona 2", "HIIT dosado"],
    keepStrengthGroups: ["Full body", "Posterior", "Costas"],
    conditioningFrequency: "high",
    conditioningModalities: ["Corrida", "Bike", "Funcional"],
    coreFrequency: "moderate",
    mobilityFocus: ["Quadril", "Tornozelo"],
    recoveryFocus: "Controlar fadiga para manter frequencia semanal alta.",
    strengthVolumeFactor: 0.95,
  },
  futebol: {
    aliases: ["futebol", "soccer"],
    priorities: ["Potencia", "Explosao", "Core", "Mudanca de direcao", "Resistencia"],
    keepStrengthGroups: ["Peito", "Costas", "Ombros", "Bracos"],
    conditioningFrequency: "high",
    conditioningModalities: ["Sprint", "Agilidade", "Corrida"],
    coreFrequency: "high",
    mobilityFocus: ["Quadril", "Tornozelo", "Posterior"],
    recoveryFocus: "Proteger posterior, adutores e panturrilhas entre jogos.",
    strengthVolumeFactor: 0.9,
  },
  corrida: {
    aliases: ["corrida", "run", "running"],
    priorities: ["Gluteos", "Posterior", "Panturrilhas", "Core", "Resistencia"],
    keepStrengthGroups: ["Peito", "Costas", "Ombros"],
    conditioningFrequency: "high",
    conditioningModalities: ["Corrida"],
    coreFrequency: "high",
    mobilityFocus: ["Quadril", "Tornozelo", "Panturrilha"],
    recoveryFocus: "Alternar impacto e controlar intensidade dos treinos de perna.",
    strengthVolumeFactor: 0.85,
  },
  ciclismo: {
    aliases: ["ciclismo", "bike"],
    priorities: ["Quadriceps", "Gluteos", "Core", "Zona 2", "Limiar"],
    keepStrengthGroups: ["Costas", "Ombros", "Posterior"],
    conditioningFrequency: "high",
    conditioningModalities: ["Bike"],
    coreFrequency: "moderate",
    mobilityFocus: ["Quadril", "Tornozelo", "Toracica"],
    recoveryFocus: "Gerenciar fadiga de quadriceps e lombar.",
    strengthVolumeFactor: 0.9,
  },
  basquete: {
    aliases: ["basquete", "basket"],
    priorities: ["Potencia", "Saltos", "Mudanca de direcao", "Core", "Resistencia"],
    keepStrengthGroups: ["Peito", "Costas", "Ombros", "Bracos"],
    conditioningFrequency: "high",
    conditioningModalities: ["Sprint", "Agilidade"],
    coreFrequency: "high",
    mobilityFocus: ["Tornozelo", "Quadril", "Ombro"],
    recoveryFocus: "Dosar saltos e preservar joelhos/tendao patelar.",
    strengthVolumeFactor: 0.9,
  },
  volei: {
    aliases: ["volei", "volleyball"],
    priorities: ["Potencia", "Saltos", "Ombros", "Core", "Aterrissagem"],
    keepStrengthGroups: ["Costas", "Posterior", "Gluteos", "Bracos"],
    conditioningFrequency: "moderate",
    conditioningModalities: ["Agilidade", "Sprint"],
    coreFrequency: "high",
    mobilityFocus: ["Ombro", "Tornozelo", "Quadril"],
    recoveryFocus: "Controlar volume de salto e sobrecarga de ombro.",
    strengthVolumeFactor: 0.9,
  },
  natacao: {
    aliases: ["natacao", "swim"],
    priorities: ["Ombros", "Costas", "Core", "Respiracao", "Mobilidade toracica"],
    keepStrengthGroups: ["Pernas", "Gluteos", "Posterior"],
    conditioningFrequency: "high",
    conditioningModalities: ["Natacao"],
    coreFrequency: "high",
    mobilityFocus: ["Ombro", "Toracica", "Quadril"],
    recoveryFocus: "Evitar excesso de empurrar vertical e cuidar de manguito.",
    strengthVolumeFactor: 0.85,
  },
  funcional: {
    aliases: ["funcional", "cross", "crossfit"],
    priorities: ["Capacidade de trabalho", "Core", "Mobilidade", "Forca geral"],
    keepStrengthGroups: ["Full body"],
    conditioningFrequency: "high",
    conditioningModalities: ["Funcional", "Bike", "Corrida"],
    coreFrequency: "high",
    mobilityFocus: ["Quadril", "Ombro", "Tornozelo"],
    recoveryFocus: "Variar padroes e evitar repetir alta intensidade todos os dias.",
    strengthVolumeFactor: 1,
  },
  hibrido: {
    aliases: ["hibrido", "hybrid", "performance hibrida"],
    priorities: ["Massa muscular", "Forca", "Cardio", "Condicionamento"],
    keepStrengthGroups: ["Full body", "Peito", "Costas", "Pernas"],
    conditioningFrequency: "moderate",
    conditioningModalities: ["Corrida", "Bike", "Sprint", "Funcional"],
    coreFrequency: "high",
    mobilityFocus: ["Quadril", "Ombro", "Tornozelo"],
    recoveryFocus: "Equilibrar volume de musculacao e cardio pela proporcao escolhida.",
    strengthVolumeFactor: 1,
  },
};

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function resolveGoalKey(profile: Pick<Profile, "goal" | "sports">): TrainingGoalKey {
  const source = normalizeText(profile.goal || "");
  const sport = normalizeText(profile.sports?.[0]?.name ?? "");
  const combined = `${source} ${sport}`;
  const match = Object.entries(MODALITY_RULES).find(([, rule]) =>
    rule.aliases.some((alias) => combined.includes(normalizeText(alias))),
  );
  return (match?.[0] as TrainingGoalKey | undefined) ?? "hibrido";
}

export function getModalityRule(profile: Pick<Profile, "goal" | "sports">): ModalityRule {
  return MODALITY_RULES[resolveGoalKey(profile)];
}

export function createTrainingProgram(
  day: DayPlan,
  profile: Profile,
  index: number,
  options: { movementCategory: MovementCategoryResolver; getExercise: ExerciseResolver },
): DayPlan {
  const rule = getModalityRule(profile);
  const strength = applyStrengthRules(
    day.strength,
    profile,
    rule,
    options.movementCategory,
    options.getExercise,
  );
  const condicionamento = shouldAddConditioning(profile, rule, index, day.rest)
    ? pickConditioning(profile, rule, index)
    : [];
  const core = shouldAddCore(rule, index, day.rest) ? [CORE_BANK[index % CORE_BANK.length]] : [];
  const mobilidade = pickMobility(rule, index);
  const recuperacao = day.rest ? [pickRecovery(index)] : [];
  const extraMin = [...condicionamento, ...core, ...mobilidade, ...recuperacao].reduce(
    (sum, block) => sum + minutesFromBlock(block),
    0,
  );

  return {
    ...day,
    focus: decorateFocus(day.focus, rule),
    strength,
    musculacao: strength,
    condicionamento,
    core,
    mobilidade,
    recuperacao,
    programa: { musculacao: strength, condicionamento, core, mobilidade, recuperacao },
    estimatedMin: Math.min(180, day.estimatedMin + extraMin),
  };
}

export function weekdayFromText(text: string): WeekdayKey | undefined {
  const normalized = normalizeText(text);
  if (/segunda|\bseg\b/.test(normalized)) return "seg";
  if (/terca|\bter\b/.test(normalized)) return "ter";
  if (/quarta|\bqua\b/.test(normalized)) return "qua";
  if (/quinta|\bqui\b/.test(normalized)) return "qui";
  if (/sexta|\bsex\b/.test(normalized)) return "sex";
  if (/sabado|\bsab\b/.test(normalized)) return "sab";
  if (/domingo|\bdom\b/.test(normalized)) return "dom";
}

export function pickRecovery(index: number): TrainingBlockSlot {
  return RECOVERY_BANK[index % RECOVERY_BANK.length];
}

function applyStrengthRules(
  slots: StrengthSlot[],
  profile: Profile,
  rule: ModalityRule,
  movementCategory: MovementCategoryResolver,
  getExercise: ExerciseResolver,
): StrengthSlot[] {
  const deduped = prioritizeStrength(dedupeByMovement(slots, movementCategory), rule, getExercise);
  const focusStrength =
    profile.focoMusculacao ?? (resolveGoalKey(profile) === "hibrido" ? 60 : 100);
  const hybridFactor =
    resolveGoalKey(profile) === "hibrido" ? Math.max(0.6, focusStrength / 70) : 1;
  const maxSlots = Math.max(
    3,
    Math.round(deduped.length * rule.strengthVolumeFactor * hybridFactor),
  );
  return deduped.slice(0, Math.min(deduped.length, maxSlots));
}

function prioritizeStrength(
  slots: StrengthSlot[],
  rule: ModalityRule,
  getExercise: ExerciseResolver,
): StrengthSlot[] {
  return [...slots].sort(
    (a, b) => scoreStrengthSlot(b, rule, getExercise) - scoreStrengthSlot(a, rule, getExercise),
  );
}

function scoreStrengthSlot(
  slot: StrengthSlot,
  rule: ModalityRule,
  getExercise: ExerciseResolver,
): number {
  const exercise = getExercise(slot.exerciseId);
  const searchable = normalizeText(
    [exercise?.group, ...(exercise?.secondary ?? []), exercise?.name, exercise?.pattern, slot.name]
      .filter(Boolean)
      .join(" "),
  );

  return rule.priorities.reduce((score, priority, index) => {
    const key = normalizeText(priority);
    return searchable.includes(key) ? score + (rule.priorities.length - index) : score;
  }, 0);
}

function dedupeByMovement(
  slots: StrengthSlot[],
  movementCategory: MovementCategoryResolver,
): StrengthSlot[] {
  const used = new Set<string>();
  return slots.filter((slot) => {
    const category = movementCategory(slot);
    if (used.has(category)) return false;
    used.add(category);
    return true;
  });
}

function shouldAddConditioning(
  profile: Profile,
  rule: ModalityRule,
  index: number,
  rest?: boolean,
): boolean {
  if (rest || rule.conditioningFrequency === "none") return false;

  if (resolveGoalKey(profile) === "hibrido") {
    const focusConditioning = profile.focoCondicionamento ?? 40;
    if (focusConditioning >= 50) return true;
    if (focusConditioning >= 30) return index % 2 === 1 || index === 5;
    return index === 5;
  }

  if (rule.conditioningFrequency === "high") return true;
  if (rule.conditioningFrequency === "moderate") return index % 2 === 0 || index === 5;
  return index === 5;
}

function shouldAddCore(rule: ModalityRule, index: number, rest?: boolean): boolean {
  if (rest) return false;
  if (rule.coreFrequency === "high") return true;
  if (rule.coreFrequency === "moderate") return index % 2 === 0;
  return index === 2;
}

function pickConditioning(
  profile: Profile,
  rule: ModalityRule,
  index: number,
): TrainingBlockSlot[] {
  const goal = resolveGoalKey(profile);
  const preferred = CONDITIONING_BANK.filter((item) => {
    const modality = normalizeText(item.modalidade ?? item.nome);
    const objectiveMatch = item.objetivos?.some((objective) =>
      normalizeText(objective).includes(goal),
    );
    const modalityMatch = rule.conditioningModalities.some((name) =>
      modality.includes(normalizeText(name)),
    );
    return objectiveMatch || modalityMatch;
  });
  const bank = preferred.length ? preferred : CONDITIONING_BANK;
  return [bank[index % bank.length]];
}

function pickMobility(rule: ModalityRule, index: number): TrainingBlockSlot[] {
  const preferred = MOBILITY_BANK.filter((item) =>
    rule.mobilityFocus.some((focus) => normalizeText(item.nome).includes(normalizeText(focus))),
  );
  const bank = preferred.length ? preferred : MOBILITY_BANK;
  return [bank[index % bank.length]];
}

function decorateFocus(focus: string, rule: ModalityRule): string {
  const priority = rule.priorities[0];
  if (!priority || focus.includes(priority)) return focus;
  return `${focus} | ${priority}`;
}

function minutesFromBlock(block?: TrainingBlockSlot): number {
  const match = (block?.duracao ?? block?.prescricao ?? "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}
