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
    courses: "Psicologia",
    area: "SAÚDE",
    areaBadge: "ESTAÇÃO SAÚDE",
    icon: "brain-circuit",
    title: "Clínica-Escola: Mente & Comportamento",
    fragment: "NÃO",
    narrative: "No filme O Show de Truman, Truman Burbank descobre que toda a sua vida foi construída e observada por outras pessoas. Desde a infância, ele também foi levado a acreditar que o mar era extremamente perigoso, após vivenciar a morte de seu pai em um acidente no mar.",
    challengeTitle: "Desafio de Psicologia",
    question: "Considerando os efeitos que experiências marcantes podem produzir sobre uma pessoa, é possível afirmar que:",
    options: [
      { letter: "A", text: "Experiências traumáticas podem influenciar a maneira como uma pessoa percebe determinadas situações, podendo provocar medo e comportamentos de evitação.", correct: true },
      { letter: "B", text: "Uma experiência traumática afeta somente as pessoas que apresentam algum transtorno psicológico antes do acontecimento.", correct: false },
      { letter: "C", text: "Depois que uma pessoa vivencia uma experiência traumática, ela necessariamente desenvolverá um transtorno mental.", correct: false },
      { letter: "D", text: "O trauma vivido por Truman não poderia influenciar seu comportamento, pois aconteceu durante sua infância.", correct: false },
      { letter: "E", text: "O medo apresentado por Truman demonstra que todas as pessoas que vivenciam situações semelhantes desenvolverão exatamente a mesma reação.", correct: false }
    ],
    hint: "Traumas influenciam a percepção e geram comportamentos de evitação."
  },
  {
    id: 4,
    code: "EST-04",
    location: "Lab de Semiologia",
    courses: "Enfermagem · Farmácia",
    area: "SAÚDE",
    areaBadge: "ESTAÇÃO SAÚDE",
    icon: "stethoscope",
    title: "Semiologia: Triagem de Sinais Vitais",
    fragment: "OS",
    narrative: "Na triagem do Laboratório de Semiologia, a equipe de saúde avalia a resposta fisiológica real dos pacientes diante de situações de emergência.",
    challengeTitle: "Desafio de Triagem Clínica (Semiologia)",
    question: "Um paciente de 68 anos chega à unidade referindo falta de ar e fraqueza. Sinais vitais: PA: 88 × 54 mmHg | FC: 128 bpm | FR: 30 irpm | SpO₂: 87% | T: 37,2 °C. Qual alteração merece maior atenção imediata?",
    options: [
      { letter: "A", text: "Temperatura corporal (T: 37,2 °C).", correct: false },
      { letter: "B", text: "Frequência cardíaca isolada (FC: 128 bpm).", correct: false },
      { letter: "C", text: "Saturação de oxigênio (SpO₂: 87%) e padrão respiratório (FR: 30 irpm).", correct: true },
      { letter: "D", text: "Nenhuma das alterações apresentadas exige atenção imediata.", correct: false }
    ],
    hint: "Observe a saturação de oxigênio (SpO₂ de 87% indica hipoxemia grave)."
  },
  {
    id: 5,
    code: "EST-05",
    location: "Lab de Radiologia",
    courses: "Radiologia e Fisioterapia",
    area: "TECNOLOGIA / SAÚDE",
    areaBadge: "ESTAÇÃO TECNOLOGIA & SAÚDE",
    icon: "x-ray",
    title: "Radiologia e Fisioterapia: Diagnóstico e Reabilitação",
    fragment: "VEJA",
    narrative: "No Laboratório de Radiologia, a radiografia e a avaliação fisioterapêutica trabalham juntas para identificar trauma e planejar a reabilitação funcional.",
    challengeTitle: "Desafio de Radiologia e Fisioterapia",
    question: "Durante o atendimento de um personagem que sofreu uma queda, é realizada uma radiografia da perna. Na imagem, observa-se uma descontinuidade da cortical óssea da tíbia, associada a uma linha radiolúcida atravessando o osso. Qual é a interpretação radiológica mais adequada?",
    options: [
      { letter: "A", text: "Fratura da tíbia, caracterizada pela interrupção da continuidade óssea.", correct: true },
      { letter: "B", text: "Estrutura óssea normal, sem alterações radiográficas.", correct: false },
      { letter: "C", text: "Artefato radiográfico sem relação com a estrutura óssea.", correct: false },
      { letter: "D", text: "Presença de ar nos tecidos ósseos, sem alteração da cortical.", correct: false }
    ],
    hint: "A linha radiolúcida com descontinuidade da cortical indica fratura."
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
    narrative: "Na Quadra Poliesportiva, nenhuma descoberta liberta Truman sem o condicionamento físico para remar e vencer a tempestade. Esta é a estação da ação e da resistência cardiorrespiratória!",
    challengeTitle: "Desafio de Condicionamento Cardíaco (Quadra)",
    question: "Após realizar o circuito funcional na Quadra, qual métrica fisiológica demonstra que o aluno possui um bom condicionamento e excelente recuperação pós-esforço?",
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
    title: "Clínica Veterinária: Bem-Estar Animal",
    fragment: "BOA",
    narrative: "Em Seahaven, tudo está sob controle. Os atores seguem o roteiro e até os animais parecem perfeitamente saudáveis. Mas será que a vida também consegue seguir um roteiro?",
    challengeTitle: "Desafio: Qual paciente saiu do roteiro?",
    question: "Três cães estão prontos para entrar em cena. A produção garante que todos estão bem, mas um deles apresenta sinais de que precisa de atendimento veterinário. Observe os pacientes e descubra qual deles está realmente doente:",
    options: [
      { letter: "A", text: "Paciente A: Está animado, alimentou-se normalmente, não apresenta febre e está com as mucosas rosadas.", correct: false },
      { letter: "B", text: "Paciente B: Está quieto e abatido, apresenta febre, coração acelerado, mucosas pálidas e não quis se alimentar.", correct: true },
      { letter: "C", text: "Paciente C: Está alerta, não apresenta febre, alimentou-se normalmente e está interagindo com as pessoas.", correct: false },
      { letter: "D", text: "Todos estão saudáveis. Se não há ferimentos visíveis, não há motivo para atendimento veterinário.", correct: false }
    ],
    hint: "Prostação, febre, taquicardia e mucosas pálidas indicam doença."
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

export const INITIAL_TEAMS = [];
