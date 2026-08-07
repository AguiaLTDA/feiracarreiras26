// Data structure for Seahaven UNIVC - Feira de Carreiras 2026 (10 Estações Físicas UNIVC)

export const EVENT_INFO = {
  title: "FEIRA DE CARREIRAS UNIVC 2026",
  subtitle: "SEAHAVEN UNIVC — O Último Episódio",
  date: "12 de Agosto de 2026",
  location: "Centro Universitário Vale do Cricaré — Campus UNIVC",
  totalStations: 10,
  fullPassword: ["CASO", "EU", "NÃO", "OS", "VEJA", "MAIS", "BOM", "DIA", "BOA", "NOITE"],
  fullQuote: "CASO EU NÃO OS VEJA MAIS: BOM DIA E BOA NOITE!"
};

export const STATIONS = [
  {
    id: 1,
    code: "EST-01",
    location: "Auditório Principal",
    courses: "Publicidade e Propaganda · Administração · Ciências Contábeis",
    area: "NEGÓCIOS",
    areaBadge: "ESTAÇÃO NEGÓCIOS",
    icon: "bullhorn",
    title: "Auditório: A Cidade como Produto",
    fragment: "CASO",
    narrative: "PONTO CENTRAL DA TRILHA. Christof exibe a chamada do programa no telão do Auditório e explica as regras. Em Seahaven não há comerciais tradicionais: tudo se sustenta por inserção de produtos na cena.",
    challengeTitle: "Desafio de Persuasão e Custos (Auditório)",
    question: "Ao analisar o cartaz de Seahaven 'O melhor cereal do mundo, feito para quem quer a vida perfeita', qual é a estratégia publicitária e a falha de gestão financeira do programa?",
    options: [
      { letter: "A", text: "Apelo emocional baseado no desejo de controle + falta de transparência sobre os altos custos de product placement em cena.", correct: true },
      { letter: "B", text: "Uso exclusivo de dados estatísticos sem apelo emocional ou comercial.", correct: false },
      { letter: "C", text: "Transparência total de custos e ausência de técnicas de vendas no roteiro.", correct: false },
      { letter: "D", text: "Preço baixo sem qualquer inserção de produto no cenário de Seahaven.", correct: false }
    ],
    hint: "Considere como as marcas financiam o reality através do comportamento dos atores."
  },
  {
    id: 2,
    code: "EST-02",
    location: "NPJ (Núcleo de Práticas Jurídicas)",
    courses: "Direito",
    area: "NEGÓCIOS",
    areaBadge: "ESTAÇÃO NEGÓCIOS",
    icon: "scale-balanced",
    title: "NPJ: O Contrato Invisível",
    fragment: "EU",
    narrative: "No NPJ, analisamos o status jurídico de Truman. Ele foi adotado por uma corporação ainda bebê e nunca consentiu com nada. Não assinou contrato, não autorizou o uso da própria imagem e trabalhava sem saber.",
    challengeTitle: "Desafio do Contrato Abusivo (NPJ)",
    question: "O 'Contrato de Participação em Seahaven' assinado pelos atores possui cláusulas que obrigam a vigiar Truman sem seu consentimento. Qual garantia constitucional essa estrutura viola primariamente?",
    options: [
      { letter: "A", text: "Direitos fundamentais à privacidade, liberdade de locomoção, imagem e dignidade da pessoa humana.", correct: true },
      { letter: "B", text: "Apenas normas de trânsito locais da cidade de Seahaven.", correct: false },
      { letter: "C", text: "Cláusula simples de rescisão de aluguel comercial.", correct: false },
      { letter: "D", text: "Cumprimento estrito do direito autoral da emissora.", correct: false }
    ],
    hint: "Pense nas liberdades individuais de um cidadão que nunca pôde escolher."
  },
  {
    id: 3,
    code: "EST-03",
    location: "Clínica-Escola",
    courses: "Psicologia · Fisioterapia",
    area: "SAÚDE",
    areaBadge: "ESTAÇÃO SAÚDE",
    icon: "brain-circuit",
    title: "Clínica-Escola: Mente & Corpo",
    fragment: "NÃO",
    narrative: "Na Clínica-Escola, investigamos as marcas físicas e emocionais de Truman. Christof implantou o medo de água e o desgaste físico de 30 anos de postura de escritório. O corpo e a mente guardam tudo.",
    challengeTitle: "Desafio da Dor e Escuta Terapêutica (Clínica-Escola)",
    question: "Como a equipe multidisciplinar da Clínica-Escola identifica a diferença entre uma manipulação psicológica/física encenada e um atendimento profissional verdadeiro?",
    options: [
      { letter: "A", text: "A escuta e avaliação legítimas promovem autonomia e reabilitação real, enquanto a manipulação induz bloqueios e dor continuada.", correct: true },
      { letter: "B", text: "Ambos os processos visam condicionar as escolhas do sujeito através do medo.", correct: false },
      { letter: "C", text: "A avaliação profissional ignora queixas reais do paciente.", correct: false },
      { letter: "D", text: "A marcha com dor compensatória é sempre uma encenação sem impacto mecânico.", correct: false }
    ],
    hint: "Autonomia do paciente vs Manipulação induzida."
  },
  {
    id: 4,
    code: "EST-04",
    location: "Lab de Semiologia",
    courses: "Enfermagem · Farmácia",
    area: "SAÚDE",
    areaBadge: "ESTAÇÃO SAÚDE",
    icon: "stethoscope",
    title: "Semiologia: Sinais Vitais & Placebo",
    fragment: "OS",
    narrative: "No Laboratório de Semiologia, os alunos analisam que atores fingem amor e amizade, mas ninguém consegue falsificar sinais vitais ou a diferença entre princípio ativo e placebo.",
    challengeTitle: "Desafio de Semiologia e Farmacologia",
    question: "Na triagem de Semiologia, a ficha de um figurante apresenta: Pressão 120x80 mmHg, Saturação 99% e Frequência Cardíaca de 0 bpm em repouso. O que essa medição revela?",
    options: [
      { letter: "A", text: "É uma ficha falsificada; é fisiologicamente impossível ter Frequência Cardíaca 0 bpm em um indivíduo vivo em repouso.", correct: true },
      { letter: "B", text: "A pressão arterial indica uma parada cardiorrespiratória iminente.", correct: false },
      { letter: "C", text: "O paciente ingeriu placebo e parou de respirar.", correct: false },
      { letter: "D", text: "Todos os parâmetros estão em perfeito estado de repouso.", correct: false }
    ],
    hint: "Qual sinal vital indica os batimentos do coração?"
  },
  {
    id: 5,
    code: "EST-05",
    location: "Lab de Radiologia",
    courses: "Radiologia / Diagnóstico por Imagem",
    area: "TECNOLOGIA / SAÚDE",
    areaBadge: "ESTAÇÃO TECNOLOGIA",
    icon: "x-ray",
    title: "Radiologia: O Raio-X da Verdade",
    fragment: "VEJA",
    narrative: "No Laboratório de Radiologia, a tecnologia atravessa a superfície do cenário de Seahaven e revela o que as câmeras de Christof tentavam esconder dentro do corpo humano.",
    challengeTitle: "Desafio de Diagnóstico por Imagem (Radiologia)",
    question: "Ao examinar uma imagem radiográfica de tórax de um ator do elenco, detecta-se um objeto retangular metálico opaco na região esofágica. Qual a interpretação radiológica?",
    options: [
      { letter: "A", text: "Presença de um corpo estranho (microfone metálico engolido acidentalmente), invisível no exame visual externo.", correct: true },
      { letter: "B", text: "Estrutura óssea normal do gradil costal humano.", correct: false },
      { letter: "C", text: "Artefato sem qualquer densidade radiopaca.", correct: false },
      { letter: "D", text: "Densidade de ar normal nos alvéolos pulmonares.", correct: false }
    ],
    hint: "Objetos metálicos possuem alta densidade radiopaca no raio-X."
  },
  {
    id: 6,
    code: "EST-06",
    location: "Clínica Odontológica",
    courses: "Odontologia",
    area: "SAÚDE",
    areaBadge: "ESTAÇÃO SAÚDE",
    icon: "tooth",
    title: "Clínica Odontológica: Registro Forense",
    fragment: "MAIS",
    narrative: "Na Clínica Odontológica, os alunos aprendem que Christof podia trocar a história de Truman, mas não podia alterar a sua arcada dentária — o registro de identificação humana mais inviolável.",
    challengeTitle: "Desafio de Odontologia Forense",
    question: "Por que os exames odontológicos e moldes da arcada dentária realizados na clínica são decisivos na identificação forense do verdadeiro Truman entre dublês?",
    options: [
      { letter: "A", text: "Devido à unicidade das estruturas dentárias, restaurações, desgastes e morfologia da arcada de cada ser humano.", correct: true },
      { letter: "B", text: "Porque os dentes humanos alteram seu código genético a cada semana.", correct: false },
      { letter: "C", text: "Porque todas as pessoas possuem exatamente a mesma posição e formato dentário.", correct: false },
      { letter: "D", text: "Porque figurantes usam lentes de contato dentárias padronizadas pela produção.", correct: false }
    ],
    hint: "Características morfológicas e tratamentos tornam a arcada dentária única."
  },
  {
    id: 7,
    code: "EST-07",
    location: "Quadra Poliesportiva",
    courses: "Educação Física",
    area: "SAÚDE",
    areaBadge: "ESTAÇÃO SAÚDE",
    icon: "volleyball",
    title: "Quadra: Circuito & Preparação Física",
    fragment: "BOM",
    narrative: "Na Quadra Poliesportiva, Nenhuma descoberta liberta Truman sem o condicionamento físico para remar e vencer a tempestade. Esta é a estação da ação e da resistência cardiorrespiratória!",
    challengeTitle: "Desafio de Condicionamento Cardíaco (Quadra)",
    question: "Após realizar o circuito funcional na Quadra, qual métrica fisiológica demonstra que a equipe possui um bom condicionamento e excelente recuperação pós-esforço?",
    options: [
      { letter: "A", text: "Queda consistente e rápida da Frequência Cardíaca (FC) de volta aos níveis de repouso nos primeiros minutos de recuperação.", correct: true },
      { letter: "B", text: "Manutenção da FC máxima por mais de 5 horas consecutivas em repouso.", correct: false },
      { letter: "C", text: "Ausência total de elevação da FC durante exercícios de alta intensidade.", correct: false },
      { letter: "D", text: "Interrupção abrupta da circulação sanguínea pós-treino.", correct: false }
    ],
    hint: "A velocidade de recuperação da FC indica condicionamento físico."
  },
  {
    id: 8,
    code: "EST-08",
    location: "Lab Tech",
    courses: "Análise e Desenvolvimento de Sistemas (ADS)",
    area: "TECNOLOGIA",
    areaBadge: "ESTAÇÃO TECNOLOGIA",
    icon: "code",
    title: "Lab Tech: Algoritmos & Debugging",
    fragment: "DIA",
    narrative: "No Lab Tech, analisamos o software que controla Seahaven. Um erro de transmissão no rádio do carro vazou o canal de áudio da produção para Truman.",
    challengeTitle: "Desafio de Code Debugging (Lab Tech)",
    question: "Observe o trecho de código do rádio: `if (frequency == 99.9) { broadcast(STAFF_AUDIO_CHANNEL); }`. Qual o erro de arquitetura de software que vazou a produção?",
    options: [
      { letter: "A", text: "Falta de criptografia e canal aberto em frequência pública sem autenticação de perfil de usuário (Truman vs Staff).", correct: true },
      { letter: "B", text: "Uso de operador de igualdade que trava o processador do carro.", correct: false },
      { letter: "C", text: "Falta de uma interface em HTML para sintonizar o rádio FM.", correct: false },
      { letter: "D", text: "O código não possui variáveis declaradas em linguagem assembly.", correct: false }
    ],
    hint: "Transmitir áudio sensível de staff em canal aberto de rádio."
  },
  {
    id: 9,
    code: "EST-09",
    location: "Clínica Veterinária",
    courses: "Medicina Veterinária · Agronomia",
    area: "SAÚDE / TECNOLOGIA",
    areaBadge: "ESTAÇÃO SAÚDE",
    icon: "shield-cat",
    title: "Clínica Veterinária: Sol de Cenário",
    fragment: "BOA",
    narrative: "Na Clínica Veterinária, avaliamos o bem-estar animal e agrícola. O cachorro de Seahaven e a lavoura do estúdio não sobrevivem de luz artificial de refletores.",
    challengeTitle: "Desafio de Fotossíntese e Bem-Estar (Clínica Vet)",
    question: "Por que uma plantação mantida no estúdio de Seahaven morreria após algumas semanas sob a iluminação dos refletores do programa?",
    options: [
      { letter: "A", text: "Refletores comuns de estúdio não emitem a Radiação Fotossintologicamente Ativa (PAR) nem os espectros essenciais para a fotossíntese.", correct: true },
      { letter: "B", text: "As plantas necessitam apenas de calor térmico e não utilizam luz para produzir energia.", correct: false },
      { letter: "C", text: "O barulho dos microfones do estúdio impede a absorção de nutrientes pelas raízes.", correct: false },
      { letter: "D", text: "O solo artificial de plástico fornece todos os nutrientes de uma lavoura real.", correct: false }
    ],
    hint: "Luz de estúdio não possui o espectro solar para fotossíntese."
  },
  {
    id: 10,
    code: "EST-10",
    location: "Lab de Engenharias",
    courses: "Engenharia Mecânica · Produção · Arquitetura",
    area: "TECNOLOGIA",
    areaBadge: "ESTAÇÃO TECNOLOGIA",
    icon: "gears",
    title: "Lab Engenharias: Estruturas & Marés",
    fragment: "NOITE",
    narrative: "No Laboratório de Engenharias, desvendamos as engrenagens da tempestade artificial e a maquete da cidade armadilha desenhada com ruas circulares sem saída.",
    challengeTitle: "Desafio de Processos e Urbanismo (Engenharias)",
    question: "Para gerar a tempestade marinha de Seahaven no tanque, a bomba d'água apresentou queda de vazão por gargalo de fluxo. Como a Engenharia de Produção soluciona essa restrição?",
    options: [
      { letter: "A", text: "Mapear a restrição de capacidade, reequilibrar o ritmo de bombeamento e otimizar o ponto crítico do fluxo de processo.", correct: true },
      { letter: "B", text: "Aumentar a velocidade dos geradores de vento sem ajustar o duto de água comprimida.", correct: false },
      { letter: "C", text: "Ignorar o duto obstruído e aumentar a carga elétrica do sistema até o limite de fusão.", correct: false },
      { letter: "D", text: "Desativar os sensores de fluxo e manter a operação descalibrada.", correct: false }
    ],
    hint: "Equilibrar a capacidade do ponto restritivo (Teoria das Restrições)."
  }
];

export const INITIAL_TEAMS = [
  {
    id: "team-001",
    name: "Equipe Truman 360",
    school: "E.E.E.F.M. Polivalente",
    avatar: "🚀",
    completedStations: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    unlockedFragments: ["CASO", "EU", "NÃO", "OS", "VEJA", "MAIS", "BOM", "DIA", "BOA", "NOITE"],
    solvedFinalPuzzle: true,
    score: 1500,
    timeSpent: "1h 25m",
    lastUpdate: "10:15:22"
  },
  {
    id: "team-002",
    name: "Os Desbravadores",
    school: "Colégio Aracruz",
    avatar: "⚡",
    completedStations: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    unlockedFragments: ["CASO", "EU", "NÃO", "OS", "VEJA", "MAIS", "BOM", "DIA", "BOA"],
    solvedFinalPuzzle: false,
    score: 1120,
    timeSpent: "1h 40m",
    lastUpdate: "10:28:40"
  },
  {
    id: "team-003",
    name: "Vanguarda UNIVC",
    school: "E.E.E.M. Cricaré",
    avatar: "🔬",
    completedStations: [1, 2, 3, 4, 5, 6, 7, 8],
    unlockedFragments: ["CASO", "EU", "NÃO", "OS", "VEJA", "MAIS", "BOM", "DIA"],
    solvedFinalPuzzle: false,
    score: 980,
    timeSpent: "1h 50m",
    lastUpdate: "10:31:12"
  },
  {
    id: "team-004",
    name: "Fênix da Carreiras",
    school: "Escola Estadual São Mateus",
    avatar: "🔥",
    completedStations: [1, 2, 3, 4, 5, 6, 7],
    unlockedFragments: ["CASO", "EU", "NÃO", "OS", "VEJA", "MAIS", "BOM"],
    solvedFinalPuzzle: false,
    score: 790,
    timeSpent: "1h 20m",
    lastUpdate: "10:18:05"
  },
  {
    id: "team-005",
    name: "Líderes do Futuro",
    school: "Instituto Federal (IFES)",
    avatar: "💡",
    completedStations: [1, 2, 3, 4, 5],
    unlockedFragments: ["CASO", "EU", "NÃO", "OS", "VEJA"],
    solvedFinalPuzzle: false,
    score: 550,
    timeSpent: "0h 55m",
    lastUpdate: "10:04:19"
  }
];
