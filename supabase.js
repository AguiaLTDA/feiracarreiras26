// Supabase Configuration & Realtime Sync Module for Seahaven UNIVC

// Cole sua URL e ANON KEY do Supabase abaixo:
export const SUPABASE_URL = "SUA_SUPABASE_URL_HERE"; 
export const SUPABASE_ANON_KEY = "SUA_SUPABASE_ANON_KEY_HERE";

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
 * Salva ou atualiza a equipe no Supabase em tempo real
 */
export async function syncTeamToSupabase(team) {
  if (!supabase) return null;

  const payload = {
    id: team.id,
    name: team.teamName || team.name,
    student_name: team.name,
    school: team.school,
    avatar: team.avatar || '🚀',
    completed_stations: team.completedStations || [],
    unlocked_fragments: team.unlockedFragments || [],
    solved_final_puzzle: team.solvedFinalPuzzle || false,
    score: team.score || 0,
    time_spent: team.timeSpent || '0m',
    last_update: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('teams')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error("Erro ao sincronizar com Supabase:", error);
    } else {
      console.log("✅ Equipe sincronizada no Supabase!");
    }
    return data;
  } catch (e) {
    console.error("Erro de rede Supabase:", e);
  }
}

/**
 * Busca todas as equipes do Supabase
 */
export async function fetchTeamsFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('score', { ascending: false });

    if (error) {
      console.error("Erro ao buscar equipes no Supabase:", error);
      return null;
    }

    // Mapear campos do banco para o formato da app
    return data.map(row => ({
      id: row.id,
      name: row.name,
      studentName: row.student_name,
      school: row.school,
      avatar: row.avatar,
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
