-- ==============================================================================
-- SCRIPT DE BANCO DE DADOS SUPABASE — FEIRA DE CARREIRAS UNIVC 2026
-- Tema: Seahaven UNIVC — O Último Episódio
-- ==============================================================================
-- Instruções: Execute este script no SQL Editor do seu Dashboard Supabase (https://supabase.com)

-- 1. Criar a tabela de equipes e alunos visitantes
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    student_name TEXT,
    school TEXT NOT NULL,
    avatar TEXT DEFAULT '🚀',
    completed_stations INTEGER[] DEFAULT '{}',
    unlocked_fragments TEXT[] DEFAULT '{}',
    solved_final_puzzle BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    time_spent TEXT DEFAULT '0m',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_update TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Criar Índice para ordenação ultra-rápida do Leaderboard no Telão
CREATE INDEX IF NOT EXISTS idx_teams_score_desc ON public.teams (score DESC);
CREATE INDEX IF NOT EXISTS idx_teams_school ON public.teams (school);

-- 3. Habilitar segurança em nível de linha (Row Level Security - RLS)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem para evitar duplicidade
DROP POLICY IF EXISTS "Permitir leitura pública do ranking" ON public.teams;
DROP POLICY IF EXISTS "Permitir inserção pública de equipes" ON public.teams;
DROP POLICY IF EXISTS "Permitir atualização pública de equipes" ON public.teams;

-- 5. Criar Políticas de Acesso Público (Leitura, Inserção e Atualização)
CREATE POLICY "Permitir leitura pública do ranking" 
ON public.teams FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção pública de equipes" 
ON public.teams FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de equipes" 
ON public.teams FOR UPDATE 
USING (true);

-- 6. Função e Trigger para atualizar automaticamente o campo 'last_update'
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_update = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_teams_updated_at ON public.teams;

CREATE TRIGGER set_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. Habilitar a publicação do Supabase Realtime para a tabela 'teams'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'teams'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
    END IF;
END $$;
