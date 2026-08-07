# Feira de Carreiras UNIVC 2026 — Seahaven UNIVC: O Último Episódio 🚀

Mecanismo gamificado de ranking e trilha de desafios profissionais inspirado no filme **"O Show de Truman"**, desenvolvido para o **Centro Universitário Vale do Cricaré (UNIVC)** para a Feira de Carreiras do dia 12 de Agosto de 2026.

![Identidade Visual UNIVC](WhatsApp%20Image%202026-08-06%20at%2015.47.55.jpeg)

---

## 🌟 Funcionalidades do Protótipo

- **1. Cadastro Simples & Crachá Virtual (`#cadastro`)**: Registro de aluno/equipe e geração de Crachá de Protagonista com ID único e QR Code.
- **2. 10 Estações Físicas de Desafio (`#estacoes`)**:
  - **Auditório Principal** (Publicidade, Adm & Contábeis) → Fragmento: `"CASO"`
  - **NPJ - Práticas Jurídicas** (Direito) → Fragmento: `"EU"`
  - **Clínica-Escola** (Psicologia & Fisioterapia) → Fragmento: `"NÃO"`
  - **Lab de Semiologia** (Enfermagem & Farmácia) → Fragmento: `"OS"`
  - **Lab de Radiologia** (Radiologia / Imagem) → Fragmento: `"VEJA"`
  - **Clínica Odontológica** (Odontologia) → Fragmento: `"MAIS"`
  - **Quadra Poliesportiva** (Educação Física) → Fragmento: `"BOM"`
  - **Lab Tech** (Análise e Dev. de Sistemas — ADS) → Fragmento: `"DIA"`
  - **Clínica Veterinária** (Med. Veterinária & Agronomia) → Fragmento: `"BOA"`
  - **Lab de Engenharias** (Engenharias & Arquitetura) → Fragmento: `"NOITE"`
- **3. O Desafio da Cúpula (`#senha`)**: Montagem da frase histórica de Truman para destravar a porta de saída da cúpula:
  > *"CASO EU NÃO OS VEJA MAIS: BOM DIA E BOA NOITE!"*
- **4. Ranking Gamificado Ao Vivo & Modo Telão (`#ranking`)**:
  - Pódio em destaque (1º, 2º e 3º lugares com troféu/coroa).
  - Tabela completa de classificação por pontuação e estações concluídas.
  - Filtros por escola e busca por equipe.
  - **Modo Telão Auditório**: Visão em tela cheia de alto contraste para projeção no auditório principal.
  - Efeitos sonoros via Web Audio API.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5 Semântico, CSS Custom Properties (Design System UNIVC), JavaScript ES6.
- **Áudio**: Web Audio API (sintetizador nativo sem dependências externas).
- **Persistência**: LocalStorage com estado inicial pré-carregado.

---

## 🚀 Como Executar

Basta abrir o arquivo `index.html` em qualquer navegador web ou servir via HTTP local:

```bash
python -m http.server 8080
```
E acesse `http://localhost:8080`.
