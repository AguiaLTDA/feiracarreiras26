// Main Application Controller - Seahaven UNIVC Feira de Carreiras 2026 (Com Cadastro Individual & Grupo de Alunos)

import { EVENT_INFO, STATIONS, INITIAL_TEAMS } from './data.js';
import { sounds } from './audio.js';
import { syncTeamToSupabase, fetchTeamsFromSupabase, deleteTeamFromSupabase, clearAllTeamsFromSupabase, subscribeToRealtimeLeaderboard } from './supabase.js';

const ADMIN_PASSWORD = 'admin2026';

class App {
  constructor() {
    this.currentStudent = null;
    this.teams = [];
    this.selectedStationId = null;
    this.assembledWords = [];
    this.activeAreaFilter = 'ALL';
    this.activeSchoolFilter = 'ALL';
    this.searchQuery = '';
    this.adminSearchQuery = '';
    this.isAdminAuthenticated = false;
    
    this.init();
  }

  async init() {
    this.loadState();
    this.bindEvents();
    this.render();

    // Check hash URL
    if (window.location.hash === '#admin') {
      this.switchTab('admin');
    }

    // Tenta carregar dados em nuvem do Supabase
    const cloudTeams = await fetchTeamsFromSupabase();
    if (cloudTeams) {
      this.teams = cloudTeams;
      this.saveTeams();
      this.renderLeaderboard();
      this.renderTelaoLeaderboard();
      if (this.isAdminAuthenticated) this.renderAdminDashboard();
    }

    // Ativa escuta em tempo real do Supabase
    subscribeToRealtimeLeaderboard((realtimeTeams) => {
      console.log("⚡ Leaderboard atualizado em tempo real via Supabase!");
      this.teams = realtimeTeams;
      this.saveTeams();
      this.renderLeaderboard();
      this.renderTelaoLeaderboard();
      this.updateHeaderBadges();
      if (this.isAdminAuthenticated) this.renderAdminDashboard();
    });
  }

  loadState() {
    const savedStudent = localStorage.getItem('univc_current_student');
    if (savedStudent) {
      this.currentStudent = JSON.parse(savedStudent);
    } else {
      this.currentStudent = {
        id: 'student-user-' + Date.now(),
        registrationType: 'individual',
        name: '',
        groupName: '',
        leaderName: '',
        groupSize: 1,
        whatsapp: '',
        school: '',
        preferredCourse: '',
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

    if (sessionStorage.getItem('univc_admin_authed') === 'true') {
      this.isAdminAuthenticated = true;
    }
  }

  isUserRegistered() {
    return Boolean(this.currentStudent && this.currentStudent.name && this.currentStudent.name.trim() !== '' && this.currentStudent.school);
  }

  saveStudent() {
    if (!this.currentStudent.name) return;
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
    if (!this.currentStudent.name) return;
    const idx = this.teams.findIndex(t => t.id === this.currentStudent.id);
    if (idx >= 0) {
      this.teams[idx] = { ...this.currentStudent };
    } else {
      this.teams.push({ ...this.currentStudent });
    }
    this.saveTeams();
  }

  bindEvents() {
    // Hash change
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#admin') {
        this.switchTab('admin');
      }
    });

    // Registration Type Selector (Individual vs Group)
    const btnInd = document.getElementById('btn-type-individual');
    const btnGrp = document.getElementById('btn-type-group');
    const groupFields = document.getElementById('group-fields-container');
    const regTypeInput = document.getElementById('input-reg-type');
    const labelName = document.getElementById('label-student-name');
    const labelWa = document.getElementById('label-whatsapp');

    if (btnInd && btnGrp) {
      btnInd.addEventListener('click', () => {
        sounds.playClick();
        btnInd.classList.add('active');
        btnInd.style.background = 'var(--univc-emerald-dark)';
        btnInd.style.color = 'white';
        btnInd.style.borderColor = 'var(--univc-emerald-mid)';

        btnGrp.classList.remove('active');
        btnGrp.style.background = '#f8fafc';
        btnGrp.style.color = 'var(--text-dark)';
        btnGrp.style.borderColor = 'var(--border-light)';

        if (groupFields) groupFields.style.display = 'none';
        if (regTypeInput) regTypeInput.value = 'individual';
        if (labelName) labelName.textContent = 'Seu Nome Completo:';
        if (labelWa) labelWa.innerHTML = '<i class="fa-brands fa-whatsapp" style="color: #22c55e;"></i> WhatsApp / Celular:';
      });

      btnGrp.addEventListener('click', () => {
        sounds.playClick();
        btnGrp.classList.add('active');
        btnGrp.style.background = 'var(--univc-emerald-dark)';
        btnGrp.style.color = 'white';
        btnGrp.style.borderColor = 'var(--univc-emerald-mid)';

        btnInd.classList.remove('active');
        btnInd.style.background = '#f8fafc';
        btnInd.style.color = 'var(--text-dark)';
        btnInd.style.borderColor = 'var(--border-light)';

        if (groupFields) groupFields.style.display = 'block';
        if (regTypeInput) regTypeInput.value = 'group';
        if (labelName) labelName.textContent = 'Nome do Líder (Responsável pelo Grupo):';
        if (labelWa) labelWa.innerHTML = '<i class="fa-brands fa-whatsapp" style="color: #22c55e;"></i> WhatsApp / Celular do Líder:';
      });
    }

    // Redirect to Registration Buttons
    document.querySelectorAll('.btn-go-cadastro').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        this.switchTab('cadastro');
      });
    });

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

    // Admin Auth Form
    document.getElementById('form-admin-login')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd = (document.getElementById('input-admin-password')?.value || '').trim();
      if (pwd === ADMIN_PASSWORD) {
        sounds.playSuccess();
        this.isAdminAuthenticated = true;
        sessionStorage.setItem('univc_admin_authed', 'true');
        this.renderAdminView();
      } else {
        sounds.playError();
        alert('Senha de Administrador incorreta! (Dica: admin2026)');
      }
    });

    // Admin Logout
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
      sounds.playClick();
      this.isAdminAuthenticated = false;
      sessionStorage.removeItem('univc_admin_authed');
      const inputPwd = document.getElementById('input-admin-password');
      if (inputPwd) inputPwd.value = '';
      this.renderAdminView();
    });

    // Admin Search
    document.getElementById('search-admin')?.addEventListener('input', (e) => {
      this.adminSearchQuery = e.target.value.toLowerCase();
      this.renderAdminDashboard();
    });

    // Admin Export CSV
    document.getElementById('btn-admin-export-csv')?.addEventListener('click', () => {
      sounds.playSuccess();
      this.exportAdminCSV();
    });

    // Admin Clear DB (Pré-Evento)
    document.getElementById('btn-admin-clear-db')?.addEventListener('click', async () => {
      if (confirm('ATENÇÃO ORGANIZAÇÃO: Deseja zerar completamente a base de dados do evento? Isso apagar todos os testes antes da abertura dos portões.')) {
        if (confirm('CONFIRMAÇÃO FINAL: Apagar todos os dados do banco?')) {
          sounds.playSuccess();
          this.teams = [];
          this.saveTeams();
          await clearAllTeamsFromSupabase();
          this.renderLeaderboard();
          this.renderTelaoLeaderboard();
          this.renderAdminDashboard();
          alert('Base de dados zerada com sucesso para a abertura oficial!');
        }
      }
    });

    // Admin Edit Modal Controls
    document.getElementById('btn-close-admin-edit')?.addEventListener('click', () => this.closeAdminEditModal());
    document.getElementById('btn-cancel-admin-edit')?.addEventListener('click', () => this.closeAdminEditModal());
    
    document.getElementById('form-admin-edit-student')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAdminSaveEdit();
    });

    // Admin Edit Modal Registration Type switch
    document.getElementById('edit-registration-type')?.addEventListener('change', (e) => {
      const type = e.target.value;
      const groupBox = document.getElementById('edit-group-name-box');
      const sizeBox = document.getElementById('edit-group-size-box');
      const labelStudent = document.getElementById('edit-label-student-name');

      if (type === 'group') {
        if (groupBox) groupBox.style.display = 'block';
        if (sizeBox) sizeBox.style.display = 'block';
        if (labelStudent) labelStudent.textContent = 'Nome do Líder (Responsável):';
      } else {
        if (groupBox) groupBox.style.display = 'none';
        if (sizeBox) sizeBox.style.display = 'none';
        if (labelStudent) labelStudent.textContent = 'Nome do Aluno:';
      }
    });
  }

  switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`view-${tabId}`)?.classList.add('active');

    // Handle Lock state for Estações and Senha
    const isRegistered = this.isUserRegistered();

    if (tabId === 'estacoes') {
      const lockOverlay = document.getElementById('lock-overlay-estacoes');
      const content = document.getElementById('content-estacoes-container');
      if (!isRegistered) {
        if (lockOverlay) lockOverlay.style.display = 'block';
        if (content) content.style.display = 'none';
      } else {
        if (lockOverlay) lockOverlay.style.display = 'none';
        if (content) content.style.display = 'block';
      }
    }

    if (tabId === 'senha') {
      const lockOverlay = document.getElementById('lock-overlay-senha');
      const content = document.getElementById('content-senha-container');
      if (!isRegistered) {
        if (lockOverlay) lockOverlay.style.display = 'block';
        if (content) content.style.display = 'none';
      } else {
        if (lockOverlay) lockOverlay.style.display = 'none';
        if (content) content.style.display = 'block';
      }
    }

    if (tabId === 'admin') {
      this.renderAdminView();
    }
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
    const regType = document.getElementById('input-reg-type').value || 'individual';
    const studentName = document.getElementById('input-student-name').value.trim();
    const whatsapp = document.getElementById('input-whatsapp').value.trim();
    const school = document.getElementById('input-school').value;
    const preferredCourse = document.getElementById('select-course').value;

    if (!studentName || !whatsapp || !school || !preferredCourse) return;

    if (regType === 'group') {
      const groupName = document.getElementById('input-group-name').value.trim() || `Grupo de ${studentName}`;
      const groupSize = parseInt(document.getElementById('input-group-size').value, 10) || 5;

      this.currentStudent.registrationType = 'group';
      this.currentStudent.name = groupName;
      this.currentStudent.groupName = groupName;
      this.currentStudent.leaderName = studentName;
      this.currentStudent.groupSize = groupSize;
      this.currentStudent.avatar = '👥';
    } else {
      this.currentStudent.registrationType = 'individual';
      this.currentStudent.name = studentName;
      this.currentStudent.groupName = '';
      this.currentStudent.leaderName = studentName;
      this.currentStudent.groupSize = 1;
      this.currentStudent.avatar = '🎓';
    }

    this.currentStudent.whatsapp = whatsapp;
    this.currentStudent.school = school;
    this.currentStudent.preferredCourse = preferredCourse;

    this.saveStudent();
    this.renderBadge();
    this.updateHeaderBadges();

    // Auto navigate to stations
    setTimeout(() => {
      this.switchTab('estacoes');
    }, 300);
  }

  renderBadge() {
    if (!this.currentStudent || !this.currentStudent.name) return;

    const isGroup = this.currentStudent.registrationType === 'group';

    document.getElementById('badge-type-tag').textContent = isGroup ? `LÍDER DA EQUIPE (${this.currentStudent.groupSize || 5} ALUNOS)` : 'PROTAGONISTA';

    if (isGroup) {
      document.getElementById('badge-student-name').textContent = this.currentStudent.groupName || this.currentStudent.name;
      document.getElementById('badge-preferred-course').innerHTML = `<i class="fa-solid fa-user-shield"></i> Líder: ${this.currentStudent.leaderName} (${this.currentStudent.groupSize} membros)<br><i class="fa-solid fa-graduation-cap"></i> Curso: ${this.currentStudent.preferredCourse || 'Não informado'}`;
      document.getElementById('badge-avatar-display').textContent = '👥';
    } else {
      document.getElementById('badge-student-name').textContent = this.currentStudent.name || 'Nome do Aluno';
      document.getElementById('badge-preferred-course').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Curso: ${this.currentStudent.preferredCourse || 'Não informado'}`;
      document.getElementById('badge-avatar-display').textContent = '🎓';
    }

    document.getElementById('badge-school-name').innerHTML = `<i class="fa-solid fa-school"></i> Escola: ${this.currentStudent.school || '--'}`;
    document.getElementById('badge-whatsapp').innerHTML = `<i class="fa-brands fa-whatsapp"></i> WhatsApp: ${this.currentStudent.whatsapp || '--'}`;
    
    // Short clean code
    const shortHash = this.currentStudent.id.substring(this.currentStudent.id.length - 4).toUpperCase();
    document.getElementById('badge-id-code').textContent = `#UNIVC-2026-${shortHash}`;
  }

  updateHeaderBadges() {
    const isRegistered = this.isUserRegistered();

    // Tab 1 status badge
    const badgeUserStatus = document.getElementById('badge-user-status');
    if (badgeUserStatus) {
      if (isRegistered) {
        badgeUserStatus.textContent = '✓ Cadastrado!';
        badgeUserStatus.style.background = 'var(--univc-lime)';
        badgeUserStatus.style.color = 'var(--univc-emerald-dark)';
      } else {
        badgeUserStatus.textContent = 'Pendente';
        badgeUserStatus.style.background = '#fef08a';
        badgeUserStatus.style.color = '#854d0e';
      }
    }

    // Tab 2 status badge
    const badgeStationsDone = document.getElementById('badge-stations-done');
    if (badgeStationsDone) {
      if (isRegistered) {
        const done = this.currentStudent.completedStations ? this.currentStudent.completedStations.length : 0;
        badgeStationsDone.textContent = `${done}/10`;
        badgeStationsDone.style.background = 'var(--univc-emerald-dark)';
        badgeStationsDone.style.color = 'white';
      } else {
        badgeStationsDone.textContent = '🔒 Bloqueado';
        badgeStationsDone.style.background = '#fee2e2';
        badgeStationsDone.style.color = '#991b1b';
      }
    }

    // Tab 3 status badge
    const badgeFragmentsCount = document.getElementById('badge-fragments-count');
    if (badgeFragmentsCount) {
      if (isRegistered) {
        badgeFragmentsCount.textContent = `${this.currentStudent.unlockedFragments ? this.currentStudent.unlockedFragments.length : 0}/10`;
        badgeFragmentsCount.style.background = 'var(--univc-emerald-dark)';
        badgeFragmentsCount.style.color = 'white';
      } else {
        badgeFragmentsCount.textContent = '🔒 Bloqueado';
        badgeFragmentsCount.style.background = '#fee2e2';
        badgeFragmentsCount.style.color = '#991b1b';
      }
    }

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

    const completedList = this.currentStudent.completedStations || [];

    filtered.forEach(station => {
      const isCompleted = completedList.includes(station.id);
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

    const completedList = this.currentStudent.completedStations || [];
    const isCompleted = completedList.includes(stationId);

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

      if (!this.currentStudent.completedStations) this.currentStudent.completedStations = [];
      if (!this.currentStudent.unlockedFragments) this.currentStudent.unlockedFragments = [];

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
        (t.name && t.name.toLowerCase().includes(this.searchQuery)) || 
        (t.groupName && t.groupName.toLowerCase().includes(this.searchQuery)) || 
        (t.leaderName && t.leaderName.toLowerCase().includes(this.searchQuery)) || 
        (t.school && t.school.toLowerCase().includes(this.searchQuery)) ||
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
      const isGroup = team.registrationType === 'group';
      const displayName = isGroup ? (team.groupName || team.name) : (team.name || 'Aluno');
      const subInfo = isGroup ? `Líder: ${team.leaderName} (${team.groupSize} membros)` : team.preferredCourse;

      const card = document.createElement('div');
      card.className = `podium-card ${posInfo.class}`;
      card.innerHTML = `
        <div class="podium-badge">${posInfo.badgeIcon}</div>
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">${isGroup ? '👥' : (team.avatar || '🎓')}</div>
        <div class="podium-team-name">${displayName}</div>
        <div style="font-size: 0.8rem; color: var(--univc-emerald-mid); font-weight: 800; margin-bottom: 0.25rem;">
          <i class="fa-solid fa-graduation-cap"></i> ${subInfo || 'Geral'}
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem;">${team.school || '--'}</div>
        <div class="podium-score">${team.score} PTS</div>
        <small style="color: var(--univc-emerald-mid); font-weight: 800;">${team.completedStations?.length || 0}/10 Estações</small>
      `;
      podiumContainer.appendChild(card);
    });

    // Render Table
    tableBody.innerHTML = '';

    if (sorted.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            Nenhum aluno ou grupo cadastrado ainda. Seja o primeiro a se registrar!
          </td>
        </tr>
      `;
      return;
    }

    sorted.forEach((team, index) => {
      const isUser = team.id === this.currentStudent.id;
      const isGroup = team.registrationType === 'group';
      const displayName = isGroup ? (team.groupName || team.name) : (team.name || 'Aluno');
      const leaderSub = isGroup ? `Líder: ${team.leaderName} • ${team.groupSize} Integrantes • ${team.preferredCourse}` : team.preferredCourse;

      const tr = document.createElement('tr');
      if (isUser) tr.style.background = '#f7fee7';

      tr.innerHTML = `
        <td><span class="rank-number">${index + 1}º</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.4rem;">${isGroup ? '👥' : (team.avatar || '🎓')}</span>
            <div>
              <strong>${displayName}</strong> ${isGroup ? '<span style="background: var(--univc-emerald-dark); color: white; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 800; margin-left: 0.3rem;">GRUPO</span>' : ''} ${isUser ? '<span style="background: var(--univc-lime); color: var(--univc-emerald-dark); font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 900; margin-left: 0.4rem;">VOCÊ</span>' : ''}
              <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-user-shield"></i> ${leaderSub || 'Não informado'}</div>
            </div>
          </div>
        </td>
        <td>${team.school || '--'}</td>
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
      const isGroup = team.registrationType === 'group';
      const displayName = isGroup ? (team.groupName || team.name) : (team.name || 'Aluno');
      const subInfo = isGroup ? `Líder: ${team.leaderName} (${team.groupSize} Alunos)` : team.preferredCourse;

      const card = document.createElement('div');
      card.className = `telao-podium-card ${index === 0 ? 'first' : ''}`;
      card.innerHTML = `
        <div style="font-size: 0.9rem; font-weight: 900; color: var(--univc-lime-bright); letter-spacing: 0.1em; margin-bottom: 0.5rem;">${ranks[index]}</div>
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${isGroup ? '👥' : (team.avatar || '🎓')}</div>
        <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: white;">${displayName}</h3>
        <p style="color: var(--univc-lime-bright); font-size: 1.05rem; font-weight: 700;"><i class="fa-solid fa-graduation-cap"></i> ${subInfo || 'Geral'}</p>
        <p style="color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 1rem;">${team.school || '--'}</p>
        <div style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 900; color: var(--univc-lime-bright);">${team.score} PTS</div>
      `;
      podiumContainer.appendChild(card);
    });

    // Telão Table
    tableBody.innerHTML = '';
    sorted.slice(3, 15).forEach((team, index) => {
      const isGroup = team.registrationType === 'group';
      const displayName = isGroup ? (team.groupName || team.name) : (team.name || 'Aluno');
      const subInfo = isGroup ? `Líder: ${team.leaderName} • ${team.groupSize} Integrantes` : (team.preferredCourse || '');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 900; color: var(--univc-lime-bright);">${index + 4}º</td>
        <td>
          <strong>${isGroup ? '👥' : (team.avatar || '🎓')} ${displayName}</strong>
          <div style="font-size: 0.85rem; color: var(--univc-lime-bright); opacity: 0.9;"><i class="fa-solid fa-graduation-cap"></i> ${subInfo}</div>
        </td>
        <td style="opacity: 0.85;">${team.school || '--'}</td>
        <td style="text-align: center; font-weight: bold; color: var(--univc-lime);">${team.completedStations?.length || 0} / 10</td>
        <td style="text-align: right; font-weight: 900; font-family: var(--font-heading); font-size: 1.4rem; color: var(--univc-lime-bright);">${team.score} PTS</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  /* Admin Section Logic */
  renderAdminView() {
    const authBox = document.getElementById('admin-auth-box');
    const dashBox = document.getElementById('admin-dashboard-box');

    // Make sure section view-admin is active
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('view-admin')?.classList.add('active');

    if (this.isAdminAuthenticated) {
      if (authBox) authBox.style.display = 'none';
      if (dashBox) dashBox.style.display = 'block';
      this.renderAdminDashboard();
    } else {
      if (authBox) authBox.style.display = 'block';
      if (dashBox) dashBox.style.display = 'none';
    }
  }

  renderAdminDashboard() {
    const tableBody = document.getElementById('table-admin-body');
    if (!tableBody) return;

    // Stats
    const totalRegistrations = this.teams.length;
    const totalPeopleEstimated = this.teams.reduce((acc, t) => acc + (parseInt(t.groupSize, 10) || 1), 0);
    const uniqueSchools = new Set(this.teams.map(t => t.school).filter(Boolean)).size;
    const completedPasswords = this.teams.filter(t => t.solvedFinalPuzzle).length;

    document.getElementById('stat-total-students').textContent = totalRegistrations;
    document.getElementById('stat-total-people').textContent = totalPeopleEstimated;
    document.getElementById('stat-total-schools').textContent = uniqueSchools;
    document.getElementById('stat-completed-passwords').textContent = completedPasswords;

    // Filter & Sort
    let sorted = [...this.teams].sort((a, b) => b.score - a.score);

    if (this.adminSearchQuery) {
      sorted = sorted.filter(t => 
        (t.name && t.name.toLowerCase().includes(this.adminSearchQuery)) ||
        (t.groupName && t.groupName.toLowerCase().includes(this.adminSearchQuery)) ||
        (t.leaderName && t.leaderName.toLowerCase().includes(this.adminSearchQuery)) ||
        (t.whatsapp && t.whatsapp.toLowerCase().includes(this.adminSearchQuery)) ||
        (t.school && t.school.toLowerCase().includes(this.adminSearchQuery)) ||
        (t.preferredCourse && t.preferredCourse.toLowerCase().includes(this.adminSearchQuery))
      );
    }

    tableBody.innerHTML = '';

    if (sorted.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            Nenhum registro cadastrado no momento. Os cadastros realizados aparecerão aqui em tempo real.
          </td>
        </tr>
      `;
      return;
    }

    sorted.forEach((team, index) => {
      const isGroup = team.registrationType === 'group';
      const displayName = isGroup ? (team.groupName || team.name) : (team.name || 'Aluno');
      const leaderName = isGroup ? team.leaderName : team.name;
      const groupSize = isGroup ? (team.groupSize || 1) : 1;

      const tr = document.createElement('tr');
      const cleanDigits = (team.whatsapp || '').replace(/\D/g, '');
      const waLink = cleanDigits ? `https://wa.me/55${cleanDigits}` : '#';

      tr.innerHTML = `
        <td>
          <span style="font-weight: 800; font-size: 0.8rem; padding: 0.2rem 0.5rem; border-radius: 4px; ${isGroup ? 'background: var(--univc-emerald-dark); color: white;' : 'background: #e2e8f0; color: var(--text-dark);'}">
            ${isGroup ? '👥 GRUPO' : '👤 INDIVIDUAL'}
          </span>
        </td>
        <td><strong>${displayName}</strong></td>
        <td>${leaderName}</td>
        <td><strong style="color: var(--univc-emerald-dark);">${groupSize} pessoa(s)</strong></td>
        <td>
          ${cleanDigits ? `<a href="${waLink}" target="_blank" style="color: #16a34a; font-weight: bold; text-decoration: none;"><i class="fa-brands fa-whatsapp"></i> ${team.whatsapp}</a>` : '<span style="color: #94a3b8;">--</span>'}
        </td>
        <td>${team.school || '--'}</td>
        <td><strong style="color: var(--univc-emerald-dark);">${team.preferredCourse || 'Não informado'}</strong></td>
        <td><strong style="color: var(--univc-emerald-mid); font-size: 1.05rem;">${team.score} PTS</strong></td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 0.5rem; justify-content: center;">
            <button class="btn-secondary btn-edit-student" data-id="${team.id}" style="padding: 0.4rem 0.7rem; font-size: 0.8rem;" title="Editar Registro">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-secondary btn-delete-student" data-id="${team.id}" style="padding: 0.4rem 0.7rem; font-size: 0.8rem; color: #ef4444;" title="Excluir Registro">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-edit-student')?.addEventListener('click', () => {
        this.openAdminEditModal(team);
      });

      tr.querySelector('.btn-delete-student')?.addEventListener('click', () => {
        this.handleAdminDeleteStudent(team);
      });

      tableBody.appendChild(tr);
    });
  }

  openAdminEditModal(team) {
    document.getElementById('edit-student-id').value = team.id;
    document.getElementById('edit-registration-type').value = team.registrationType || 'individual';
    document.getElementById('edit-group-name').value = team.groupName || '';
    document.getElementById('edit-student-name').value = team.leaderName || team.name || '';
    document.getElementById('edit-group-size').value = team.groupSize || 1;
    document.getElementById('edit-student-whatsapp').value = team.whatsapp || '';
    document.getElementById('edit-student-school').value = team.school || '';
    document.getElementById('edit-student-course').value = team.preferredCourse || '';
    document.getElementById('edit-student-score').value = team.score || 0;

    // Trigger change event to set fields visibility
    document.getElementById('edit-registration-type').dispatchEvent(new Event('change'));

    document.getElementById('modal-admin-edit').classList.add('active');
  }

  closeAdminEditModal() {
    document.getElementById('modal-admin-edit').classList.remove('active');
  }

  handleAdminSaveEdit() {
    const id = document.getElementById('edit-student-id').value;
    const idx = this.teams.findIndex(t => t.id === id);

    if (idx >= 0) {
      const regType = document.getElementById('edit-registration-type').value;
      const leaderName = document.getElementById('edit-student-name').value.trim();
      const groupName = document.getElementById('edit-group-name').value.trim();
      const groupSize = parseInt(document.getElementById('edit-group-size').value, 10) || 1;

      this.teams[idx].registrationType = regType;
      this.teams[idx].leaderName = leaderName;
      this.teams[idx].groupName = groupName;
      this.teams[idx].groupSize = groupSize;
      this.teams[idx].name = regType === 'group' ? (groupName || `Grupo de ${leaderName}`) : leaderName;
      this.teams[idx].avatar = regType === 'group' ? '👥' : '🎓';

      this.teams[idx].whatsapp = document.getElementById('edit-student-whatsapp').value.trim();
      this.teams[idx].school = document.getElementById('edit-student-school').value.trim();
      this.teams[idx].preferredCourse = document.getElementById('edit-student-course').value.trim();
      this.teams[idx].score = parseInt(document.getElementById('edit-student-score').value, 10) || 0;

      this.saveTeams();
      syncTeamToSupabase(this.teams[idx]);

      if (this.currentStudent.id === id) {
        this.currentStudent = { ...this.teams[idx] };
        localStorage.setItem('univc_current_student', JSON.stringify(this.currentStudent));
        this.renderBadge();
      }

      this.closeAdminEditModal();
      this.renderLeaderboard();
      this.renderTelaoLeaderboard();
      this.renderAdminDashboard();
      sounds.playSuccess();
    }
  }

  async handleAdminDeleteStudent(student) {
    if (confirm(`Deseja excluir permanentemente o registro de "${student.name}"?`)) {
      sounds.playClick();
      this.teams = this.teams.filter(t => t.id !== student.id);
      this.saveTeams();
      await deleteTeamFromSupabase(student.id);

      this.renderLeaderboard();
      this.renderTelaoLeaderboard();
      this.renderAdminDashboard();
    }
  }

  exportAdminCSV() {
    if (this.teams.length === 0) {
      alert('Não há dados de alunos para exportar.');
      return;
    }

    const headers = ["Posicao", "Tipo_Cadastro", "Nome_Participante_Ou_Grupo", "Lider_Responsavel", "Qtd_Alunos_Grupo", "WhatsApp_Lider", "Escola_Origem", "Curso_Pretendido", "Estacoes_Concluidas", "Senha_Final", "Pontuacao", "Ultima_Atualizacao"];
    const sorted = [...this.teams].sort((a, b) => b.score - a.score);

    const rows = sorted.map((t, idx) => [
      idx + 1,
      `"${t.registrationType === 'group' ? 'GRUPO' : 'INDIVIDUAL'}"`,
      `"${((t.registrationType === 'group' ? t.groupName : t.name) || '').replace(/"/g, '""')}"`,
      `"${((t.registrationType === 'group' ? t.leaderName : t.name) || '').replace(/"/g, '""')}"`,
      t.registrationType === 'group' ? (t.groupSize || 1) : 1,
      `"${(t.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(t.school || '').replace(/"/g, '""')}"`,
      `"${(t.preferredCourse || '').replace(/"/g, '""')}"`,
      t.completedStations ? t.completedStations.length : 0,
      t.solvedFinalPuzzle ? "SIM" : "NAO",
      t.score || 0,
      `"${t.lastUpdate || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_alunos_univc_2026_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
