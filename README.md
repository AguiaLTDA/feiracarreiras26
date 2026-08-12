# Feira de Carreiras UNIVC 2026 — Seahaven UNIVC: O Último Episódio 🚀

Plataforma oficial gamificada de ranking e trilha de desafios profissionais inspirada no filme **"O Show de Truman"**, desenvolvida para o **Centro Universitário Vale do Cricaré (UNIVC)** para a Feira de Carreiras do dia 12 de Agosto de 2026.

![Identidade Visual UNIVC](WhatsApp%20Image%202026-08-06%20at%2015.47.55.jpeg)

---

## 🌟 Funcionalidades Oficiais da Aplicação

- **1. Cadastro do Estudante & Crachá Virtual (`#cadastro`)**: Registro individual de alunos (Nome, WhatsApp, Escola de Origem e Curso de Preferência) com emissão de Crachá de Protagonista e QR Code.
- **2. 10 Estações Físicas do Campus (`#estacoes`)**:
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
  - Pódio em destaque (1º, 2º e 3º lugares).
  - Tabela de classificação em tempo real conectada ao Supabase Realtime.
  - Filtros por escola e busca por aluno/curso.
  - **Modo Telão Auditório**: Visão em tela cheia de alto contraste para projeção no auditório principal.
- **5. Painel de Administração (`#admin`)**:
  - Acesso protegido por senha (`admin2026`).
  - Edição de dados de alunos (Nome, WhatsApp, Escola, Curso e Pontos).
  - Link direto para conversar pelo WhatsApp com um clique (`https://wa.me/...`).
  - Exclusão de registros inválidos ou de teste.
  - **Exportação para Excel / CSV** para o time de marketing pós-evento.
  - **Limpeza de Base (Pré-Evento)** para zerar os testes antes de abrir os portões no dia 12.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5 Semântico, CSS Custom Properties (Design System UNIVC), JavaScript ES6.
- **Banco de Dados & Realtime**: Supabase (PostgreSQL + WebSockets).
- **Áudio**: Web Audio API (sintetizador nativo sem dependências externas).
- **Persistência**: Supabase Realtime + LocalStorage Fallback.

---

## 🚀 Como Executar

Basta abrir o arquivo `index.html` em qualquer navegador web ou servir via HTTP local:

```bash
python -m http.server 8080
```
E acesse `http://localhost:8080`.
