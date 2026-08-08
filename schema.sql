-- Script SQL de Criação da Tabela de Ranking no Supabase
-- Execute este script no SQL Editor do seu Dashboard no Supabase: https://supabase.com

-- 1. Criar a tabela 'teams'
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
    last_update TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Habilitar segurança em nível de linha (RLS)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de acesso público para leitura e escrita (Ideal para eventos ao vivo)
CREATE POLICY "Permitir leitura pública do ranking" 
ON public.teams FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de equipes" 
ON public.teams FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de equipes" 
ON public.teams FOR UPDATE USING (true);

-- 4. Habilitar o canal de Realtime do Supabase para a tabela 'teams'
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
