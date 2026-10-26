-- ==============================================================================
-- REINÍCIO DA BASE — FEIRA DE CARREIRAS UNIVC 2026
-- Execute no SQL Editor do Supabase DEPOIS do schema.sql.
-- 1) Salva todos os participantes atuais (com ranqueamento) em teams_archive
-- 2) Zera a tabela de participantes
-- 3) Inicia uma nova rodada (os celulares descartam os crachás antigos)
-- Equivale ao botão "Salvar Base e Reiniciar Contagem" do Painel Admin.
-- ==============================================================================

BEGIN;

INSERT INTO public.teams_archive (round_id, archived_at, final_rank, team_id, data)
SELECT
    COALESCE((SELECT value FROM public.app_settings WHERE key = 'current_round'), 'inicial'),
    timezone('utc'::text, now()),
    ROW_NUMBER() OVER (ORDER BY t.score DESC),
    t.id,
    jsonb_build_object(
        'id', t.id,
        'name', t.name,
        'studentName', t.student_name,
        'registrationType', COALESCE(t.registration_type, 'individual'),
        'groupName', t.group_name,
        'leaderName', t.leader_name,
        'groupSize', t.group_size,
        'whatsapp', t.whatsapp,
        'preferredCourse', t.preferred_course,
        'school', t.school,
        'avatar', t.avatar,
        'completedStations', to_jsonb(t.completed_stations),
        'score', t.score,
        'timeSpent', t.time_spent,
        'lastUpdate', t.last_update
    )
FROM public.teams t;

DELETE FROM public.teams;

INSERT INTO public.app_settings (key, value, updated_at)
VALUES ('current_round', to_char(timezone('utc'::text, now()), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), timezone('utc'::text, now()))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;

COMMIT;
