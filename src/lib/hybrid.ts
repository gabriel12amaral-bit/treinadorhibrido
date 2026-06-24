// Hybrid Trainer — mock data, exercise database & AI-style plan generator.
// Replace with Lovable Cloud + AI Gateway later for real persistence and personalization.

export type MuscleGroup =
  | "Peito" | "Costas" | "Ombros" | "Bíceps" | "Tríceps"
  | "Quadríceps" | "Posterior" | "Glúteos" | "Panturrilhas" | "Abdômen"
  | "Antebraço" | "Cardio";

export type MovementPattern =
  | "push-horizontal" | "push-vertical"
  | "pull-vertical" | "pull-horizontal"
  | "squat" | "hinge" | "lunge"
  | "isolation-chest" | "isolation-back" | "isolation-shoulder"
  | "isolation-biceps" | "isolation-triceps"
  | "isolation-quad" | "isolation-hamstring" | "isolation-glute" | "isolation-calf"
  | "core" | "carry" | "cardio";

export type Exercise = {
  id: string;
  name: string;
  group: MuscleGroup;
  secondary?: MuscleGroup[];
  pattern?: MovementPattern;
  type?: "composto" | "isolador";
  equipment: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  description: string;
  cues: string[];
  mistakes: string[];
  safety?: string[];
  defaultSets?: number;
  defaultReps?: string;
  defaultRestSec?: number;
  image: string;
};

type ExInit = Partial<Exercise> & Pick<Exercise, "id" | "name" | "group" | "equipment" | "difficulty">;
const ex = (e: ExInit): Exercise => ({ description: "", cues: [], mistakes: [], image: "💪", ...e });

export const EXERCISES: Exercise[] = [
  // ============ PEITO (15) ============
  ex({ id: "supino-reto-barra", name: "Supino Reto Barra", group: "Peito", secondary: ["Tríceps","Ombros"], pattern: "push-horizontal", type: "composto", equipment: "Barra + Banco", difficulty: "Intermediário", image: "🏋️",
    description: "Composto rei do peitoral, recruta tríceps e deltoide anterior.",
    cues: ["Escápulas retraídas","Pés firmes","Barra na linha do mamilo"],
    mistakes: ["Quadril levantado","Cotovelos abertos 90°","Saltar a barra no peito"],
    safety: ["Use sempre presilhas","Tenha um observador para cargas máximas"] }),
  ex({ id: "supino-reto-halteres", name: "Supino Reto Halteres", group: "Peito", secondary: ["Tríceps","Ombros"], pattern: "push-horizontal", type: "composto", equipment: "Halteres + Banco", difficulty: "Iniciante", image: "🏋️",
    description: "Variação com maior amplitude e ativação de estabilizadores.",
    cues: ["Cotovelos a 45°","Punhos neutros"], mistakes: ["Bater os halteres no topo"] }),
  ex({ id: "supino-incl-barra", name: "Supino Inclinado Barra", group: "Peito", secondary: ["Ombros","Tríceps"], pattern: "push-horizontal", type: "composto", equipment: "Barra + Banco 30°", difficulty: "Intermediário", image: "📈",
    description: "Foco na porção clavicular do peitoral.",
    cues: ["Banco a 30°","Barra na linha do peito alto"], mistakes: ["Banco muito inclinado vira ombro"] }),
  ex({ id: "supino-incl-halteres", name: "Supino Inclinado Halteres", group: "Peito", secondary: ["Ombros","Tríceps"], pattern: "push-horizontal", type: "composto", equipment: "Halteres + Banco 30°", difficulty: "Iniciante", image: "💪",
    description: "Foca na porção clavicular com amplitude maior.",
    cues: ["Cotovelos a 45°","Descida controlada"], mistakes: ["Banco muito inclinado"] }),
  ex({ id: "supino-decl-barra", name: "Supino Declinado Barra", group: "Peito", secondary: ["Tríceps"], pattern: "push-horizontal", type: "composto", equipment: "Barra + Banco Declinado", difficulty: "Intermediário", image: "⬇️",
    description: "Trabalha a porção inferior do peitoral.",
    cues: ["Pés travados","Barra na linha do peito inferior"], mistakes: ["Amplitude curta"] }),
  ex({ id: "supino-maquina", name: "Supino Máquina", group: "Peito", secondary: ["Tríceps"], pattern: "push-horizontal", type: "composto", equipment: "Máquina Supino", difficulty: "Iniciante", image: "🔩",
    description: "Padrão guiado, seguro para iniciantes.",
    cues: ["Costas apoiadas","Empurrar até quase travar"], mistakes: ["Pegada muito larga"] }),
  ex({ id: "chest-press", name: "Chest Press", group: "Peito", secondary: ["Tríceps"], pattern: "push-horizontal", type: "composto", equipment: "Máquina", difficulty: "Iniciante", image: "🟦",
    description: "Empurrar horizontal guiado.",
    cues: ["Costas no encosto","Movimento controlado"], mistakes: ["Hiperextensão lombar"] }),
  ex({ id: "crucifixo-reto", name: "Crucifixo Reto", group: "Peito", pattern: "isolation-chest", type: "isolador", equipment: "Halteres + Banco", difficulty: "Iniciante", image: "🦋",
    description: "Isolador para peitoral, foco na adução.",
    cues: ["Leve flexão de cotovelo fixa","Abertura até linha do ombro"], mistakes: ["Cotovelos retos demais","Amplitude excessiva"] }),
  ex({ id: "crucifixo-incl", name: "Crucifixo Inclinado", group: "Peito", pattern: "isolation-chest", type: "isolador", equipment: "Halteres + Banco 30°", difficulty: "Iniciante", image: "🦋",
    description: "Isolador focado no peitoral superior.",
    cues: ["Banco a 30°","Cotovelos levemente flexionados"], mistakes: ["Soltar peso no fim da amplitude"] }),
  ex({ id: "peck-deck", name: "Peck Deck", group: "Peito", pattern: "isolation-chest", type: "isolador", equipment: "Máquina Peck Deck", difficulty: "Iniciante", image: "🦋",
    description: "Adução horizontal guiada, ótimo para iniciantes.",
    cues: ["Costas no encosto","Pico de contração ao centro"], mistakes: ["Amplitude excessiva no início"] }),
  ex({ id: "crossover-alto", name: "Crossover Alto", group: "Peito", pattern: "isolation-chest", type: "isolador", equipment: "Polia Dupla Alta", difficulty: "Iniciante", image: "✝️",
    description: "Foco em peitoral inferior.",
    cues: ["Inclinação leve de tronco","Cruzar mãos abaixo do umbigo"], mistakes: ["Usar braços ao invés do peito"] }),
  ex({ id: "crossover-medio", name: "Crossover Médio", group: "Peito", pattern: "isolation-chest", type: "isolador", equipment: "Polia Dupla", difficulty: "Iniciante", image: "✝️",
    description: "Adução horizontal com tensão constante.",
    cues: ["Tronco neutro","Mãos na altura do peito"], mistakes: ["Ombros encolhidos"] }),
  ex({ id: "crossover-baixo", name: "Crossover Baixo", group: "Peito", pattern: "isolation-chest", type: "isolador", equipment: "Polia Dupla Baixa", difficulty: "Iniciante", image: "✝️",
    description: "Foco em peitoral superior, similar ao supino inclinado.",
    cues: ["Mãos sobem na diagonal","Pico de contração à frente do rosto"], mistakes: ["Curvar a coluna"] }),
  ex({ id: "flexao", name: "Flexão Tradicional", group: "Peito", secondary: ["Tríceps","Ombros","Abdômen"], pattern: "push-horizontal", type: "composto", equipment: "Peso Corporal", difficulty: "Iniciante", image: "🤸",
    description: "Empurrar horizontal sem equipamento.",
    cues: ["Corpo alinhado","Cotovelos a 45°"], mistakes: ["Quadril caído","Amplitude curta"] }),
  ex({ id: "flexao-inclinada", name: "Flexão Inclinada", group: "Peito", secondary: ["Tríceps"], pattern: "push-horizontal", type: "composto", equipment: "Peso Corporal + Banco", difficulty: "Iniciante", image: "🤸",
    description: "Variação mais leve para iniciantes.",
    cues: ["Mãos no banco","Linha reta cabeça-quadril"], mistakes: ["Cotovelos abertos"] }),

  // ============ COSTAS (18) ============
  ex({ id: "puxada-frontal", name: "Puxada Frontal Aberta", group: "Costas", secondary: ["Bíceps"], pattern: "pull-vertical", type: "composto", equipment: "Polia Alta", difficulty: "Iniciante", image: "🧗",
    description: "Trabalho de latíssimo com pegada pronada aberta.",
    cues: ["Peito alto","Cotovelos descem para os lados","Barra na clavícula"], mistakes: ["Balançar tronco"] }),
  ex({ id: "puxada-fechada", name: "Puxada Frontal Fechada", group: "Costas", secondary: ["Bíceps"], pattern: "pull-vertical", type: "composto", equipment: "Polia Alta", difficulty: "Iniciante", image: "🧗",
    description: "Pegada fechada pronada, foco em dorsal médio.",
    cues: ["Pegada na largura dos ombros"], mistakes: ["Inclinar muito o tronco"] }),
  ex({ id: "puxada-supinada", name: "Puxada Supinada", group: "Costas", secondary: ["Bíceps"], pattern: "pull-vertical", type: "composto", equipment: "Polia Alta", difficulty: "Iniciante", image: "🧗",
    description: "Pegada supinada recruta mais bíceps e dorsal inferior.",
    cues: ["Cotovelos colados ao corpo"], mistakes: ["Usar impulso"] }),
  ex({ id: "puxada-neutra", name: "Puxada Neutra", group: "Costas", secondary: ["Bíceps"], pattern: "pull-vertical", type: "composto", equipment: "Polia Alta + Triângulo", difficulty: "Iniciante", image: "🧗",
    description: "Pegada neutra, confortável para ombro e cotovelo.",
    cues: ["Trazer cabo até o peito"], mistakes: ["Curvar lombar"] }),
  ex({ id: "barra-fixa-pronada", name: "Barra Fixa Pronada", group: "Costas", secondary: ["Bíceps"], pattern: "pull-vertical", type: "composto", equipment: "Barra Fixa", difficulty: "Avançado", image: "🆙",
    description: "Puxada vertical com peso corporal, pegada pronada.",
    cues: ["Escápulas ativas","Subir até o queixo passar"], mistakes: ["Balançar"] }),
  ex({ id: "barra-fixa-supinada", name: "Barra Fixa Supinada", group: "Costas", secondary: ["Bíceps"], pattern: "pull-vertical", type: "composto", equipment: "Barra Fixa", difficulty: "Avançado", image: "🆙",
    description: "Pegada supinada, maior ativação de bíceps.",
    cues: ["Cotovelos para baixo"], mistakes: ["Amplitude parcial"] }),
  ex({ id: "barra-fixa-neutra", name: "Barra Fixa Neutra", group: "Costas", secondary: ["Bíceps"], pattern: "pull-vertical", type: "composto", equipment: "Barra Fixa", difficulty: "Intermediário", image: "🆙",
    description: "Pegada neutra confortável para articulações.",
    cues: ["Subida controlada"], mistakes: ["Balanço"] }),
  ex({ id: "remada-baixa", name: "Remada Baixa", group: "Costas", secondary: ["Bíceps"], pattern: "pull-horizontal", type: "composto", equipment: "Polia Baixa + Triângulo", difficulty: "Iniciante", image: "🪝",
    description: "Trabalha dorsal médio e romboides.",
    cues: ["Tronco ereto","Puxar até o umbigo"], mistakes: ["Curvar a lombar"] }),
  ex({ id: "remada-unilateral", name: "Remada Unilateral Halter", group: "Costas", secondary: ["Bíceps"], pattern: "pull-horizontal", type: "composto", equipment: "Halter + Banco", difficulty: "Intermediário", image: "🪓",
    description: "Foco unilateral em dorsal e romboides.",
    cues: ["Apoio firme no banco","Cotovelo rente ao corpo"], mistakes: ["Rotacionar tronco"] }),
  ex({ id: "remada-curvada", name: "Remada Curvada", group: "Costas", secondary: ["Bíceps","Posterior"], pattern: "pull-horizontal", type: "composto", equipment: "Barra", difficulty: "Avançado", image: "🚣",
    description: "Composto pesado para dorsal, romboides e trapézio médio.",
    cues: ["Tronco a 45°","Puxar até abdômen"], mistakes: ["Lombar arredondada"],
    safety: ["Mantenha core firme","Evite se tem dor lombar"] }),
  ex({ id: "remada-cavalinho", name: "Remada Cavalinho", group: "Costas", secondary: ["Bíceps"], pattern: "pull-horizontal", type: "composto", equipment: "Barra T", difficulty: "Intermediário", image: "🐴",
    description: "Remada com apoio peitoral ou barra T.",
    cues: ["Cotovelos rentes ao corpo"], mistakes: ["Subir explosivo"] }),
  ex({ id: "t-bar-row", name: "T-Bar Row", group: "Costas", secondary: ["Bíceps"], pattern: "pull-horizontal", type: "composto", equipment: "Barra T", difficulty: "Intermediário", image: "🅣",
    description: "Remada com barra T, foco em dorsal médio.",
    cues: ["Quadril para trás","Tronco a 30-45°"], mistakes: ["Curvar coluna"] }),
  ex({ id: "remada-articulada", name: "Remada Articulada", group: "Costas", secondary: ["Bíceps"], pattern: "pull-horizontal", type: "composto", equipment: "Máquina", difficulty: "Iniciante", image: "🔧",
    description: "Remada guiada por máquina, segura.",
    cues: ["Peito apoiado","Pico de contração"], mistakes: ["Soltar o peso"] }),
  ex({ id: "pulldown-estendido", name: "Pulldown Braços Estendidos", group: "Costas", pattern: "isolation-back", type: "isolador", equipment: "Polia Alta + Barra", difficulty: "Iniciante", image: "📐",
    description: "Isolador para latíssimo do dorso.",
    cues: ["Braços estendidos","Empurrar barra até as coxas"], mistakes: ["Flexionar cotovelos"] }),
  ex({ id: "pull-over", name: "Pull-over", group: "Costas", secondary: ["Peito"], pattern: "isolation-back", type: "isolador", equipment: "Halter + Banco", difficulty: "Intermediário", image: "🛌",
    description: "Trabalha latíssimo e serrátil.",
    cues: ["Cotovelos semi-flexionados","Amplitude completa"], mistakes: ["Quadril levantar"] }),
  ex({ id: "remada-sentado-cabo", name: "Remada Sentado Cabo", group: "Costas", secondary: ["Bíceps"], pattern: "pull-horizontal", type: "composto", equipment: "Polia Baixa", difficulty: "Iniciante", image: "🪑",
    description: "Remada com cabo guiado, foco em dorsal médio.",
    cues: ["Tronco quase vertical"], mistakes: ["Balançar para trás"] }),
  ex({ id: "remada-smith", name: "Remada Smith", group: "Costas", secondary: ["Bíceps"], pattern: "pull-horizontal", type: "composto", equipment: "Smith", difficulty: "Intermediário", image: "🚂",
    description: "Remada guiada pela barra Smith.",
    cues: ["Joelhos semi-flexionados","Cotovelos rentes"], mistakes: ["Curvar lombar"] }),
  ex({ id: "remada-invertida", name: "Remada Invertida", group: "Costas", secondary: ["Bíceps","Abdômen"], pattern: "pull-horizontal", type: "composto", equipment: "Barra Fixa Baixa", difficulty: "Iniciante", image: "⬆️",
    description: "Puxar peso corporal abaixo de uma barra.",
    cues: ["Corpo reto","Puxar peito até a barra"], mistakes: ["Quadril caído"] }),

  // ============ OMBROS (13) ============
  ex({ id: "desenvolvimento-barra", name: "Desenvolvimento Barra", group: "Ombros", secondary: ["Tríceps"], pattern: "push-vertical", type: "composto", equipment: "Barra", difficulty: "Intermediário", image: "🏔️",
    description: "Empurrar vertical pesado.",
    cues: ["Core firme","Barra passa pelo rosto"], mistakes: ["Hiperextensão lombar"] }),
  ex({ id: "desenvolvimento-halteres", name: "Desenvolvimento Halteres", group: "Ombros", secondary: ["Tríceps"], pattern: "push-vertical", type: "composto", equipment: "Halteres", difficulty: "Iniciante", image: "🏔️",
    description: "Empurrar vertical com amplitude maior.",
    cues: ["Cotovelos a 45°","Empurrar acima da cabeça"], mistakes: ["Trancar cotovelos bruscamente"] }),
  ex({ id: "desenvolvimento-maquina", name: "Desenvolvimento Máquina", group: "Ombros", secondary: ["Tríceps"], pattern: "push-vertical", type: "composto", equipment: "Máquina", difficulty: "Iniciante", image: "🔩",
    description: "Padrão guiado para ombro.",
    cues: ["Costas apoiadas"], mistakes: ["Encolher os ombros"] }),
  ex({ id: "desenvolvimento-smith", name: "Desenvolvimento Smith", group: "Ombros", secondary: ["Tríceps"], pattern: "push-vertical", type: "composto", equipment: "Smith", difficulty: "Iniciante", image: "🚂",
    description: "Empurrar vertical guiado.",
    cues: ["Barra na linha do queixo"], mistakes: ["Lombar arqueada"] }),
  ex({ id: "arnold-press", name: "Arnold Press", group: "Ombros", secondary: ["Tríceps"], pattern: "push-vertical", type: "composto", equipment: "Halteres", difficulty: "Intermediário", image: "🌀",
    description: "Desenvolvimento com rotação, recruta todas as cabeças.",
    cues: ["Inicia supinado, termina pronado"], mistakes: ["Movimento rápido demais"] }),
  ex({ id: "desenvolvimento-militar", name: "Desenvolvimento Militar", group: "Ombros", secondary: ["Tríceps"], pattern: "push-vertical", type: "composto", equipment: "Barra", difficulty: "Avançado", image: "🎖️",
    description: "Empurrar vertical em pé, foco em deltoide anterior.",
    cues: ["Glúteo contraído","Barra passa pelo rosto"], mistakes: ["Hiperlordose lombar"] }),
  ex({ id: "elevacao-lateral", name: "Elevação Lateral", group: "Ombros", pattern: "isolation-shoulder", type: "isolador", equipment: "Halteres", difficulty: "Iniciante", image: "🪂",
    description: "Isolador para deltoide medial.",
    cues: ["Leve flexão de cotovelo","Elevar até linha do ombro"], mistakes: ["Usar trapézio","Pesos altos demais"] }),
  ex({ id: "elevacao-lateral-uni", name: "Elevação Lateral Unilateral", group: "Ombros", pattern: "isolation-shoulder", type: "isolador", equipment: "Halter ou Polia", difficulty: "Iniciante", image: "🪂",
    description: "Unilateral com mais foco e controle.",
    cues: ["Apoio com a mão livre"], mistakes: ["Movimento balístico"] }),
  ex({ id: "elevacao-frontal", name: "Elevação Frontal", group: "Ombros", pattern: "isolation-shoulder", type: "isolador", equipment: "Halteres", difficulty: "Iniciante", image: "👆",
    description: "Isolador para deltoide anterior.",
    cues: ["Subir até linha do ombro"], mistakes: ["Usar impulso de quadril"] }),
  ex({ id: "crucifixo-inverso", name: "Crucifixo Inverso", group: "Ombros", pattern: "isolation-shoulder", type: "isolador", equipment: "Halteres", difficulty: "Iniciante", image: "🔄",
    description: "Isolador para deltoide posterior.",
    cues: ["Tronco inclinado à frente"], mistakes: ["Usar trapézio"] }),
  ex({ id: "face-pull", name: "Face Pull", group: "Ombros", secondary: ["Costas"], pattern: "isolation-shoulder", type: "isolador", equipment: "Polia Alta + Corda", difficulty: "Iniciante", image: "🪢",
    description: "Trabalha deltoide posterior e rotadores externos.",
    cues: ["Puxar corda até o rosto","Rotacionar punhos para fora"], mistakes: ["Cotovelos baixos"] }),
  ex({ id: "remada-alta", name: "Remada Alta", group: "Ombros", secondary: ["Bíceps"], pattern: "push-vertical", type: "composto", equipment: "Barra ou Polia", difficulty: "Intermediário", image: "⬆️",
    description: "Recruta deltoide medial e trapézio.",
    cues: ["Cotovelos acima do punho"], mistakes: ["Pegada muito fechada"] }),
  ex({ id: "deltoide-post-maquina", name: "Máquina Deltóide Posterior", group: "Ombros", pattern: "isolation-shoulder", type: "isolador", equipment: "Máquina Peck Deck Inversa", difficulty: "Iniciante", image: "🔄",
    description: "Isolador guiado para deltoide posterior.",
    cues: ["Peito apoiado","Apertar escápulas"], mistakes: ["Encolher ombros"] }),

  // ============ BÍCEPS (12) ============
  ex({ id: "rosca-direta", name: "Rosca Direta", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Barra Reta", difficulty: "Iniciante", image: "💪",
    description: "Trabalho principal de bíceps braquial.",
    cues: ["Cotovelos colados ao tronco"], mistakes: ["Balançar quadril"] }),
  ex({ id: "rosca-barra-w", name: "Rosca Barra W", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Barra W", difficulty: "Iniciante", image: "🅦",
    description: "Pegada mais confortável para punhos.",
    cues: ["Cotovelos fixos"], mistakes: ["Subida com impulso"] }),
  ex({ id: "rosca-alternada", name: "Rosca Alternada", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Halteres", difficulty: "Iniciante", image: "🔁",
    description: "Bíceps unilateral com supinação.",
    cues: ["Supinar punho na subida"], mistakes: ["Balançar tronco"] }),
  ex({ id: "rosca-martelo", name: "Rosca Martelo", group: "Bíceps", secondary: ["Antebraço"], pattern: "isolation-biceps", type: "isolador", equipment: "Halteres", difficulty: "Iniciante", image: "🔨",
    description: "Trabalha braquial e braquiorradial.",
    cues: ["Pegada neutra"], mistakes: ["Rotacionar punho"] }),
  ex({ id: "rosca-concentrada", name: "Rosca Concentrada", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Halter + Banco", difficulty: "Iniciante", image: "🎯",
    description: "Isolador com apoio do cotovelo na coxa.",
    cues: ["Pico de contração no topo"], mistakes: ["Soltar peso na descida"] }),
  ex({ id: "rosca-scott", name: "Rosca Scott", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Banco Scott + Barra W", difficulty: "Intermediário", image: "🪑",
    description: "Isolador de bíceps com apoio anterior.",
    cues: ["Cotovelos apoiados"], mistakes: ["Estender e relaxar"] }),
  ex({ id: "rosca-scott-maquina", name: "Rosca Scott Máquina", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Máquina Scott", difficulty: "Iniciante", image: "🪑",
    description: "Versão guiada da Scott.",
    cues: ["Movimento controlado"], mistakes: ["Carga excessiva"] }),
  ex({ id: "rosca-inclinada", name: "Rosca Inclinada", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Halteres + Banco 60°", difficulty: "Intermediário", image: "📐",
    description: "Alongamento aumentado da cabeça longa.",
    cues: ["Cotovelos para trás"], mistakes: ["Subir o ombro"] }),
  ex({ id: "rosca-cabo", name: "Rosca Cabo", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Polia Baixa", difficulty: "Iniciante", image: "🔌",
    description: "Tensão constante na musculatura.",
    cues: ["Cotovelos fixos"], mistakes: ["Curvar tronco"] }),
  ex({ id: "rosca-uni-polia", name: "Rosca Unilateral Polia", group: "Bíceps", pattern: "isolation-biceps", type: "isolador", equipment: "Polia Baixa", difficulty: "Iniciante", image: "🔌",
    description: "Unilateral para maior foco.",
    cues: ["Postura estável"], mistakes: ["Movimento de ombro"] }),
  ex({ id: "rosca-martelo-corda", name: "Rosca Martelo Corda", group: "Bíceps", secondary: ["Antebraço"], pattern: "isolation-biceps", type: "isolador", equipment: "Polia Baixa + Corda", difficulty: "Iniciante", image: "🪢",
    description: "Trabalha braquial e antebraço.",
    cues: ["Pegada neutra"], mistakes: ["Subir explosivo"] }),
  ex({ id: "rosca-inversa", name: "Rosca Inversa", group: "Bíceps", secondary: ["Antebraço"], pattern: "isolation-biceps", type: "isolador", equipment: "Barra Reta", difficulty: "Iniciante", image: "🔃",
    description: "Pegada pronada, foco em braquiorradial.",
    cues: ["Punhos firmes"], mistakes: ["Flexionar punho"] }),

  // ============ TRÍCEPS (10) ============
  ex({ id: "triceps-pulley", name: "Tríceps Pulley (Barra)", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Polia Alta + Barra", difficulty: "Iniciante", image: "🎯",
    description: "Extensão na polia, foco na cabeça lateral.",
    cues: ["Cotovelos colados"], mistakes: ["Inclinar tronco"] }),
  ex({ id: "triceps-corda", name: "Tríceps Corda", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Polia Alta + Corda", difficulty: "Iniciante", image: "🪢",
    description: "Isolador com abertura ao final.",
    cues: ["Abrir corda na extensão"], mistakes: ["Cotovelos se abrindo"] }),
  ex({ id: "triceps-barra-reta", name: "Tríceps Barra Reta", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Polia Alta + Barra Reta", difficulty: "Iniciante", image: "📏",
    description: "Extensão na polia com barra reta.",
    cues: ["Punho neutro"], mistakes: ["Soltar cotovelo"] }),
  ex({ id: "triceps-frances", name: "Tríceps Francês", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Halter / Barra W", difficulty: "Intermediário", image: "🇫🇷",
    description: "Extensão acima da cabeça, foco na cabeça longa.",
    cues: ["Cotovelos apontam para cima"], mistakes: ["Abrir cotovelos"] }),
  ex({ id: "triceps-testa", name: "Tríceps Testa", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Barra W + Banco", difficulty: "Intermediário", image: "🧠",
    description: "Skull crusher, foco em cabeça longa.",
    cues: ["Cotovelos fixos","Descida controlada"], mistakes: ["Cotovelos abrindo"] }),
  ex({ id: "triceps-banco", name: "Tríceps no Banco", group: "Tríceps", secondary: ["Peito"], pattern: "isolation-triceps", type: "composto", equipment: "Banco", difficulty: "Iniciante", image: "🪜",
    description: "Mergulho assistido em banco.",
    cues: ["Cotovelos para trás"], mistakes: ["Ombros encolhidos"] }),
  ex({ id: "triceps-unilateral", name: "Tríceps Unilateral", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Polia Alta", difficulty: "Iniciante", image: "1️⃣",
    description: "Unilateral para foco maior.",
    cues: ["Postura estável"], mistakes: ["Curvar tronco"] }),
  ex({ id: "triceps-maquina", name: "Tríceps Máquina", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🔩",
    description: "Padrão guiado.",
    cues: ["Costas apoiadas"], mistakes: ["Carga excessiva"] }),
  ex({ id: "mergulho-paralelas", name: "Mergulho nas Paralelas", group: "Tríceps", secondary: ["Peito","Ombros"], pattern: "push-horizontal", type: "composto", equipment: "Paralelas", difficulty: "Avançado", image: "🤸",
    description: "Composto para tríceps com peso corporal.",
    cues: ["Tronco vertical para foco em tríceps"], mistakes: ["Descer demais"] }),
  ex({ id: "coice-triceps", name: "Coice de Tríceps", group: "Tríceps", pattern: "isolation-triceps", type: "isolador", equipment: "Halter", difficulty: "Iniciante", image: "🦵",
    description: "Extensão unilateral com tronco inclinado.",
    cues: ["Braço paralelo ao chão"], mistakes: ["Mover o braço"] }),

  // ============ QUADRÍCEPS (15) ============
  ex({ id: "agachamento-livre", name: "Agachamento Livre", group: "Quadríceps", secondary: ["Glúteos","Posterior"], pattern: "squat", type: "composto", equipment: "Barra + Rack", difficulty: "Avançado", image: "🏋️‍♂️",
    description: "Rei dos exercícios de membros inferiores.",
    cues: ["Pés na linha do ombro","Joelhos seguem os pés","Profundidade até paralela"],
    mistakes: ["Joelhos colapsando","Calcanhar saindo do chão"],
    safety: ["Use sempre a gaiola","Aqueça quadris e tornozelos"] }),
  ex({ id: "agachamento-smith", name: "Agachamento Smith", group: "Quadríceps", secondary: ["Glúteos"], pattern: "squat", type: "composto", equipment: "Smith", difficulty: "Intermediário", image: "🚂",
    description: "Agachamento guiado pela barra Smith.",
    cues: ["Pés ligeiramente à frente"], mistakes: ["Joelhos para dentro"] }),
  ex({ id: "agachamento-frontal", name: "Agachamento Frontal", group: "Quadríceps", secondary: ["Abdômen"], pattern: "squat", type: "composto", equipment: "Barra + Rack", difficulty: "Avançado", image: "⏪",
    description: "Barra à frente, maior demanda em quadríceps e core.",
    cues: ["Cotovelos altos"], mistakes: ["Tronco caindo à frente"] }),
  ex({ id: "leg-press-45", name: "Leg Press 45°", group: "Quadríceps", secondary: ["Glúteos"], pattern: "squat", type: "composto", equipment: "Máquina Leg Press", difficulty: "Iniciante", image: "🦵",
    description: "Empurrar com membros inferiores em ângulo.",
    cues: ["Lombar apoiada"], mistakes: ["Lombar saindo do encosto"] }),
  ex({ id: "leg-press-horizontal", name: "Leg Press Horizontal", group: "Quadríceps", secondary: ["Glúteos"], pattern: "squat", type: "composto", equipment: "Máquina", difficulty: "Iniciante", image: "🦵",
    description: "Alternativa horizontal segura.",
    cues: ["Pés na largura do quadril"], mistakes: ["Joelhos colapsando"] }),
  ex({ id: "hack-machine", name: "Hack Machine", group: "Quadríceps", secondary: ["Glúteos"], pattern: "squat", type: "composto", equipment: "Máquina Hack", difficulty: "Intermediário", image: "⛰️",
    description: "Agachamento guiado.",
    cues: ["Pés alinhados","Descer até 90°"], mistakes: ["Amplitude curta"] }),
  ex({ id: "cadeira-extensora", name: "Cadeira Extensora", group: "Quadríceps", pattern: "isolation-quad", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🪑",
    description: "Isolador para quadríceps.",
    cues: ["Extensão completa"], mistakes: ["Movimento muito rápido"] }),
  ex({ id: "afundo", name: "Afundo", group: "Quadríceps", secondary: ["Glúteos"], pattern: "lunge", type: "composto", equipment: "Halteres", difficulty: "Intermediário", image: "🚶",
    description: "Unilateral para quadríceps e glúteo.",
    cues: ["Tronco ereto"], mistakes: ["Joelho à frente do pé"] }),
  ex({ id: "passada", name: "Passada", group: "Quadríceps", secondary: ["Glúteos"], pattern: "lunge", type: "composto", equipment: "Halteres", difficulty: "Intermediário", image: "🚶",
    description: "Passada caminhando.",
    cues: ["Passos longos"], mistakes: ["Passo curto"] }),
  ex({ id: "bulgarian", name: "Bulgarian Split Squat", group: "Quadríceps", secondary: ["Glúteos"], pattern: "lunge", type: "composto", equipment: "Halteres + Banco", difficulty: "Avançado", image: "🦵",
    description: "Agachamento búlgaro unilateral.",
    cues: ["Pé traseiro apoiado","Joelho da frente alinhado"], mistakes: ["Tronco caindo"] }),
  ex({ id: "sissy-squat", name: "Sissy Squat", group: "Quadríceps", pattern: "isolation-quad", type: "isolador", equipment: "Peso Corporal", difficulty: "Avançado", image: "🧘",
    description: "Isolador intenso para quadríceps.",
    cues: ["Calcanhares no ar"], mistakes: ["Curvar tronco à frente"] }),
  ex({ id: "step-up", name: "Step Up", group: "Quadríceps", secondary: ["Glúteos"], pattern: "lunge", type: "composto", equipment: "Banco + Halteres", difficulty: "Iniciante", image: "🪜",
    description: "Subida em banco unilateral.",
    cues: ["Apoio total do pé"], mistakes: ["Empurrar com pé de trás"] }),
  ex({ id: "agachamento-sumo", name: "Agachamento Sumô", group: "Quadríceps", secondary: ["Glúteos","Posterior"], pattern: "squat", type: "composto", equipment: "Halter / Barra", difficulty: "Intermediário", image: "🤼",
    description: "Base larga, foco em adutores e glúteos.",
    cues: ["Pés bem abertos","Pontas dos pés para fora"], mistakes: ["Joelhos para dentro"] }),
  ex({ id: "agachamento-goblet", name: "Agachamento Goblet", group: "Quadríceps", secondary: ["Glúteos","Abdômen"], pattern: "squat", type: "composto", equipment: "Halter ou Kettlebell", difficulty: "Iniciante", image: "🏆",
    description: "Agachamento com peso à frente.",
    cues: ["Tronco ereto"], mistakes: ["Cotovelos abertos"] }),
  ex({ id: "avanco-andando", name: "Avanço Andando", group: "Quadríceps", secondary: ["Glúteos"], pattern: "lunge", type: "composto", equipment: "Halteres", difficulty: "Intermediário", image: "🚶",
    description: "Lunges em movimento.",
    cues: ["Postura estável"], mistakes: ["Joelho colapsa"] }),

  // ============ POSTERIOR (12) ============
  ex({ id: "stiff-barra", name: "Stiff Barra", group: "Posterior", secondary: ["Glúteos"], pattern: "hinge", type: "composto", equipment: "Barra", difficulty: "Intermediário", image: "🦿",
    description: "Foco em posteriores de coxa e glúteos.",
    cues: ["Joelhos semi-flexionados","Quadril para trás"], mistakes: ["Lombar arredondada"] }),
  ex({ id: "stiff-halteres", name: "Stiff Halteres", group: "Posterior", secondary: ["Glúteos"], pattern: "hinge", type: "composto", equipment: "Halteres", difficulty: "Iniciante", image: "🦿",
    description: "Versão com halteres, mais amigável.",
    cues: ["Coluna neutra"], mistakes: ["Joelhos flexionando demais"] }),
  ex({ id: "terra-romeno", name: "Terra Romeno (RDL)", group: "Posterior", secondary: ["Glúteos"], pattern: "hinge", type: "composto", equipment: "Barra ou Halteres", difficulty: "Avançado", image: "🏛️",
    description: "Composto pesado para posterior e glúteos.",
    cues: ["Barra rente ao corpo"], mistakes: ["Curvar coluna"] }),
  ex({ id: "mesa-flexora", name: "Mesa Flexora", group: "Posterior", pattern: "isolation-hamstring", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🛏️",
    description: "Isolador para isquiotibiais deitado.",
    cues: ["Quadril apoiado"], mistakes: ["Levantar quadril"] }),
  ex({ id: "flexora-sentada", name: "Flexora Sentada", group: "Posterior", pattern: "isolation-hamstring", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "💺",
    description: "Flexão de joelho sentado.",
    cues: ["Costas apoiadas"], mistakes: ["Usar impulso"] }),
  ex({ id: "flexora-em-pe", name: "Flexora em Pé", group: "Posterior", pattern: "isolation-hamstring", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🚶",
    description: "Unilateral em pé.",
    cues: ["Tronco estável"], mistakes: ["Inclinar tronco"] }),
  ex({ id: "good-morning", name: "Good Morning", group: "Posterior", secondary: ["Glúteos"], pattern: "hinge", type: "composto", equipment: "Barra", difficulty: "Avançado", image: "🌅",
    description: "Hinge com barra nas costas.",
    cues: ["Joelhos semi-flexionados","Coluna neutra"], mistakes: ["Curvar coluna"],
    safety: ["Comece com cargas leves"] }),
  ex({ id: "nordic-curl", name: "Nordic Curl", group: "Posterior", pattern: "isolation-hamstring", type: "isolador", equipment: "Peso Corporal + Apoio", difficulty: "Avançado", image: "🧎",
    description: "Excêntrico extremo para posteriores.",
    cues: ["Descida controlada"], mistakes: ["Quadril fletindo"] }),
  ex({ id: "levantamento-terra", name: "Levantamento Terra", group: "Posterior", secondary: ["Costas","Glúteos","Quadríceps"], pattern: "hinge", type: "composto", equipment: "Barra", difficulty: "Avançado", image: "🏗️",
    description: "Composto total de cadeia posterior.",
    cues: ["Barra rente às canelas","Tronco firme"],
    mistakes: ["Lombar arredondada","Joelhos travando antes do tronco"],
    safety: ["Cinto em cargas pesadas","Comece com cargas leves"] }),
  ex({ id: "terra-sumo", name: "Terra Sumô", group: "Posterior", secondary: ["Glúteos"], pattern: "hinge", type: "composto", equipment: "Barra", difficulty: "Avançado", image: "🤼",
    description: "Terra com base larga.",
    cues: ["Pegada por dentro das pernas"], mistakes: ["Pés pouco abertos"] }),
  ex({ id: "glute-ham-raise", name: "Glute Ham Raise", group: "Posterior", secondary: ["Glúteos"], pattern: "isolation-hamstring", type: "isolador", equipment: "Aparelho GHR", difficulty: "Avançado", image: "🛐",
    description: "Excêntrico de posteriores em aparelho próprio.",
    cues: ["Pés fixos"], mistakes: ["Quadril fletindo"] }),
  ex({ id: "flexora-uni", name: "Flexora Unilateral", group: "Posterior", pattern: "isolation-hamstring", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "1️⃣",
    description: "Foco unilateral nos posteriores.",
    cues: ["Movimento controlado"], mistakes: ["Carga excessiva"] }),

  // ============ GLÚTEOS (10) ============
  ex({ id: "hip-thrust", name: "Elevação Pélvica (Hip Thrust)", group: "Glúteos", secondary: ["Posterior"], pattern: "hinge", type: "composto", equipment: "Barra + Banco", difficulty: "Intermediário", image: "🍑",
    description: "Hip thrust para glúteo máximo.",
    cues: ["Queixo retraído","Extensão total"], mistakes: ["Hiperextensão lombar"] }),
  ex({ id: "hip-thrust-maquina", name: "Hip Thrust Máquina", group: "Glúteos", pattern: "hinge", type: "composto", equipment: "Máquina", difficulty: "Iniciante", image: "🍑",
    description: "Versão guiada.",
    cues: ["Pés bem apoiados"], mistakes: ["Pés muito longe"] }),
  ex({ id: "gluteo-maquina", name: "Glúteo Máquina", group: "Glúteos", pattern: "isolation-glute", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🦶",
    description: "Extensão de quadril guiada.",
    cues: ["Tronco apoiado"], mistakes: ["Curvar lombar"] }),
  ex({ id: "coice-polia", name: "Coice na Polia", group: "Glúteos", pattern: "isolation-glute", type: "isolador", equipment: "Polia Baixa", difficulty: "Iniciante", image: "🦶",
    description: "Isolador para glúteo máximo.",
    cues: ["Tronco estável"], mistakes: ["Curvar lombar"] }),
  ex({ id: "abducao-maquina", name: "Abdução Máquina", group: "Glúteos", pattern: "isolation-glute", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "↔️",
    description: "Trabalha glúteo médio.",
    cues: ["Tronco ereto"], mistakes: ["Inclinar tronco"] }),
  ex({ id: "abducao-polia", name: "Abdução Polia", group: "Glúteos", pattern: "isolation-glute", type: "isolador", equipment: "Polia Baixa", difficulty: "Iniciante", image: "↔️",
    description: "Abdução unilateral com cabo.",
    cues: ["Apoio com mão livre"], mistakes: ["Tronco inclinado"] }),
  ex({ id: "ponte-gluteos", name: "Ponte de Glúteos", group: "Glúteos", pattern: "hinge", type: "isolador", equipment: "Peso Corporal", difficulty: "Iniciante", image: "🌉",
    description: "Versão sem peso, ótimo aquecimento.",
    cues: ["Contrair glúteo no topo"], mistakes: ["Pés muito longe"] }),
  ex({ id: "step-up-gluteo", name: "Step Up Glúteo", group: "Glúteos", secondary: ["Quadríceps"], pattern: "lunge", type: "composto", equipment: "Banco Alto + Halteres", difficulty: "Intermediário", image: "🪜",
    description: "Subida em banco alto, foco em glúteo.",
    cues: ["Inclinar tronco levemente"], mistakes: ["Empurrar com pé de trás"] }),
  ex({ id: "agachamento-sumo-profundo", name: "Agachamento Sumô Profundo", group: "Glúteos", secondary: ["Quadríceps"], pattern: "squat", type: "composto", equipment: "Halter ou Barra", difficulty: "Intermediário", image: "🤼",
    description: "Profundidade maior recruta mais glúteo.",
    cues: ["Pés bem abertos"], mistakes: ["Joelhos colapsando"] }),
  ex({ id: "kickback-maquina", name: "Kickback Máquina", group: "Glúteos", pattern: "isolation-glute", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🦵",
    description: "Coice de glúteo guiado por máquina.",
    cues: ["Tronco apoiado"], mistakes: ["Curvar lombar"] }),

  // ============ PANTURRILHAS (8) ============
  ex({ id: "panturrilha-em-pe", name: "Panturrilha em Pé", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Máquina ou Step", difficulty: "Iniciante", image: "🦶",
    description: "Foco em gastrocnêmio.",
    cues: ["Amplitude completa","Pausa no topo"], mistakes: ["Joelhos flexionando"] }),
  ex({ id: "panturrilha-sentado", name: "Panturrilha Sentado", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🪑",
    description: "Foco em sóleo.",
    cues: ["Joelhos a 90°"], mistakes: ["Carga em excesso"] }),
  ex({ id: "panturrilha-leg-press", name: "Panturrilha no Leg Press", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Leg Press", difficulty: "Iniciante", image: "🦵",
    description: "Variação no leg press.",
    cues: ["Antepé na borda"], mistakes: ["Joelhos travados"] }),
  ex({ id: "panturrilha-smith", name: "Panturrilha Smith", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Smith", difficulty: "Iniciante", image: "🚂",
    description: "Versão guiada com Smith.",
    cues: ["Postura estável"], mistakes: ["Sem amplitude"] }),
  ex({ id: "panturrilha-unilateral", name: "Panturrilha Unilateral", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Halter + Step", difficulty: "Iniciante", image: "1️⃣",
    description: "Foco unilateral.",
    cues: ["Apoio leve com mão"], mistakes: ["Saltar a contração"] }),
  ex({ id: "panturrilha-degrau", name: "Panturrilha no Degrau", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Step", difficulty: "Iniciante", image: "🪜",
    description: "Apenas peso corporal.",
    cues: ["Amplitude máxima"], mistakes: ["Movimento curto"] }),
  ex({ id: "donkey-calf", name: "Donkey Calf Raise", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Aparelho ou Peso nas Costas", difficulty: "Intermediário", image: "🐴",
    description: "Variação com tronco inclinado.",
    cues: ["Quadril em 90°"], mistakes: ["Curvar lombar"] }),
  ex({ id: "panturrilha-maquina", name: "Panturrilha Máquina", group: "Panturrilhas", pattern: "isolation-calf", type: "isolador", equipment: "Máquina específica", difficulty: "Iniciante", image: "🔩",
    description: "Padrão guiado.",
    cues: ["Pausa no topo"], mistakes: ["Saltos com impulso"] }),

  // ============ ABDÔMEN (15) ============
  ex({ id: "prancha", name: "Prancha", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Peso Corporal", difficulty: "Iniciante", image: "📏",
    description: "Estabilização isométrica do core.",
    cues: ["Quadril alinhado","Glúteo contraído"], mistakes: ["Quadril caído"] }),
  ex({ id: "prancha-lateral", name: "Prancha Lateral", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Peso Corporal", difficulty: "Iniciante", image: "📐",
    description: "Trabalha oblíquos.",
    cues: ["Cotovelo sob o ombro"], mistakes: ["Quadril caído"] }),
  ex({ id: "crunch", name: "Crunch", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Peso Corporal", difficulty: "Iniciante", image: "🔥",
    description: "Flexão de tronco para reto abdominal.",
    cues: ["Queixo afastado do peito"], mistakes: ["Puxar o pescoço"] }),
  ex({ id: "crunch-maquina", name: "Crunch Máquina", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Máquina", difficulty: "Iniciante", image: "🔩",
    description: "Versão guiada com resistência.",
    cues: ["Movimento controlado"], mistakes: ["Carga excessiva"] }),
  ex({ id: "infra-banco", name: "Infra no Banco", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Banco", difficulty: "Iniciante", image: "🛏️",
    description: "Elevação de pernas com apoio.",
    cues: ["Lombar colada"], mistakes: ["Quadril descolando"] }),
  ex({ id: "infra-suspenso", name: "Infra Suspenso", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Barra Fixa", difficulty: "Avançado", image: "🆙",
    description: "Pendurar e elevar pernas.",
    cues: ["Controle total"], mistakes: ["Balançar"] }),
  ex({ id: "elevacao-pernas", name: "Elevação de Pernas", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Banco ou Solo", difficulty: "Iniciante", image: "🦵",
    description: "Trabalha porção inferior.",
    cues: ["Lombar pressionada"], mistakes: ["Quadril levantando"] }),
  ex({ id: "ab-wheel", name: "Ab Wheel", group: "Abdômen", pattern: "core", type: "composto", equipment: "Roda Abdominal", difficulty: "Avançado", image: "🛞",
    description: "Extensão total do core.",
    cues: ["Glúteo contraído","Coluna neutra"], mistakes: ["Arquear lombar"] }),
  ex({ id: "russian-twist", name: "Russian Twist", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Halter ou Anilha", difficulty: "Iniciante", image: "🔄",
    description: "Rotação para oblíquos.",
    cues: ["Tronco a 45°"], mistakes: ["Movimento só com braços"] }),
  ex({ id: "mountain-climber", name: "Mountain Climber", group: "Abdômen", secondary: ["Cardio"], pattern: "core", type: "composto", equipment: "Peso Corporal", difficulty: "Iniciante", image: "⛰️",
    description: "Cardio + core dinâmico.",
    cues: ["Quadril estável"], mistakes: ["Quadril subindo"] }),
  ex({ id: "bicicleta-abdominal", name: "Bicicleta Abdominal", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Peso Corporal", difficulty: "Iniciante", image: "🚴",
    description: "Rotação alternada para oblíquos.",
    cues: ["Cotovelo encontra joelho oposto"], mistakes: ["Puxar pescoço"] }),
  ex({ id: "v-up", name: "V-Up", group: "Abdômen", pattern: "core", type: "composto", equipment: "Peso Corporal", difficulty: "Intermediário", image: "📐",
    description: "Tronco e pernas se aproximam em V.",
    cues: ["Movimento simultâneo"], mistakes: ["Usar impulso"] }),
  ex({ id: "sit-up", name: "Sit-Up", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Peso Corporal", difficulty: "Iniciante", image: "🆙",
    description: "Flexão de tronco completa.",
    cues: ["Pés ancorados"], mistakes: ["Puxar pescoço"] }),
  ex({ id: "woodchopper", name: "Woodchopper", group: "Abdômen", pattern: "core", type: "composto", equipment: "Polia ou Halter", difficulty: "Intermediário", image: "🪓",
    description: "Rotação diagonal explosiva.",
    cues: ["Quadril rotaciona"], mistakes: ["Curvar coluna"] }),
  ex({ id: "hollow-hold", name: "Hollow Hold", group: "Abdômen", pattern: "core", type: "isolador", equipment: "Peso Corporal", difficulty: "Intermediário", image: "🛟",
    description: "Isometria avançada do core.",
    cues: ["Lombar colada no solo"], mistakes: ["Lombar arqueada"] }),

  // ============ ANTEBRAÇO (6) ============
  ex({ id: "rosca-punho", name: "Rosca de Punho", group: "Antebraço", pattern: "isolation-biceps", type: "isolador", equipment: "Barra", difficulty: "Iniciante", image: "✊",
    description: "Trabalha flexores do punho.",
    cues: ["Antebraço apoiado"], mistakes: ["Amplitude curta"] }),
  ex({ id: "rosca-punho-inversa", name: "Rosca Punho Inversa", group: "Antebraço", pattern: "isolation-biceps", type: "isolador", equipment: "Barra", difficulty: "Iniciante", image: "✊",
    description: "Trabalha extensores do punho.",
    cues: ["Carga leve"], mistakes: ["Movimento balístico"] }),
  ex({ id: "farmer-walk", name: "Farmer Walk", group: "Antebraço", secondary: ["Abdômen"], pattern: "carry", type: "composto", equipment: "Halteres Pesados", difficulty: "Intermediário", image: "🚶",
    description: "Caminhada com carga, foco em pegada.",
    cues: ["Postura ereta"], mistakes: ["Encolher os ombros"] }),
  ex({ id: "dead-hang", name: "Dead Hang", group: "Antebraço", pattern: "carry", type: "isolador", equipment: "Barra Fixa", difficulty: "Iniciante", image: "🆙",
    description: "Pendurar para desenvolver pegada.",
    cues: ["Ombros ativos"], mistakes: ["Ombros relaxados"] }),
  ex({ id: "wrist-roller", name: "Wrist Roller", group: "Antebraço", pattern: "isolation-biceps", type: "isolador", equipment: "Wrist Roller", difficulty: "Intermediário", image: "🌀",
    description: "Enrolar peso com punhos.",
    cues: ["Braços paralelos ao chão"], mistakes: ["Ombros se movendo"] }),
  ex({ id: "pegada-pinca", name: "Pegada Pinça", group: "Antebraço", pattern: "isolation-biceps", type: "isolador", equipment: "Anilhas", difficulty: "Intermediário", image: "🦾",
    description: "Segurar anilhas pelas bordas.",
    cues: ["Polegar firme"], mistakes: ["Deixar cair"] }),

  // ============ CARDIO (15) ============
  ex({ id: "cardio-caminhada", name: "Caminhada", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Esteira / Rua", difficulty: "Iniciante", image: "🚶",
    description: "Cardio de baixa intensidade.",
    cues: ["Postura ereta"], mistakes: ["Inclinar muito para frente"] }),
  ex({ id: "cardio-corrida-leve", name: "Corrida Leve", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Esteira / Rua", difficulty: "Iniciante", image: "🏃",
    description: "Zona 2, fácil sustentar conversa.",
    cues: ["Cadência confortável"], mistakes: ["Acelerar demais"] }),
  ex({ id: "cardio-corrida-moderada", name: "Corrida Moderada", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Esteira / Rua", difficulty: "Intermediário", image: "🏃",
    description: "Ritmo sustentado, conversa em frases curtas.",
    cues: ["Respiração controlada"], mistakes: ["Passada longa demais"] }),
  ex({ id: "cardio-corrida-intensa", name: "Corrida Intensa", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Esteira / Rua", difficulty: "Avançado", image: "🏃‍♀️",
    description: "Ritmo de prova.",
    cues: ["Aquecer bem antes"], mistakes: ["Negligenciar volta à calma"] }),
  ex({ id: "cardio-bike-erg", name: "Bicicleta Ergométrica", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Bike Ergométrica", difficulty: "Iniciante", image: "🚴",
    description: "Cardio sem impacto.",
    cues: ["Selim na altura do quadril"], mistakes: ["Selim baixo"] }),
  ex({ id: "cardio-spinning", name: "Bicicleta Spinning", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Bike Spinning", difficulty: "Intermediário", image: "🚴‍♀️",
    description: "Intervalos de alta intensidade.",
    cues: ["Núcleo firme"], mistakes: ["Curvar muito o tronco"] }),
  ex({ id: "cardio-eliptico", name: "Elíptico", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Elíptico", difficulty: "Iniciante", image: "♾️",
    description: "Cardio sem impacto, corpo todo.",
    cues: ["Postura ereta"], mistakes: ["Apoiar todo peso nos braços"] }),
  ex({ id: "cardio-escada", name: "Escada", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Escada Ergométrica", difficulty: "Intermediário", image: "🪜",
    description: "Cardio com forte demanda em pernas.",
    cues: ["Pé inteiro no degrau"], mistakes: ["Apoiar muito o peso nos corrimãos"] }),
  ex({ id: "cardio-remo", name: "Remo Ergométrico", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Remo Ergométrico", difficulty: "Intermediário", image: "🚣",
    description: "Cardio de corpo inteiro.",
    cues: ["Sequência pernas-tronco-braços"], mistakes: ["Puxar só com braços"] }),
  ex({ id: "cardio-corda", name: "Pular Corda", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Corda", difficulty: "Iniciante", image: "🪢",
    description: "Cardio explosivo e coordenação.",
    cues: ["Saltos baixos"], mistakes: ["Saltos altos cansam rápido"] }),
  ex({ id: "cardio-air-bike", name: "Air Bike", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Air Bike", difficulty: "Avançado", image: "🌪️",
    description: "Cardio de corpo inteiro intenso.",
    cues: ["Empurrar e puxar"], mistakes: ["Esquecer braços"] }),
  ex({ id: "cardio-hiit-esteira", name: "HIIT Esteira", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Esteira", difficulty: "Avançado", image: "⚡",
    description: "Tiros curtos e descansos.",
    cues: ["Aqueça 5min antes"], mistakes: ["Pular aquecimento"] }),
  ex({ id: "cardio-hiit-bike", name: "HIIT Bicicleta", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Bike", difficulty: "Avançado", image: "⚡",
    description: "Tiros e recuperação na bike.",
    cues: ["Resistência adequada"], mistakes: ["Selim mal regulado"] }),
  ex({ id: "cardio-caminhada-inclinada", name: "Caminhada Inclinada", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Esteira", difficulty: "Iniciante", image: "⛰️",
    description: "Inclinação 8-15% para queimar mais.",
    cues: ["Sem se apoiar nos braços"], mistakes: ["Segurar nas alças"] }),
  ex({ id: "cardio-sprint", name: "Sprint Intervalado", group: "Cardio", pattern: "cardio", type: "composto", equipment: "Rua / Esteira", difficulty: "Avançado", image: "💨",
    description: "Tiros máximos de 15-30s.",
    cues: ["Aqueça muito bem"], mistakes: ["Pular volta à calma"] }),
];

export type StrengthSlot = { exerciseId: string; sets: number; reps: string; rest: string };
export type CardioSlot = {
  type: "Corrida Contínua" | "Corrida Intervalada" | "Corrida Longa" | "Caminhada Inclinada" | "Tempo Run";
  duration: number; // min
  distance?: number; // km
  pace?: string; // min:ss / km
  details: string;
};
export type SportSlot = { sport: string; duration: number; details: string };

export type DayPlan = {
  date: string; // YYYY-MM-DD
  weekday: string;
  title: string;
  focus: string;
  estimatedMin: number;
  strength: StrengthSlot[];
  cardio?: CardioSlot;
  sport?: SportSlot;
  rest?: boolean;
  status: "pendente" | "concluido" | "hoje";
};

export const WEEKDAY_KEYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const;
export type WeekdayKey = typeof WEEKDAY_KEYS[number];
export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  seg: "Segunda", ter: "Terça", qua: "Quarta", qui: "Quinta",
  sex: "Sexta", sab: "Sábado", dom: "Domingo",
};
export const WEEKDAY_SHORT: Record<WeekdayKey, string> = {
  seg: "SEG", ter: "TER", qua: "QUA", qui: "QUI", sex: "SEX", sab: "SÁB", dom: "DOM",
};

export type SportIntensity = "Leve" | "Moderada" | "Alta" | "Competitiva";
export type SportPractice = {
  name: string;
  days: WeekdayKey[];
  intensity: SportIntensity;
};

export const RESTRICTION_OPTIONS = ["Nenhuma", "Joelho", "Ombro", "Lombar", "Quadril", "Tornozelo", "Outro"] as const;
export type Restriction = typeof RESTRICTION_OPTIONS[number];

export const SPORT_OPTIONS = ["Futebol", "Corrida", "Ciclismo", "Basquete", "Vôlei", "Tênis", "Crossfit", "Artes Marciais", "Natação", "Outro"] as const;

export type Profile = {
  name: string;
  sex: "M" | "F" | "Outro";
  age: number;
  height: number; // cm
  weight: number; // kg
  bodyFat?: number;
  goal: "Emagrecimento" | "Hipertrofia" | "Ganho de Força" | "Condicionamento" | "Saúde Geral" | "Performance Esportiva" | "Performance Híbrida" | "Corrida 5km" | "Corrida 10km" | "Meia Maratona" | "Futebol";
  strengthLevel: "Iniciante" | "Intermediário" | "Avançado";
  runLevel: "Iniciante" | "Intermediário" | "Avançado";
  daysPerWeek: number; // derivado de gymDays
  timePerDay: number; // min
  location: "Academia" | "Casa";
  equipment: string[];
  /** Novos campos */
  gymDays?: WeekdayKey[];
  sports?: SportPractice[];
  restrictionsList?: Restriction[];
  /** Legados (compatibilidade) */
  sport?: string;
  restrictions?: string;
};

export type Intensity = "Leve" | "Moderada" | "Forte" | "Muito Forte";
export type ExtraActivity = {
  id: string;
  date: string;
  type: string;
  durationMin: number;
  intensity: Intensity;
  notes?: string;
};

export type CheckInMood = "Excelente" | "Bem" | "Cansado" | "Exausto";
export type CheckIn = { date: string; mood: CheckInMood; note?: string };

export type ImportedExercise = { name: string; sets: number; reps: string; notes?: string };
export type ImportedDay = { name: string; exercises: ImportedExercise[] };
export type ImportedWorkout = {
  id: string;
  createdAt: string;
  source: "pdf" | "image" | "excel" | "text" | "manual";
  name: string;
  frequency: string;
  split: string;
  days: ImportedDay[];
  weeklyVolume: { totalSets: number; byMuscle: { muscle: string; sets: number }[] };
  hasStrength: boolean;
  hasCardio: boolean;
  mode: "manter" | "complementar" | "otimizar" | null;
  suggestions: { type: string; title: string; detail: string }[];
  summary?: string;
};

export type AIInsight = {
  id: string;
  date: string;
  icon: "progress" | "warning" | "sport" | "recovery" | "tip";
  title: string;
  detail: string;
};

export type AIReport = {
  id: string;
  date: string;
  weeklyGrade: string;
  recommendation: string;
  insights: AIInsight[];
};

export type EventGoal = {
  id: string;
  title: string;
  type: "jogo" | "campeonato" | "prova" | "outro";
  date: string;
  notes?: string;
  createdAt: string;
};

export type AppState = {
  onboarded: boolean;
  profile?: Profile;
  plan: DayPlan[];
  logs: Record<string, Record<string, { weight: number; reps: number }[]>>;
  runLogs: Record<string, { distance: number; timeMin: number; pace: string }>;
  bodyMetrics: { date: string; weight: number; bodyFat?: number }[];
  extraActivities: ExtraActivity[];
  checkIns: CheckIn[];
  streak: number;
  completedDates: string[];
  achievements: string[];
  importedWorkouts: ImportedWorkout[];
  aiReports: AIReport[];
  eventGoals: EventGoal[];
};

const defaultState: AppState = {
  onboarded: false,
  plan: [],
  logs: {},
  runLogs: {},
  bodyMetrics: [],
  extraActivities: [],
  checkIns: [],
  streak: 0,
  completedDates: [],
  achievements: [],
  importedWorkouts: [],
  aiReports: [],
  eventGoals: [],
};

export const EXTRA_ACTIVITY_TYPES: { name: string; icon: string; category: "esporte" | "cardio" | "outro" }[] = [
  { name: "Futebol", icon: "⚽", category: "esporte" },
  { name: "Futsal", icon: "🥅", category: "esporte" },
  { name: "Basquete", icon: "🏀", category: "esporte" },
  { name: "Vôlei", icon: "🏐", category: "esporte" },
  { name: "Tênis", icon: "🎾", category: "esporte" },
  { name: "Luta / MMA", icon: "🥊", category: "esporte" },
  { name: "Corrida", icon: "🏃", category: "cardio" },
  { name: "Caminhada", icon: "🚶", category: "cardio" },
  { name: "Ciclismo", icon: "🚴", category: "cardio" },
  { name: "Natação", icon: "🏊", category: "cardio" },
  { name: "Trilha", icon: "🥾", category: "cardio" },
  { name: "Surfe", icon: "🏄", category: "esporte" },
  { name: "Skate", icon: "🛹", category: "esporte" },
  { name: "Trabalho físico", icon: "🔨", category: "outro" },
  { name: "Outro", icon: "✨", category: "outro" },
];

export const INTENSITIES: { value: Intensity; load: number; color: string }[] = [
  { value: "Leve", load: 1, color: "text-emerald-400" },
  { value: "Moderada", load: 2, color: "text-yellow-400" },
  { value: "Forte", load: 3, color: "text-orange-400" },
  { value: "Muito Forte", load: 4, color: "text-red-400" },
];

const intensityLoad = (i: Intensity) => INTENSITIES.find((x) => x.value === i)?.load ?? 2;

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem("hybrid_trainer_state_v1");
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch { return defaultState; }
}

export function saveState(s: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem("hybrid_trainer_state_v1", JSON.stringify(s));
}

export function resetState() {
  if (typeof window !== "undefined") localStorage.removeItem("hybrid_trainer_state_v1");
}

// ---------- "AI" plan generator (deterministic, profile-aware) ----------

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function generatePlan(profile: Profile, startDate = new Date()): DayPlan[] {
  const days: DayPlan[] = [];

  // Monday-first week starting from current week
  const monday = new Date(startDate);
  const dayOfWeek = monday.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(monday.getDate() + diff);

  // Resolve which days are gym vs sport
  const gymDays: WeekdayKey[] = profile.gymDays?.length
    ? profile.gymDays
    : fallbackGymDays(profile.daysPerWeek || 3);
  const sports: SportPractice[] = profile.sports ?? [];

  // Map weekday -> sports happening that day
  const sportsByDay = new Map<WeekdayKey, SportPractice[]>();
  WEEKDAY_KEYS.forEach((k) => sportsByDay.set(k, []));
  sports.forEach((sp) => sp.days.forEach((d) => sportsByDay.get(d)!.push(sp)));

  // Pre-compute "no leg day" flags: adjacent day has heavy lower-body sport
  const noLegOn: Set<WeekdayKey> = new Set();
  WEEKDAY_KEYS.forEach((k, i) => {
    const prev = WEEKDAY_KEYS[(i + 6) % 7];
    const next = WEEKDAY_KEYS[(i + 1) % 7];
    const drains = (key: WeekdayKey) =>
      (sportsByDay.get(key) ?? []).some((s) => sportDrainsLegs(s.name) && intensityWeight(s.intensity) >= 2);
    if (drains(prev) || drains(next) || drains(k)) noLegOn.add(k);
  });

  // Order gym days chronologically Mon→Sun; rotate splits avoiding leg overlap
  const orderedGym = WEEKDAY_KEYS.filter((k) => gymDays.includes(k));
  const splitByDay = new Map<WeekdayKey, string>();
  assignSplits(orderedGym, noLegOn, profile, splitByDay);

  for (let i = 0; i < 7; i++) {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    const date = fmtDate(dt);
    const weekday = WEEKDAYS[dt.getDay()];
    const key = WEEKDAY_KEYS[i]; // monday-first matches our index
    const isGym = gymDays.includes(key);
    const sportsToday = sportsByDay.get(key) ?? [];

    if (!isGym && sportsToday.length === 0) {
      days.push({ date, weekday, title: "Descanso Ativo", focus: "Recuperação", estimatedMin: 0, strength: [], rest: true, status: statusFor(date) });
      continue;
    }

    let strength: StrengthSlot[] = [];
    let title = "";
    let focus = "";
    let estimatedMin = 0;

    if (isGym) {
      const split = splitByDay.get(key) ?? "Full Body";
      strength = pickStrength(split, profile);
      title = split;
      focus = split.split(" ")[0];
      estimatedMin += Math.min(profile.timePerDay, strength.length * 12);
    }

    let sport: SportSlot | undefined;
    if (sportsToday.length) {
      const sp = sportsToday[0];
      sport = {
        sport: sp.name,
        duration: sportDuration(sp),
        details: `Intensidade ${sp.intensity.toLowerCase()} — ${sportTip(sp.name)}`,
      };
      estimatedMin += sport.duration;
      title = isGym ? `${title} + ${sp.name}` : sp.name;
      focus = isGym ? `${focus} + ${sp.name}` : sp.name;
    }

    days.push({
      date, weekday,
      title, focus,
      estimatedMin: Math.min(180, estimatedMin),
      strength,
      sport,
      status: statusFor(date),
    });
  }
  return days;
}

function fallbackGymDays(n: number): WeekdayKey[] {
  const map: Record<number, WeekdayKey[]> = {
    1: ["qua"], 2: ["seg","qui"], 3: ["seg","qua","sex"],
    4: ["seg","ter","qui","sex"], 5: ["seg","ter","qua","qui","sex"],
    6: ["seg","ter","qua","qui","sex","sab"], 7: [...WEEKDAY_KEYS],
  };
  return map[Math.max(1, Math.min(7, n))] ?? ["seg","qua","sex"];
}

function intensityWeight(i: SportIntensity): number {
  return i === "Leve" ? 1 : i === "Moderada" ? 2 : i === "Alta" ? 3 : 4;
}

function sportDrainsLegs(name: string): boolean {
  const lower = name.toLowerCase();
  return ["futebol","corrida","ciclismo","basquete","vôlei","volei","tênis","tenis","artes marciais","crossfit"].some((s) => lower.includes(s));
}

function sportDuration(s: SportPractice): number {
  const base = s.name.toLowerCase().includes("futebol") ? 90
    : s.name.toLowerCase().includes("corrida") ? 45
    : s.name.toLowerCase().includes("ciclismo") ? 75 : 60;
  const mult = s.intensity === "Competitiva" ? 1.1 : s.intensity === "Leve" ? 0.8 : 1;
  return Math.round(base * mult);
}

function sportTip(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("futebol")) return "aquecimento ativo e mobilidade de quadril antes.";
  if (n.includes("corrida")) return "respeite zonas de FC e hidrate.";
  if (n.includes("ciclismo")) return "cadência leve nos primeiros 10min.";
  if (n.includes("natação")) return "mobilidade de ombro antes.";
  return "aquecimento articular completo.";
}

function assignSplits(
  gym: WeekdayKey[],
  noLegOn: Set<WeekdayKey>,
  profile: Profile,
  out: Map<WeekdayKey, string>,
) {
  const restricts = profile.restrictionsList ?? [];
  const skipLegsHard = restricts.includes("Joelho") || restricts.includes("Quadril");
  const n = gym.length;

  // Define rotações por número de dias (priorizando equilíbrio agonista/antagonista)
  let rotation: string[];
  if (n <= 2) {
    rotation = ["Full Body A", "Full Body B"];
  } else if (n === 3) {
    rotation = skipLegsHard
      ? ["Push", "Pull", "Upper"]
      : ["Push", "Pull", "Pernas"];
  } else if (n === 4) {
    rotation = skipLegsHard
      ? ["Upper", "Lower", "Upper", "Core + Posterior"]
      : ["Upper", "Lower", "Upper", "Lower"];
  } else if (n === 5) {
    rotation = skipLegsHard
      ? ["Push", "Pull", "Ombros + Braços", "Upper", "Core + Posterior"]
      : ["Push", "Pull", "Pernas (Quadríceps)", "Ombros + Braços", "Pernas (Posterior + Glúteo)"];
  } else {
    // 6-7 dias: PPL x2
    rotation = skipLegsHard
      ? ["Push", "Pull", "Upper", "Push", "Pull", "Core + Posterior"]
      : ["Push", "Pull", "Pernas (Quadríceps)", "Push", "Pull", "Pernas (Posterior + Glúteo)"];
  }

  let idx = 0;
  gym.forEach((day) => {
    let split = rotation[idx % rotation.length];
    // Se hoje não pode treinar perna mas a rotação manda perna, troca por Upper
    if (noLegOn.has(day) && /pernas|posterior/i.test(split)) {
      split = "Upper";
    }
    out.set(day, split);
    idx++;
  });
}

function statusFor(date: string): DayPlan["status"] {
  const t = fmtDate(new Date());
  if (date === t) return "hoje";
  return "pendente";
}

// -------- Estrutura completa de treino --------
// Volume por grupo (principal/secundário) baseado em nível e objetivo.
type Goal = Profile["goal"];
type Level = Profile["strengthLevel"];

function setsRepsRest(goal: Goal): { sets: number; reps: string; rest: string; isoSets: number; isoReps: string; isoRest: string } {
  switch (goal) {
    case "Ganho de Força":
      return { sets: 5, reps: "4-6", rest: "150s", isoSets: 3, isoReps: "8-10", isoRest: "75s" };
    case "Hipertrofia":
      return { sets: 4, reps: "8-12", rest: "75s", isoSets: 3, isoReps: "10-15", isoRest: "60s" };
    case "Emagrecimento":
    case "Condicionamento":
      return { sets: 3, reps: "12-15", rest: "45s", isoSets: 3, isoReps: "15-20", isoRest: "40s" };
    case "Saúde Geral":
      return { sets: 3, reps: "10-12", rest: "60s", isoSets: 2, isoReps: "12-15", isoRest: "45s" };
    case "Futebol":
    case "Performance Esportiva":
    case "Performance Híbrida":
      return { sets: 4, reps: "6-10", rest: "90s", isoSets: 3, isoReps: "10-12", isoRest: "60s" };
    default:
      return { sets: 3, reps: "8-12", rest: "75s", isoSets: 3, isoReps: "12-15", isoRest: "60s" };
  }
}

// Tabela ordenada: composto primeiro, isoladores depois. IDs sincronizados com o catálogo EXERCISES.
const POOL: Record<MuscleGroup, { compound: string[]; iso: string[] }> = {
  Peito:        { compound: ["supino-reto-barra","supino-reto-halteres","supino-incl-halteres","supino-incl-barra","supino-decl-barra","supino-maquina","chest-press","flexao","flexao-inclinada"],
                  iso: ["crucifixo-reto","crucifixo-incl","peck-deck","crossover-alto","crossover-medio","crossover-baixo"] },
  Costas:       { compound: ["barra-fixa-neutra","barra-fixa-pronada","remada-curvada","remada-cavalinho","t-bar-row","remada-unilateral","puxada-frontal","puxada-neutra","puxada-supinada","puxada-fechada","remada-baixa","remada-sentado-cabo","remada-articulada","remada-smith","remada-invertida"],
                  iso: ["pulldown-estendido","pull-over"] },
  Ombros:       { compound: ["desenvolvimento-halteres","desenvolvimento-barra","arnold-press","desenvolvimento-maquina","desenvolvimento-smith","desenvolvimento-militar","remada-alta"],
                  iso: ["elevacao-lateral","elevacao-lateral-uni","elevacao-frontal","crucifixo-inverso","deltoide-post-maquina","face-pull"] },
  Bíceps:       { compound: [],
                  iso: ["rosca-direta","rosca-barra-w","rosca-alternada","rosca-martelo","rosca-scott","rosca-scott-maquina","rosca-inclinada","rosca-cabo","rosca-concentrada","rosca-uni-polia","rosca-martelo-corda","rosca-inversa"] },
  Tríceps:      { compound: ["mergulho-paralelas","triceps-banco"],
                  iso: ["triceps-pulley","triceps-corda","triceps-barra-reta","triceps-frances","triceps-testa","triceps-maquina","triceps-unilateral","coice-triceps"] },
  Quadríceps:   { compound: ["agachamento-livre","agachamento-smith","agachamento-frontal","hack-machine","leg-press-45","leg-press-horizontal","agachamento-goblet","agachamento-sumo","bulgarian","afundo","passada","avanco-andando","step-up"],
                  iso: ["cadeira-extensora","sissy-squat"] },
  Posterior:    { compound: ["terra-romeno","stiff-barra","stiff-halteres","good-morning","levantamento-terra","terra-sumo"],
                  iso: ["mesa-flexora","flexora-sentada","flexora-em-pe","flexora-uni","nordic-curl","glute-ham-raise"] },
  Glúteos:      { compound: ["hip-thrust","hip-thrust-maquina","agachamento-sumo-profundo","step-up-gluteo"],
                  iso: ["gluteo-maquina","coice-polia","abducao-maquina","abducao-polia","kickback-maquina","ponte-gluteos"] },
  Panturrilhas: { compound: [],
                  iso: ["panturrilha-em-pe","panturrilha-sentado","panturrilha-leg-press","panturrilha-smith","panturrilha-unilateral","panturrilha-degrau","donkey-calf","panturrilha-maquina"] },
  Abdômen:      { compound: ["ab-wheel","mountain-climber","v-up","woodchopper"],
                  iso: ["prancha","prancha-lateral","crunch","crunch-maquina","sit-up","infra-banco","infra-suspenso","elevacao-pernas","russian-twist","bicicleta-abdominal","hollow-hold"] },
  Antebraço:    { compound: ["farmer-walk"],
                  iso: ["rosca-punho","rosca-punho-inversa","dead-hang","wrist-roller","pegada-pinca"] },
  Cardio:       { compound: ["cardio-corrida-moderada","cardio-corrida-leve","cardio-bike-erg","cardio-remo","cardio-eliptico","cardio-caminhada-inclinada"],
                  iso: ["cardio-caminhada","cardio-spinning","cardio-escada","cardio-corda","cardio-air-bike","cardio-hiit-esteira","cardio-hiit-bike","cardio-sprint","cardio-corrida-intensa"] },
};

// Mapeia split → grupos principais / secundários
function splitTargets(split: string): { primary: MuscleGroup[]; secondary: MuscleGroup[] } {
  const s = split.toLowerCase();
  if (s.startsWith("push") || s.includes("peito + tríceps")) {
    return { primary: ["Peito"], secondary: ["Ombros", "Tríceps"] };
  }
  if (s.startsWith("pull") || s.includes("costas + bíceps")) {
    return { primary: ["Costas"], secondary: ["Bíceps"] };
  }
  if (s.includes("posterior") && s.includes("glúteo")) {
    return { primary: ["Posterior", "Glúteos"], secondary: ["Panturrilhas", "Abdômen"] };
  }
  if (s.includes("quadríceps") || s === "pernas" || s.startsWith("pernas")) {
    return { primary: ["Quadríceps", "Posterior"], secondary: ["Glúteos", "Panturrilhas", "Abdômen"] };
  }
  if (s.includes("ombros + braços")) {
    return { primary: ["Ombros"], secondary: ["Bíceps", "Tríceps"] };
  }
  if (s.includes("ombros")) {
    return { primary: ["Ombros"], secondary: ["Abdômen"] };
  }
  if (s.includes("core + posterior")) {
    return { primary: ["Posterior", "Abdômen"], secondary: ["Glúteos"] };
  }
  if (s === "lower" || s.startsWith("lower")) {
    return { primary: ["Quadríceps", "Posterior"], secondary: ["Glúteos", "Panturrilhas", "Abdômen"] };
  }
  if (s.includes("upper")) {
    return { primary: ["Peito", "Costas"], secondary: ["Ombros", "Bíceps", "Tríceps"] };
  }
  // Full body
  return { primary: ["Quadríceps", "Peito", "Costas"], secondary: ["Ombros", "Posterior", "Abdômen"] };
}

function pickStrength(split: string, profile: Profile): StrengthSlot[] {
  const { primary, secondary } = splitTargets(split);
  const cfg = setsRepsRest(profile.goal);
  const level: Level = profile.strengthLevel ?? "Intermediário";
  const time = profile.timePerDay ?? 60;

  // Volume alvo: principais 3-5 exercícios, secundários 2-4
  // Ajustes por nível
  const primaryCount = level === "Iniciante" ? 3 : level === "Avançado" ? 5 : 4;
  const secondaryCount = level === "Iniciante" ? 2 : level === "Avançado" ? 3 : 3;

  const result: StrengthSlot[] = [];
  const used = new Set<string>();

  const addFromGroup = (group: MuscleGroup, n: number, isPrimary: boolean) => {
    const pool = POOL[group];
    const ordered = [...pool.compound, ...pool.iso]; // composto antes
    let added = 0;
    for (const id of ordered) {
      if (added >= n) break;
      if (used.has(id)) continue;
      const ex = EXERCISES.find((e) => e.id === id);
      if (!ex) continue;
      // respeita nível: iniciante evita "Avançado"
      if (level === "Iniciante" && ex.difficulty === "Avançado") continue;
      const isCompound = pool.compound.includes(id);
      used.add(id);
      result.push({
        exerciseId: id,
        sets: isCompound ? cfg.sets : cfg.isoSets,
        reps: isCompound ? cfg.reps : cfg.isoReps,
        rest: isCompound ? cfg.rest : cfg.isoRest,
      });
      added++;
    }
    return added;
  };

  // Distribui entre grupos primários
  primary.forEach((g) => {
    const each = Math.max(2, Math.ceil(primaryCount / primary.length));
    addFromGroup(g, each, true);
  });
  // Secundários
  secondary.forEach((g) => {
    const each = Math.max(1, Math.ceil(secondaryCount / secondary.length));
    addFromGroup(g, each, false);
  });

  // Garante mínimo de 6 exercícios (se não for "Saúde Geral" + Iniciante)
  const min = profile.goal === "Saúde Geral" && level === "Iniciante" ? 5 : 6;
  // Preenche com isoladores adicionais se faltarem
  if (result.length < min) {
    [...primary, ...secondary].forEach((g) => {
      if (result.length >= min) return;
      addFromGroup(g, 1, false);
    });
  }

  // Limite por tempo: ~8min/exercício composto, ~6min/isolador, +5min aquecimento
  const minutesPerEx = 8;
  const maxByTime = Math.max(min, Math.floor((time - 5) / minutesPerEx));
  // Mas nunca cortar abaixo do mínimo
  const finalMax = Math.max(min, Math.min(result.length, maxByTime));

  return result.slice(0, finalMax);
}





export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

/** Retorna alternativas com o mesmo padrão de movimento. */
export function findAlternatives(id: string, opts?: { level?: Level; equipment?: string[] }): Exercise[] {
  const base = getExercise(id);
  if (!base) return [];
  return EXERCISES.filter((e) => {
    if (e.id === id) return false;
    if (base.pattern && e.pattern !== base.pattern) return false;
    if (!base.pattern && e.group !== base.group) return false;
    if (opts?.level === "Iniciante" && e.difficulty === "Avançado") return false;
    return true;
  }).slice(0, 6);
}

/** Última sessão registrada para um exercício, ignorando hoje. */
export function getLastLog(
  logs: Record<string, Record<string, { weight: number; reps: number }[]>>,
  exerciseId: string,
): { date: string; sets: { weight: number; reps: number }[] } | null {
  const todayStr = today();
  const dates = Object.keys(logs).sort().reverse();
  for (const d of dates) {
    if (d === todayStr) continue;
    if (logs[d]?.[exerciseId]?.length) return { date: d, sets: logs[d][exerciseId] };
  }
  return null;
}

/**
 * Sugere a próxima carga com base na faixa-alvo de repetições.
 * Se atingiu/excedeu o topo em todas as séries → progride (+2.5kg padrão,
 * +5kg em compostos de barra pesados). Se ficou abaixo do mínimo → mantém.
 */
export function suggestNextLoad(
  exerciseId: string,
  lastSets: { weight: number; reps: number }[] | undefined,
  targetReps: string,
): { suggested: number; delta: number; reason: string } | null {
  if (!lastSets?.length) return null;
  const valid = lastSets.filter((s) => s && s.weight > 0);
  if (!valid.length) return null;
  const baseWeight = Math.max(...valid.map((s) => s.weight));
  const m = targetReps.match(/(\d+)\s*[-–]\s*(\d+)/);
  const minR = m ? parseInt(m[1], 10) : parseInt(targetReps, 10) || 8;
  const maxR = m ? parseInt(m[2], 10) : minR + 2;
  const allHit = valid.length >= Math.max(2, lastSets.length - 1) && valid.every((s) => s.reps >= maxR);
  const allBelow = valid.every((s) => s.reps < minR);
  const ex = getExercise(exerciseId);
  const isHeavyBarbell = ex?.type === "composto" && /barra|terra|agachamento/i.test(ex.name);
  const step = isHeavyBarbell ? 5 : 2.5;
  if (allHit) {
    return { suggested: baseWeight + step, delta: step, reason: `Você bateu o topo da faixa (${maxR}). Suba ${step}kg.` };
  }
  if (allBelow) {
    return { suggested: Math.max(0, baseWeight - step), delta: -step, reason: `Reps abaixo de ${minR}. Reduza ${step}kg para consolidar técnica.` };
  }
  return { suggested: baseWeight, delta: 0, reason: "Mantenha a carga e busque mais repetições." };
}

export function computeStreak(completedDates: string[]): number {
  if (!completedDates.length) return 0;
  const set = new Set(completedDates);
  let streak = 0;
  const d = new Date();
  while (set.has(fmtDate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function today(): string { return fmtDate(new Date()); }

export const ACHIEVEMENTS: { id: string; label: string; check: (s: AppState) => boolean }[] = [
  { id: "first", label: "Primeiro Treino", check: (s) => s.completedDates.length >= 1 },
  { id: "streak3", label: "3 Dias Seguidos", check: (s) => computeStreak(s.completedDates) >= 3 },
  { id: "streak7", label: "Semana Perfeita", check: (s) => computeStreak(s.completedDates) >= 7 },
  { id: "ten", label: "10 Sessões", check: (s) => s.completedDates.length >= 10 },
  { id: "run5", label: "Primeiros 5km", check: (s) => Object.values(s.runLogs).some((r) => r.distance >= 5) },
  { id: "extra5", label: "5 Atividades Extras", check: (s) => s.extraActivities.length >= 5 },
];

// ---------- Recuperação / Prontidão ----------

export type RecoveryScore = {
  muscular: number;       // 0-100
  cardio: number;         // 0-100
  fatigue: "Baixa" | "Moderada" | "Alta";
  readiness: "Alta" | "Média" | "Baixa";
  weeklyLoad: number;     // unidades arbitrárias
  recommendations: string[];
};

function daysAgo(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((now.getTime() - d.getTime()) / 86400000));
}

export function computeRecovery(state: AppState): RecoveryScore {
  // Last 7 days load: strength volume + cardio km + extras
  let musc = 0;
  let cardio = 0;
  let extras = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const decay = 1 - i / 8; // mais recente pesa mais

    const dayLogs = state.logs[date];
    if (dayLogs) {
      const vol = Object.values(dayLogs).reduce(
        (a, sets) => a + sets.reduce((b, s) => b + (s ? s.weight * s.reps : 0), 0), 0,
      );
      musc += (vol / 1000) * decay; // 1000kg ≈ 1 unidade
    }

    const run = state.runLogs[date];
    if (run) cardio += run.distance * decay;

    state.extraActivities
      .filter((a) => a.date === date)
      .forEach((a) => {
        const load = (a.durationMin / 60) * intensityLoad(a.intensity);
        if (["Corrida", "Caminhada", "Ciclismo", "Natação", "Trilha"].includes(a.type)) {
          cardio += load * decay * 2;
        } else {
          musc += load * decay * 1.2;
          cardio += load * decay * 0.8;
        }
        extras += load * decay;
      });
  }

  const weeklyLoad = musc + cardio;

  // Recovery: começa em 100, cai com carga, sobe com dias sem treino
  const sinceLastTraining = state.completedDates.length
    ? Math.min(...state.completedDates.map(daysAgo))
    : 7;
  const restBonus = Math.min(20, sinceLastTraining * 8);

  // Last check-in modifier
  const lastCheckIn = [...state.checkIns].sort((a, b) => b.date.localeCompare(a.date))[0];
  const moodPenalty = lastCheckIn?.mood === "Exausto" ? 25 : lastCheckIn?.mood === "Cansado" ? 12 : 0;

  const muscular = Math.max(20, Math.min(100, Math.round(100 - musc * 4 + restBonus - moodPenalty)));
  const cardioR = Math.max(20, Math.min(100, Math.round(100 - cardio * 3 + restBonus - moodPenalty / 2)));

  const avg = (muscular + cardioR) / 2;
  const fatigue: RecoveryScore["fatigue"] = avg > 75 ? "Baixa" : avg > 55 ? "Moderada" : "Alta";
  const readiness: RecoveryScore["readiness"] = avg > 75 ? "Alta" : avg > 50 ? "Média" : "Baixa";

  const recommendations: string[] = [];
  if (muscular < 60) recommendations.push("Priorize sono de 8h e alongamento ativo hoje.");
  if (cardioR < 60) recommendations.push("Evite cardio intenso — opte por Z2 leve ou descanso.");
  if (extras > 6) recommendations.push("Atividades extras altas — reduza volume de musculação 20%.");
  if (sinceLastTraining >= 3) recommendations.push("Você está descansado — boa janela para sessão de alta intensidade.");
  if (lastCheckIn?.mood === "Exausto") recommendations.push("Check-in indica exaustão — considere dia off.");
  if (!recommendations.length) recommendations.push("Tudo equilibrado. Mantenha hidratação e proteína (1.6g/kg).");

  return { muscular, cardio: cardioR, fatigue, readiness, weeklyLoad: Math.round(weeklyLoad), recommendations };
}

// ---------- PRs e histórico por exercício ----------

export type ExerciseHistoryPoint = { date: string; maxWeight: number; volume: number; reps: number };

export function exerciseHistory(state: AppState, exerciseId: string): ExerciseHistoryPoint[] {
  const out: ExerciseHistoryPoint[] = [];
  Object.keys(state.logs).sort().forEach((date) => {
    const sets = state.logs[date]?.[exerciseId];
    if (!sets?.length) return;
    let maxW = 0, vol = 0, totalReps = 0;
    sets.forEach((s) => {
      if (!s) return;
      maxW = Math.max(maxW, s.weight);
      vol += s.weight * s.reps;
      totalReps += s.reps;
    });
    out.push({ date, maxWeight: maxW, volume: vol, reps: totalReps });
  });
  return out;
}

export function personalRecords(state: AppState): { exerciseId: string; name: string; weight: number; reps: number; date: string }[] {
  const prs: Record<string, { weight: number; reps: number; date: string }> = {};
  Object.entries(state.logs).forEach(([date, day]) => {
    Object.entries(day).forEach(([exId, sets]) => {
      sets.forEach((s) => {
        if (!s) return;
        const cur = prs[exId];
        if (!cur || s.weight > cur.weight) prs[exId] = { weight: s.weight, reps: s.reps, date };
      });
    });
  });
  return Object.entries(prs)
    .map(([exerciseId, v]) => ({ exerciseId, name: getExercise(exerciseId)?.name ?? exerciseId, ...v }))
    .sort((a, b) => b.weight - a.weight);
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function buildAISnapshot(state: AppState) {
  const since = new Date(); since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString().slice(0, 10);
  const strengthSessions = Object.keys(state.logs).filter((d) => d >= sinceIso).length;
  const cardioKm = Object.entries(state.runLogs)
    .filter(([d]) => d >= sinceIso)
    .reduce((s, [, r]) => s + r.distance, 0);
  const extraActivities = state.extraActivities
    .filter((a) => a.date >= sinceIso)
    .map((a) => ({ type: a.type, durationMin: a.durationMin, intensity: a.intensity, date: a.date }));
  const checkIns = state.checkIns.filter((c) => c.date >= sinceIso);

  // Progression per exercise
  const exMap: Record<string, { first: number; last: number; name: string }> = {};
  Object.keys(state.logs).sort().forEach((date) => {
    if (date < sinceIso) return;
    Object.entries(state.logs[date]).forEach(([exId, sets]) => {
      const max = sets.reduce((m, s) => (s && s.weight > m ? s.weight : m), 0);
      if (!max) return;
      const name = getExercise(exId)?.name ?? exId;
      if (!exMap[exId]) exMap[exId] = { first: max, last: max, name };
      else exMap[exId].last = max;
    });
  });
  const topExercises = Object.values(exMap)
    .map((e) => ({ name: e.name, progressionPct: Math.round(((e.last - e.first) / Math.max(1, e.first)) * 100) }))
    .sort((a, b) => Math.abs(b.progressionPct) - Math.abs(a.progressionPct))
    .slice(0, 5);

  const rec = computeRecovery(state);

  return {
    profile: state.profile ? {
      goal: state.profile.goal,
      sport: state.profile.sport,
      sports: state.profile.sports,
      gymDays: state.profile.gymDays,
      restrictions: state.profile.restrictionsList,
      daysPerWeek: state.profile.daysPerWeek,
    } : undefined,
    last30days: { strengthSessions, cardioKm: Math.round(cardioKm * 10) / 10, extraActivities, checkIns, topExercises, streak: state.streak },
    recovery: { muscular: rec.muscular, cardio: rec.cardio, readiness: rec.readiness, fatigue: rec.fatigue },
    importedWorkouts: state.importedWorkouts.slice(-3).map((w) => ({ name: w.name, split: w.split, hasCardio: w.hasCardio, mode: w.mode })),
  };
}

// ---------- Carga Semanal por categoria ----------

export type WeeklyLoad = {
  total: number;
  strength: number;
  cardio: number;
  sport: number;
  daily: { date: string; load: number }[];
  acwr: number; // acute:chronic workload ratio (7d / 28d avg)
  status: "Baixa" | "Ótima" | "Alta" | "Excessiva";
};

export function computeWeeklyLoad(state: AppState): WeeklyLoad {
  let strength = 0, cardio = 0, sport = 0;
  const daily: { date: string; load: number }[] = [];
  const dailyMap: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    let dayLoad = 0;

    const dayLogs = state.logs[date];
    if (dayLogs) {
      const vol = Object.values(dayLogs).reduce(
        (a, sets) => a + sets.reduce((b, s) => b + (s ? s.weight * s.reps : 0), 0), 0,
      );
      const u = vol / 1000;
      strength += u; dayLoad += u;
    }
    const run = state.runLogs[date];
    if (run) { cardio += run.distance; dayLoad += run.distance; }

    state.extraActivities.filter((a) => a.date === date).forEach((a) => {
      const load = (a.durationMin / 60) * intensityLoad(a.intensity) * 3;
      if (["Corrida","Caminhada","Ciclismo","Natação","Trilha"].includes(a.type)) cardio += load;
      else sport += load;
      dayLoad += load;
    });
    dailyMap[date] = dayLoad;
  }
  Object.keys(dailyMap).sort().forEach((date) => daily.push({ date, load: Math.round(dailyMap[date] * 10) / 10 }));

  // ACWR: 7d acute vs 28d chronic
  const acute = strength + cardio + sport;
  let chronic = 0;
  for (let i = 0; i < 28; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const dl = state.logs[date];
    if (dl) chronic += Object.values(dl).reduce((a, sets) => a + sets.reduce((b, s) => b + (s ? s.weight * s.reps : 0), 0), 0) / 1000;
    const r = state.runLogs[date]; if (r) chronic += r.distance;
    state.extraActivities.filter((a) => a.date === date).forEach((a) => {
      chronic += (a.durationMin / 60) * intensityLoad(a.intensity) * 3;
    });
  }
  const chronicAvg = chronic / 4 || 0.0001;
  const acwr = Math.round((acute / chronicAvg) * 100) / 100;
  const status: WeeklyLoad["status"] =
    acute < 5 ? "Baixa" : acwr > 1.5 ? "Excessiva" : acwr > 1.2 ? "Alta" : "Ótima";

  return {
    total: Math.round(acute * 10) / 10,
    strength: Math.round(strength * 10) / 10,
    cardio: Math.round(cardio * 10) / 10,
    sport: Math.round(sport * 10) / 10,
    daily, acwr, status,
  };
}

// ---------- Detecção de desequilíbrios musculares ----------

export type MuscleImbalance = {
  byGroup: { group: MuscleGroup; sets: number; pct: number }[];
  warnings: { kind: "deficit" | "excesso" | "ratio"; group?: string; detail: string }[];
};

export function muscleBalance(state: AppState): MuscleImbalance {
  // Sum sets per muscle group in last 14 days using logs
  const counts: Record<string, number> = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const dl = state.logs[date];
    if (!dl) continue;
    Object.entries(dl).forEach(([exId, sets]) => {
      const ex = getExercise(exId); if (!ex) return;
      counts[ex.group] = (counts[ex.group] || 0) + sets.filter(Boolean).length;
    });
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const byGroup = Object.entries(counts)
    .map(([group, sets]) => ({ group: group as MuscleGroup, sets, pct: Math.round((sets / total) * 100) }))
    .sort((a, b) => b.sets - a.sets);

  const warnings: MuscleImbalance["warnings"] = [];
  const get = (g: string) => counts[g] || 0;

  // Push:pull ratio (peito+ombro+tríceps vs costas+bíceps)
  const push = get("Peito") + get("Ombros") + get("Tríceps");
  const pull = get("Costas") + get("Bíceps");
  if (push > 0 && pull > 0) {
    const r = push / pull;
    if (r > 1.6) warnings.push({ kind: "ratio", detail: `Push/Pull em ${r.toFixed(1)}:1 — adicione costas para evitar desequilíbrio postural.` });
    if (r < 0.6) warnings.push({ kind: "ratio", detail: `Pull/Push em ${(1/r).toFixed(1)}:1 — adicione peito/ombro.` });
  }

  // Quad vs posterior
  const quad = get("Quadríceps");
  const post = get("Posterior") + get("Glúteos");
  if (quad > 0 && post > 0 && quad / post > 1.8)
    warnings.push({ kind: "ratio", detail: `Quadríceps ${(quad/post).toFixed(1)}x posterior — risco para joelho. Inclua stiff/elevação pélvica.` });

  // Déficit absoluto
  ["Costas","Posterior","Glúteos","Abdômen"].forEach((g) => {
    if (total > 10 && get(g) === 0) warnings.push({ kind: "deficit", group: g, detail: `Sem volume em ${g} nas últimas 2 semanas.` });
  });

  // Excesso
  byGroup.forEach((b) => { if (b.pct > 35) warnings.push({ kind: "excesso", group: b.group, detail: `${b.group} concentra ${b.pct}% do volume — distribua mais.` }); });

  if (!warnings.length) warnings.push({ kind: "deficit", detail: "Distribuição muscular equilibrada nas últimas 2 semanas. ✅" });
  return { byGroup, warnings };
}

// ---------- Índice de Performance (IP 0-100) ----------

export type PerformanceIndex = {
  score: number;
  grade: "S" | "A" | "B" | "C" | "D";
  breakdown: { label: string; value: number; max: number }[];
  trend: "subindo" | "estável" | "caindo";
};

export function performanceIndex(state: AppState): PerformanceIndex {
  // Consistência (35): sessões últimos 14 dias / 14
  const last14 = state.completedDates.filter((d) => daysAgo(d) <= 14).length;
  const consistency = Math.min(35, Math.round((last14 / 10) * 35));

  // Progressão (20): top exercise progression
  const snap = buildAISnapshot(state);
  const avgProg = snap.last30days.topExercises.length
    ? snap.last30days.topExercises.reduce((a, e) => a + Math.max(0, e.progressionPct), 0) / snap.last30days.topExercises.length
    : 0;
  const progression = Math.min(20, Math.round((avgProg / 10) * 20));

  // Recuperação (20)
  const rec = computeRecovery(state);
  const recovery = Math.round(((rec.muscular + rec.cardio) / 200) * 20);

  // Equilíbrio (15)
  const bal = muscleBalance(state);
  const severeWarnings = bal.warnings.filter((w) => w.kind === "ratio" || w.kind === "deficit").length;
  const balance = Math.max(0, 15 - severeWarnings * 4);

  // Carga adequada (10)
  const wl = computeWeeklyLoad(state);
  const loadScore = wl.status === "Ótima" ? 10 : wl.status === "Alta" ? 7 : wl.status === "Baixa" ? 4 : 2;

  const score = consistency + progression + recovery + balance + loadScore;
  const grade: PerformanceIndex["grade"] = score >= 85 ? "S" : score >= 70 ? "A" : score >= 55 ? "B" : score >= 40 ? "C" : "D";

  // Trend: compare with previous 14d
  const prev14 = state.completedDates.filter((d) => { const a = daysAgo(d); return a > 14 && a <= 28; }).length;
  const trend: PerformanceIndex["trend"] = last14 > prev14 + 1 ? "subindo" : last14 < prev14 - 1 ? "caindo" : "estável";

  return {
    score,
    grade,
    breakdown: [
      { label: "Consistência", value: consistency, max: 35 },
      { label: "Progressão", value: progression, max: 20 },
      { label: "Recuperação", value: recovery, max: 20 },
      { label: "Equilíbrio", value: balance, max: 15 },
      { label: "Carga", value: loadScore, max: 10 },
    ],
    trend,
  };
}

export function daysUntil(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}
