// Main Application Controller - Seahaven UNIVC Feira de Carreiras 2026 (Com Supabase Realtime)

import { EVENT_INFO, STATIONS, INITIAL_TEAMS } from './data.js';
import { sounds } from './audio.js';
import { syncTeamToSupabase, fetchTeamsFromSupabase, subscribeToRealtimeLeaderboard } from './supabase.js';

class App {
  constructor() {
    this.currentStudent = null;
    this.teams = [];
    this.selectedStationId = null;
    this.assembledWords = [];
    this.activeAreaFilter = 'ALL';
    this.activeSchoolFilter = 'ALL';
    this.searchQuery = '';
    
    this.init();
  }

  async init() {
    this.loadState();
    this.bindEvents();
    this.render();

    // Tenta carregar dados em nuvem do Supabase
    const cloudTeams = await fetchTeamsFromSupabase();
    if (cloudTeams && cloudTeams.length > 0) {
      this.teams = cloudTeams;
      this.saveTeams();
      this.renderLeaderboard();
      this.renderTelaoLeaderboard();
    }

    // Ativa escuta em tempo real do Supabase
    subscribeToRealtimeLeaderboard((realtimeTeams) => {
      console.log("⚡ Leaderboard atualizado em tempo real via Supabase!");
      this.teams = realtimeTeams;
      this.saveTeams();
      this.renderLeaderboard();
      this.renderTelaoLeaderboard();
      this.updateHeaderBadges();
    });
  }

  loadState() {
    const savedStudent = localStorage.getItem('univc_current_student');
    if (savedStudent) {
      this.currentStudent = JSON.parse(savedStudent);
    } else {
      this.currentStudent = {
        id: 'student-user-' + Date.now(),
        name: 'Aluno Visitante',
        whatsapp: '(27) 99999-9999',
        school: 'Pedro Paulo Grobério (Jaguaré)',
        preferredCourse: 'Análise e Dev. de Sistemas (ADS)',
        avatar: '🎓',
        completedStations: [],
        unlockedFragments: [],
        solvedFinalPuzzle: false,
        score: 0,
        timeSpent: '0m',
        lastUpdate: new Date().toLocaleTimeString()
      };
    }

    const savedTeams = localStorage.getItem('univc_all_teams');
    if (savedTeams) {
      this.teams = JSON.parse(savedTeams);
    } else {
      this.teams = [...INITIAL_TEAMS];
      this.saveTeams();
    }
  }

  saveStudent() {
    this.currentStudent.lastUpdate = new Date().toLocaleTimeString();
    localStorage.setItem('univc_current_student', JSON.stringify(this.currentStudent));
    this.updateUserInTeams();

    // Sincroniza em nuvem no Supabase
    syncTeamToSupabase(this.currentStudent);
  }

  saveTeams() {
    localStorage.setItem('univc_all_teams', JSON.stringify(this.teams));
  }

  updateUserInTeams() {
    const idx = this.teams.findIndex(t => t.id === this.currentStudent.id);
    if (idx >= 0) {
      this.teams[idx] = { ...this.currentStudent };
    } else {
      this.teams.push({ ...this.currentStudent });
    }
    this.saveTeams();
  }

  bindEvents() {
    // Nav Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Registration Form
    const form = document.getElementById('form-registration');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        sounds.playSuccess();
        this.handleRegistration();
      });
    }

    // Sound toggle
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        sounds.enabled = !sounds.enabled;
        document.getElementById('sound-icon').className = sounds.enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        sounds.playClick();
      });
    }

    // Telão Mode toggles
    document.getElementById('btn-telao-header')?.addEventListener('click', () => this.toggleTelaoMode(true));
    document.getElementById('btn-open-telao')?.addEventListener('click', () => this.toggleTelaoMode(true));
    document.getElementById('btn-exit-telao')?.addEventListener('click', () => this.toggleTelaoMode(false));

    // Area filters for Stations
    document.querySelectorAll('.filter-area-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        document.querySelectorAll('.filter-area-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeAreaFilter = btn.dataset.area;
        this.renderStationsGrid();
      });
    });

    // Modal Close
    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal();
    });

    // Clear Sentence
    document.getElementById('btn-clear-sentence')?.addEventListener('click', () => {
      sounds.playClick();
      this.assembledWords = [];
      this.renderSentenceAssembly();
    });

    // Verify Password
    document.getElementById('btn-verify-password')?.addEventListener('click', () => {
      this.verifySentencePassword();
    });

    // Ranking Filters & Search
    document.getElementById('search-ranking')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderLeaderboard();
    });

    document.getElementById('filter-school-ranking')?.addEventListener('change', (e) => {
      sounds.playClick();
      this.activeSchoolFilter = e.target.value;
      this.renderLeaderboard();
    });

    // Live Simulator Button
    document.getElementById('btn-simulate-points')?.addEventListener('click', () => {
      sounds.playSuccess();
      this.simulateLiveUpdates();
    });

    // Reset Data
    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      if (confirm('Deseja reiniciar os dados do protótipo para o estado inicial?')) {
        localStorage.clear();
        location.reload();
      }
    });
  }

  switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`view-${tabId}`)?.classList.add('active');
  }

  toggleTelaoMode(enable) {
    sounds.playClick();
    if (enable) {
      document.body.classList.add('telao-mode');
      this.renderTelaoLeaderboard();
    } else {
      document.body.classList.remove('telao-mode');
    }
  }

  handleRegistration() {
    const studentName = document.getElementById('input-student-name').value.trim();
    const whatsapp = document.getElementById('input-whatsapp').value.trim();
    const school = document.getElementById('input-school').value;
    const preferredCourse = document.getElementById('select-course').value;

    if (!studentName || !whatsapp || !school || !preferredCourse) return;

    this.currentStudent.name = studentName;
    this.currentStudent.whatsapp = whatsapp;
    this.currentStudent.school = school;
    this.currentStudent.preferredCourse = preferredCourse;
    this.currentStudent.avatar = '🎓';

    this.saveStudent();
    this.renderBadge();
    this.updateHeaderBadges();

    // Auto navigate to stations
    setTimeout(() => {
      this.switchTab('estacoes');
    }, 400);
  }

  renderBadge() {
    if (!this.currentStudent) return;
    document.getElementById('badge-student-name').textContent = this.currentStudent.name || 'Nome do Aluno';
    document.getElementById('badge-preferred-course').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Curso: ${this.currentStudent.preferredCourse || 'Não informado'}`;
    document.getElementById('badge-school-name').innerHTML = `<i class="fa-solid fa-school"></i> Escola: ${this.currentStudent.school || '--'}`;
    document.getElementById('badge-whatsapp').innerHTML = `<i class="fa-brands fa-whatsapp"></i> WhatsApp: ${this.currentStudent.whatsapp || '--'}`;
    document.getElementById('badge-avatar-display').textContent = this.currentStudent.avatar || '🎓';
    
    // Short clean code
    const shortHash = this.currentStudent.id.substring(this.currentStudent.id.length - 4).toUpperCase();
    document.getElementById('badge-id-code').textContent = `#UNIVC-2026-${shortHash}`;
    
    document.getElementById('badge-user-status').textContent = 'Cadastrado!';
    document.getElementById('badge-user-status').style.background = 'var(--univc-lime)';
    document.getElementById('badge-user-status').style.color = 'var(--univc-emerald-dark)';
  }

  updateHeaderBadges() {
    const done = this.currentStudent.completedStations.length;
    document.getElementById('badge-stations-done').textContent = `${done}/10`;
    document.getElementById('badge-fragments-count').textContent = `${this.currentStudent.unlockedFragments.length}/10`;

    // Calculate user rank
    const sorted = [...this.teams].sort((a, b) => b.score - a.score);
    const rank = sorted.findIndex(t => t.id === this.currentStudent.id) + 1;
    document.getElementById('badge-ranking-pos').textContent = rank > 0 ? `#${rank}` : '#--';
  }

  renderStationsGrid() {
    const container = document.getElementById('grid-stations');
    if (!container) return;
    container.innerHTML = '';

    const filtered = STATIONS.filter(s => {
      if (this.activeAreaFilter === 'ALL') return true;
      return s.area.includes(this.activeAreaFilter);
    });

    filtered.forEach(station => {
      const isCompleted = this.currentStudent.completedStations.includes(station.id);
      const card = document.createElement('div');
      card.className = `station-card ${isCompleted ? 'completed' : ''}`;
      
      card.innerHTML = `
        <div>
          <div class="station-badge-top">
            <span class="station-code">${station.code}</span>
            <span class="station-area">${station.areaBadge}</span>
          </div>
          <h4>${station.title}</h4>
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--univc-emerald-mid); margin-bottom: 0.35rem;">
            <i class="fa-solid fa-location-dot"></i> ${station.location}
          </div>
          <div class="station-courses"><i class="fa-solid fa-graduation-cap"></i> ${station.courses}</div>
        </div>

        <div>
          <div class="station-fragment-box">
            <span>Fragmento de Senha:</span>
            <span class="fragment-word">${isCompleted ? `"${station.fragment}"` : '🔒 Bloqueado'}</span>
          </div>

          <button class="btn-primary btn-open-station" style="width: 100%; font-size: 0.9rem;" data-id="${station.id}">
            ${isCompleted ? '<i class="fa-solid fa-circle-check"></i> Revisar Desafio' : '<i class="fa-solid fa-play"></i> Iniciar Desafio'}
          </button>
        </div>
      `;

      card.querySelector('.btn-open-station').addEventListener('click', () => {
        sounds.playClick();
        this.openStationModal(station.id);
      });

      container.appendChild(card);
    });
  }

  openStationModal(stationId) {
    const station = STATIONS.find(s => s.id === stationId);
    if (!station) return;
    this.selectedStationId = stationId;

    document.getElementById('modal-station-code').textContent = station.code;
    document.getElementById('modal-station-title').textContent = station.title;
    document.getElementById('modal-station-location').textContent = station.location;
    document.getElementById('modal-narrative-text').textContent = `"${station.narrative}"`;
    document.getElementById('modal-challenge-title').textContent = station.challengeTitle;
    document.getElementById('modal-question-text').textContent = station.question;

    const optionsContainer = document.getElementById('modal-options-container');
    optionsContainer.innerHTML = '';

    const feedbackBox = document.getElementById('modal-feedback-box');
    feedbackBox.style.display = 'none';

    const isCompleted = this.currentStudent.completedStations.includes(stationId);

    station.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${opt.letter}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener('click', () => {
        this.handleAnswerSelection(station, opt, btn);
      });

      optionsContainer.appendChild(btn);
    });

    if (isCompleted) {
      feedbackBox.style.display = 'block';
      feedbackBox.style.background = '#f7fee7';
      feedbackBox.style.border = '2px solid var(--univc-lime)';
      feedbackBox.innerHTML = `
        <strong style="color: var(--univc-emerald-dark);"><i class="fa-solid fa-circle-check"></i> Estação Concluída!</strong>
        <p style="margin-top: 0.25rem; font-size: 0.9rem;">Você já liberou o fragmento <strong>"${station.fragment}"</strong>!</p>
      `;
    }

    document.getElementById('modal-challenge').classList.add('active');
  }

  handleAnswerSelection(station, option, buttonElement) {
    const feedbackBox = document.getElementById('modal-feedback-box');
    feedbackBox.style.display = 'block';

    if (option.correct) {
      sounds.playSuccess();
      buttonElement.style.borderColor = 'var(--univc-lime)';
      buttonElement.style.background = '#f7fee7';

      feedbackBox.style.background = 'var(--univc-emerald-dark)';
      feedbackBox.style.color = 'white';
      feedbackBox.innerHTML = `
        <strong style="color: var(--univc-lime-bright); font-size: 1.1rem;"><i class="fa-solid fa-circle-check"></i> Resposta Correta! +100 Pontos!</strong>
        <p style="margin-top: 0.35rem; font-size: 0.95rem;">Você desvendou a falha no local <strong>${station.location}</strong> e desbloqueou o fragmento: <span style="color: var(--univc-lime-bright); font-weight: 900; font-size: 1.2rem;">"${station.fragment}"</span>!</p>
      `;

      // Update student progress
      if (!this.currentStudent.completedStations.includes(station.id)) {
        this.currentStudent.completedStations.push(station.id);
        this.currentStudent.unlockedFragments.push(station.fragment);
        this.currentStudent.score += 100;
        this.saveStudent();
        this.updateHeaderBadges();
        this.renderStationsGrid();
        this.renderSentenceInventory();
      }
    } else {
      sounds.playError();
      buttonElement.style.borderColor = '#ef4444';
      buttonElement.style.background = '#fef2f2';

      feedbackBox.style.background = '#fef2f2';
      feedbackBox.style.color = '#991b1b';
      feedbackBox.innerHTML = `
        <strong><i class="fa-solid fa-circle-xmark"></i> Resposta Incorreta!</strong>
        <p style="margin-top: 0.25rem; font-size: 0.9rem;">Dica do Instrutor: ${station.hint}</p>
      `;
    }
  }

  closeModal() {
    document.getElementById('modal-challenge').classList.remove('active');
  }

  renderSentenceInventory() {
    const container = document.getElementById('container-unlocked-words');
    const label = document.getElementById('label-fragments-progress');
    if (!container) return;

    container.innerHTML = '';
    const unlocked = this.currentStudent.unlockedFragments || [];
    label.textContent = `${unlocked.length} / 10 Desbloqueados`;

    STATIONS.forEach(st => {
      const isUnlocked = unlocked.includes(st.fragment);
      const isUsed = this.assembledWords.includes(st.fragment);

      const chip = document.createElement('div');
      chip.className = `word-chip ${isUsed ? 'used' : ''}`;
      chip.style.opacity = isUnlocked ? (isUsed ? '0.3' : '1') : '0.25';
      chip.style.pointerEvents = isUnlocked && !isUsed ? 'auto' : 'none';
      chip.textContent = isUnlocked ? st.fragment : '???';

      if (isUnlocked && !isUsed) {
        chip.addEventListener('click', () => {
          sounds.playClick();
          this.assembledWords.push(st.fragment);
          this.renderSentenceInventory();
          this.renderSentenceAssembly();
        });
      }

      container.appendChild(chip);
    });
  }

  renderSentenceAssembly() {
    const area = document.getElementById('area-sentence-assembly');
    if (!area) return;

    area.innerHTML = '';

    if (this.assembledWords.length === 0) {
      area.innerHTML = `
        <div id="placeholder-text-assembly" style="color: rgba(255,255,255,0.4); font-weight: 600; width: 100%; text-align: center; padding-top: 2rem;">
          Clique nas palavras acima para adicioná-las na frase...
        </div>
      `;
      return;
    }

    this.assembledWords.forEach((word, index) => {
      const placed = document.createElement('div');
      placed.className = 'placed-word';
      placed.textContent = word;

      placed.addEventListener('click', () => {
        sounds.playClick();
        this.assembledWords.splice(index, 1);
        this.renderSentenceInventory();
        this.renderSentenceAssembly();
      });

      area.appendChild(placed);
    });
  }

  verifySentencePassword() {
    const targetSentence = EVENT_INFO.fullPassword.join(' ');
    const userSentence = this.assembledWords.join(' ');

    if (userSentence === targetSentence) {
      sounds.playFanfare();
      document.getElementById('dome-door-unlocked').classList.add('active');

      if (!this.currentStudent.solvedFinalPuzzle) {
        this.currentStudent.solvedFinalPuzzle = true;
        this.currentStudent.score += 500;
        this.saveStudent();
        this.updateHeaderBadges();
        this.renderLeaderboard();
      }
    } else {
      sounds.playError();
      alert(`Frase incorreta ou incompleta!\nSua montagem: "${userSentence || 'Vazia'}"\nDica: Reúna os 10 fragmentos das 10 estações na ordem das estações 1 a 10.`);
    }
  }

  renderLeaderboard() {
    const podiumContainer = document.getElementById('podium-container');
    const tableBody = document.getElementById('table-ranking-body');
    if (!podiumContainer || !tableBody) return;

    // Filter & Sort
    let sorted = [...this.teams].sort((a, b) => b.score - a.score);

    if (this.activeSchoolFilter !== 'ALL') {
      sorted = sorted.filter(t => t.school === this.activeSchoolFilter);
    }

    if (this.searchQuery) {
      sorted = sorted.filter(t => 
        t.name.toLowerCase().includes(this.searchQuery) || 
        t.school.toLowerCase().includes(this.searchQuery) ||
        (t.preferredCourse && t.preferredCourse.toLowerCase().includes(this.searchQuery))
      );
    }

    // Render Podium
    podiumContainer.innerHTML = '';
    const top3 = sorted.slice(0, 3);
    const podiumPositions = [
      { class: 'first', rank: '1º', badgeIcon: '<i class="fa-solid fa-crown"></i>' },
      { class: 'second', rank: '2º', badgeIcon: '2' },
      { class: 'third', rank: '3º', badgeIcon: '3' }
    ];

    top3.forEach((team, index) => {
      const posInfo = podiumPositions[index] || { class: '', rank: `${index + 1}º`, badgeIcon: `${index + 1}` };
      const card = document.createElement('div');
      card.className = `podium-card ${posInfo.class}`;
      card.innerHTML = `
        <div class="podium-badge">${posInfo.badgeIcon}</div>
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">${team.avatar || '🎓'}</div>
        <div class="podium-team-name">${team.name}</div>
        <div style="font-size: 0.8rem; color: var(--univc-emerald-mid); font-weight: 800; margin-bottom: 0.25rem;">
          <i class="fa-solid fa-graduation-cap"></i> ${team.preferredCourse || 'Geral'}
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem;">${team.school}</div>
        <div class="podium-score">${team.score} PTS</div>
        <small style="color: var(--univc-emerald-mid); font-weight: 800;">${team.completedStations?.length || 0}/10 Estações</small>
      `;
      podiumContainer.appendChild(card);
    });

    // Render Table
    tableBody.innerHTML = '';
    sorted.forEach((team, index) => {
      const isUser = team.id === this.currentStudent.id;
      const tr = document.createElement('tr');
      if (isUser) tr.style.background = '#f7fee7';

      tr.innerHTML = `
        <td><span class="rank-number">${index + 1}º</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.4rem;">${team.avatar || '🎓'}</span>
            <div>
              <strong>${team.name}</strong> ${isUser ? '<span style="background: var(--univc-lime); color: var(--univc-emerald-dark); font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 900; margin-left: 0.4rem;">VOCÊ</span>' : ''}
              <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-graduation-cap"></i> ${team.preferredCourse || 'Não informado'}</div>
            </div>
          </div>
        </td>
        <td>${team.school}</td>
        <td><strong style="color: var(--univc-emerald-dark);">${team.completedStations?.length || 0}/10</strong></td>
        <td>${team.unlockedFragments?.length || 0}</td>
        <td>${team.solvedFinalPuzzle ? '<span style="color: var(--univc-neon-green); font-weight: 800;"><i class="fa-solid fa-circle-check"></i> Desbloqueada (+500)</span>' : '<span style="color: #94a3b8;">Pendente</span>'}</td>
        <td><strong style="font-size: 1.1rem; color: var(--univc-emerald-mid); font-family: var(--font-heading);">${team.score} PTS</strong></td>
      `;

      tableBody.appendChild(tr);
    });
  }

  renderTelaoLeaderboard() {
    const podiumContainer = document.getElementById('telao-podium-container');
    const tableBody = document.getElementById('telao-table-body');
    if (!podiumContainer || !tableBody) return;

    const sorted = [...this.teams].sort((a, b) => b.score - a.score);
    
    // Telão Podium
    podiumContainer.innerHTML = '';
    const top3 = sorted.slice(0, 3);
    top3.forEach((team, index) => {
      const ranks = ['1º LUGAR', '2º LUGAR', '3º LUGAR'];
      const card = document.createElement('div');
      card.className = `telao-podium-card ${index === 0 ? 'first' : ''}`;
      card.innerHTML = `
        <div style="font-size: 0.9rem; font-weight: 900; color: var(--univc-lime-bright); letter-spacing: 0.1em; margin-bottom: 0.5rem;">${ranks[index]}</div>
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${team.avatar || '🎓'}</div>
        <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: white;">${team.name}</h3>
        <p style="color: var(--univc-lime-bright); font-size: 1.05rem; font-weight: 700;"><i class="fa-solid fa-graduation-cap"></i> ${team.preferredCourse || 'Geral'}</p>
        <p style="color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 1rem;">${team.school}</p>
        <div style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 900; color: var(--univc-lime-bright);">${team.score} PTS</div>
      `;
      podiumContainer.appendChild(card);
    });

    // Telão Table
    tableBody.innerHTML = '';
    sorted.slice(3, 10).forEach((team, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 900; color: var(--univc-lime-bright);">${index + 4}º</td>
        <td>
          <strong>${team.avatar || '🎓'} ${team.name}</strong>
          <div style="font-size: 0.85rem; color: var(--univc-lime-bright); opacity: 0.9;"><i class="fa-solid fa-graduation-cap"></i> ${team.preferredCourse || ''}</div>
        </td>
        <td style="opacity: 0.85;">${team.school}</td>
        <td style="text-align: center; font-weight: bold; color: var(--univc-lime);">${team.completedStations?.length || 0} / 10</td>
        <td style="text-align: right; font-weight: 900; font-family: var(--font-heading); font-size: 1.4rem; color: var(--univc-lime-bright);">${team.score} PTS</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  simulateLiveUpdates() {
    this.teams.forEach(t => {
      if (t.id !== this.currentStudent.id) {
        if (Math.random() > 0.4 && t.completedStations.length < 10) {
          t.completedStations.push(t.completedStations.length + 1);
          t.score += 100;
        }
      }
    });
    this.saveTeams();
    this.renderLeaderboard();
    this.renderTelaoLeaderboard();
    this.updateHeaderBadges();
  }

  render() {
    this.renderBadge();
    this.updateHeaderBadges();
    this.renderStationsGrid();
    this.renderSentenceInventory();
    this.renderSentenceAssembly();
    this.renderLeaderboard();
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.univcApp = new App();
});
