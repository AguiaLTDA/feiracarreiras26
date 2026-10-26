// Supabase Configuration & Realtime Sync Module for Seahaven UNIVC

export const SUPABASE_URL = "https://iravhdeivbhfxupfzcqs.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYXZoZGVpdmJoZnh1cGZ6Y3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NzA0MzIsImV4cCI6MjEwODU0NjQzMn0.3MYuBOT-5r6ACviHpq5ZAN6yDfNJm3lAnHhrh4s1vUY";

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("SUA_SUPABASE_URL")) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("⚡ Supabase Conectado com Sucesso!");
  } catch (err) {
    console.warn("Aviso ao conectar no Supabase:", err);
  }
} else {
  console.log("ℹ️ Supabase não configurado. Utilizando modo LocalStorage com suporte a fallback.");
}

export const supabase = supabaseClient;

/**
 * Salva ou atualiza o aluno/grupo no Supabase em tempo real
 */
export async function syncTeamToSupabase(student) {
  if (!supabase) return null;

  const fullPayload = {
    id: student.id,
    name: student.name,
    student_name: student.name,
    registration_type: student.registrationType || 'individual',
    group_name: student.groupName || '',
    leader_name: student.leaderName || student.name,
    group_size: student.groupSize || 1,
    whatsapp: student.whatsapp || '',
    preferred_course: student.preferredCourse || '',
    school: student.school,
    avatar: student.avatar || (student.registrationType === 'group' ? '👥' : '🎓'),
    completed_stations: student.completedStations || [],
    score: student.score || 0,
    time_spent: student.timeSpent || '0m',
    last_update: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('teams')
      .upsert(fullPayload, { onConflict: 'id' });

    if (error) {
      console.warn("⚠️ Tentando fallback de sincronização segura no Supabase...", error.message);
      
      const displayName = student.registrationType === 'group'
        ? `${student.groupName || student.name} (Líder: ${student.leaderName || student.name})`
        : student.name;

      const basicPayload = {
        id: student.id,
        name: displayName,
        student_name: student.leaderName || student.name,
        whatsapp: student.whatsapp || '',
        preferred_course: student.preferredCourse || '',
        school: student.school,
        avatar: student.avatar || (student.registrationType === 'group' ? '👥' : '🎓'),
        completed_stations: student.completedStations || [],
        score: student.score || 0,
        time_spent: student.timeSpent || '0m',
        last_update: new Date().toISOString()
      };

      const { data: fallbackData, error: fallbackError } = await supabase
        .from('teams')
        .upsert(basicPayload, { onConflict: 'id' });

      if (fallbackError) {
        console.error("❌ Erro ao sincronizar no Supabase:", fallbackError);
      } else {
        console.log("✅ Aluno/Grupo sincronizado no Supabase (Modo de Compatibilidade)!");
      }
      return fallbackData;
    } else {
      console.log("✅ Aluno/Grupo sincronizado no Supabase!");
      return data;
    }
  } catch (e) {
    console.error("Erro de rede Supabase:", e);
  }
}

/**
 * Busca todos os alunos/grupos do Supabase
 */
export async function fetchTeamsFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('score', { ascending: false });

    if (error) {
      console.error("Erro ao buscar alunos no Supabase:", error);
      return null;
    }

    // Mapear campos do banco para o formato da app
    return data.map(row => ({
      id: row.id,
      name: row.name,
      studentName: row.student_name || row.name,
      registrationType: row.registration_type || 'individual',
      groupName: row.group_name || '',
      leaderName: row.leader_name || row.student_name || row.name,
      groupSize: row.group_size || 1,
      whatsapp: row.whatsapp || '',
      preferredCourse: row.preferred_course || '',
      school: row.school,
      avatar: row.avatar || (row.registration_type === 'group' ? '👥' : '🎓'),
      completedStations: row.completed_stations || [],
      score: row.score,
      timeSpent: row.time_spent,
      lastUpdate: new Date(row.last_update).toLocaleTimeString()
    }));
  } catch (e) {
    console.error("Erro de busca Supabase:", e);
    return null;
  }
}

/**
 * Exclui um aluno/grupo do Supabase por ID
 */
export async function deleteTeamFromSupabase(id) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erro ao excluir aluno do Supabase:", error);
    } else {
      console.log("🗑️ Aluno/Grupo excluído do Supabase:", id);
    }
    return data;
  } catch (e) {
    console.error("Erro de exclusão Supabase:", e);
  }
}

/**
 * Limpa todos os registros de teste no Supabase
 */
export async function clearAllTeamsFromSupabase() {
  if (!supabase) return false;

  try {
    // Buscar todos os IDs existentes
    const { data: currentRows } = await supabase.from('teams').select('id');
    if (!currentRows || currentRows.length === 0) return true;

    const ids = currentRows.map(r => r.id);
    const { data, error } = await supabase
      .from('teams')
      .delete()
      .in('id', ids);

    if (error) {
      console.error("Erro ao zerar tabela no Supabase:", error);
      return false;
    }

    console.log("🧹 Tentativa de limpeza executada no Supabase.");
    return true;
  } catch (e) {
    console.error("Erro de reset Supabase:", e);
    return false;
  }
}

/**
 * Lê a rodada vigente (alterada a cada "Salvar Base e Reiniciar Contagem")
 */
export async function fetchCurrentRound() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'current_round')
      .maybeSingle();

    if (error || !data) return null;
    return data.value;
  } catch (e) {
    return null;
  }
}

/**
 * Define uma nova rodada vigente
 */
export async function setCurrentRound(roundId) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: 'current_round', value: roundId }, { onConflict: 'key' });

    if (error) {
      console.error("Erro ao definir rodada no Supabase:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Erro de rede Supabase:", e);
    return false;
  }
}

/**
 * Arquiva os participantes ranqueados de uma rodada na tabela teams_archive
 */
export async function archiveTeamsToSupabase(roundId, archivedAt, rankedTeams) {
  if (!supabase) return null;

  const rows = rankedTeams.map((team, idx) => ({
    round_id: roundId,
    archived_at: archivedAt,
    final_rank: idx + 1,
    team_id: team.id,
    data: team
  }));

  try {
    const { error } = await supabase.from('teams_archive').insert(rows);
    if (error) {
      console.error("Erro ao arquivar rodada no Supabase:", error);
      return false;
    }
    console.log(`📦 Rodada arquivada no Supabase (${rows.length} registros).`);
    return true;
  } catch (e) {
    console.error("Erro de rede Supabase:", e);
    return false;
  }
}

/**
 * Busca todas as rodadas arquivadas
 */
export async function fetchArchivesFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('teams_archive')
      .select('round_id, archived_at, final_rank, team_id, data')
      .order('archived_at', { ascending: false })
      .order('final_rank', { ascending: true });

    if (error) {
      console.error("Erro ao buscar bases salvas no Supabase:", error);
      return null;
    }
    return data;
  } catch (e) {
    console.error("Erro de busca Supabase:", e);
    return null;
  }
}

/**
 * Escuta atualizações em tempo real (Postgres Changes via WebSockets)
 */
export function subscribeToRealtimeLeaderboard(onUpdateCallback) {
  if (!supabase) return null;

  return supabase
    .channel('realtime_ranking')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, async (payload) => {
      console.log('🔄 Mudança detectada no banco em tempo real:', payload);
      const updatedTeams = await fetchTeamsFromSupabase();
      if (updatedTeams) {
        onUpdateCallback(updatedTeams);
      }
    })
    .subscribe();
}
