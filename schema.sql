-- ==============================================================================
-- SCRIPT DE BANCO DE DADOS SUPABASE — FEIRA DE CARREIRAS UNIVC 2026 (OFICIAL)
-- Tema: Seahaven UNIVC — O Último Episódio
-- Suporte a Cadastro Individual e Grupo de Alunos
-- ==============================================================================

-- 1. Criar a tabela de alunos e grupos visitantes
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    student_name TEXT,
    registration_type TEXT DEFAULT 'individual', -- 'individual' ou 'group'
    group_name TEXT,
    leader_name TEXT,
    group_size INTEGER DEFAULT 1,
    whatsapp TEXT,
    preferred_course TEXT,
    school TEXT NOT NULL,
    avatar TEXT DEFAULT '🎓',
    completed_stations INTEGER[] DEFAULT '{}',
    unlocked_fragments TEXT[] DEFAULT '{}',
    solved_final_puzzle BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    time_spent TEXT DEFAULT '0m',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_update TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Adicionar colunas caso a tabela já tenha sido criada anteriormente
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS preferred_course TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS registration_type TEXT DEFAULT 'individual';
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS group_name TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS leader_name TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS group_size INTEGER DEFAULT 1;

-- 2. Criar Índices para ordenação ultra-rápida do Leaderboard no Telão
CREATE INDEX IF NOT EXISTS idx_teams_score_desc ON public.teams (score DESC);
CREATE INDEX IF NOT EXISTS idx_teams_school ON public.teams (school);

-- 3. Habilitar segurança em nível de linha (Row Level Security - RLS)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem para evitar duplicidade
DROP POLICY IF EXISTS "Permitir leitura pública do ranking" ON public.teams;
DROP POLICY IF EXISTS "Permitir inserção pública de equipes" ON public.teams;
DROP POLICY IF EXISTS "Permitir atualização pública de equipes" ON public.teams;
DROP POLICY IF EXISTS "Permitir exclusão pública de equipes" ON public.teams;

-- 5. Criar Políticas de Acesso Público (Leitura, Inserção, Atualização e Exclusão)
CREATE POLICY "Permitir leitura pública do ranking" 
ON public.teams FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção pública de equipes" 
ON public.teams FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de equipes" 
ON public.teams FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusão pública de equipes" 
ON public.teams FOR DELETE 
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
