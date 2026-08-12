// Supabase Configuration & Realtime Sync Module for Seahaven UNIVC

export const SUPABASE_URL = "https://snzuvksroqeszrjzfpyq.supabase.co"; 
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuenV2a3Nyb3Flc3pyanpmcHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNDYyNzAsImV4cCI6MjEwMTcyMjI3MH0.VjBtBZ4dmFEK_Qh2D4XSLck2vMQ4Y7KHEdBZojfxdGU";

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
 * Salva ou atualiza o aluno no Supabase em tempo real
 */
export async function syncTeamToSupabase(student) {
  if (!supabase) return null;

  const payload = {
    id: student.id,
    name: student.name,
    student_name: student.name,
    whatsapp: student.whatsapp || '',
    preferred_course: student.preferredCourse || '',
    school: student.school,
    avatar: student.avatar || '🎓',
    completed_stations: student.completedStations || [],
    unlocked_fragments: student.unlockedFragments || [],
    solved_final_puzzle: student.solvedFinalPuzzle || false,
    score: student.score || 0,
    time_spent: student.timeSpent || '0m',
    last_update: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('teams')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error("Erro ao sincronizar com Supabase:", error);
    } else {
      console.log("✅ Aluno sincronizado no Supabase!");
    }
    return data;
  } catch (e) {
    console.error("Erro de rede Supabase:", e);
  }
}

/**
 * Busca todos os alunos do Supabase
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
      whatsapp: row.whatsapp || '',
      preferredCourse: row.preferred_course || '',
      school: row.school,
      avatar: row.avatar || '🎓',
      completedStations: row.completed_stations || [],
      unlockedFragments: row.unlocked_fragments || [],
      solvedFinalPuzzle: row.solved_final_puzzle,
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
 * Exclui um aluno do Supabase por ID
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
      console.log("🗑️ Aluno excluído do Supabase:", id);
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
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('teams')
      .delete()
      .neq('id', '000000'); // Deleta todas as linhas

    if (error) {
      console.error("Erro ao zerar tabela no Supabase:", error);
    } else {
      console.log("🧹 Tabela zerada no Supabase para o evento oficial!");
    }
    return data;
  } catch (e) {
    console.error("Erro de reset Supabase:", e);
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
