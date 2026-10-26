# Feira de Carreiras UNIVC 2026 — Seahaven UNIVC: O Último Episódio 🚀

Plataforma oficial gamificada de ranking e trilha de desafios profissionais inspirada no filme **"O Show de Truman"**, desenvolvida para o **Centro Universitário Vale do Cricaré (UNIVC)** para a Feira de Carreiras do dia 30 de Outubro de 2026.

![Identidade Visual UNIVC](WhatsApp%20Image%202026-08-06%20at%2015.47.55.jpeg)

---

## 🌟 Funcionalidades Oficiais da Aplicação

- **1. Cadastro do Estudante & Crachá Virtual (`#cadastro`)**: Registro individual de alunos (Nome, WhatsApp, Escola de Origem e Curso de Preferência) com emissão de Crachá de Protagonista e QR Code.
- **2. 10 Estações Físicas do Campus (`#estacoes`)**: Auditório Principal, NPJ, Clínica-Escola, Lab de Semiologia, Lab de Radiologia, Clínica Odontológica, Quadra Poliesportiva, Lab Tech, Clínica Veterinária e Lab de Engenharias. Cada acerto soma pontos base + bônus de tempo + combo.
- **3. Ranking Gamificado Ao Vivo & Modo Telão (`#ranking`)**:
  - Pódio em destaque (1º, 2º e 3º lugares).
  - Tabela de classificação em tempo real conectada ao Supabase Realtime.
  - Filtros por escola e busca por aluno/curso.
  - **Modo Telão Auditório**: Visão em tela cheia de alto contraste para projeção no auditório principal.
- **4. Painel de Administração (`#admin`)**:
  - Acesso protegido por senha (`admin2026`).
  - Edição de dados de alunos (Nome, WhatsApp, Escola, Curso e Pontos).
  - Link direto para conversar pelo WhatsApp com um clique (`https://wa.me/...`).
  - Exclusão de registros inválidos ou de teste.
  - **Exportação para Excel / CSV** para o time de marketing pós-evento.
  - **Exportação da Base Completa (JSON)** com todos os campos e a posição no ranking.
  - **Salvar Base e Reiniciar Contagem**: arquiva a rodada atual (participantes + ranqueamento final) em `teams_archive`, baixa um CSV de segurança, zera o ranking e inicia uma nova rodada. Os celulares dos participantes descartam o crachá da rodada anterior automaticamente.
  - **Bases Salvas**: lista das rodadas arquivadas, cada uma exportável em CSV ou JSON.
  - **Limpeza de Base (Pré-Evento)** para zerar os testes antes de abrir os portões.

> **Banco de dados:** execute `schema.sql` no SQL Editor do Supabase (cria `app_settings` e `teams_archive`). Para reiniciar a base pelo SQL, execute `reset_rodada.sql` — ele salva a base atual em `teams_archive` antes de zerar.

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
