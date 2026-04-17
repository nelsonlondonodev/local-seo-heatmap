-- 1. Create keyword_projects table
CREATE TABLE IF NOT EXISTS public.keyword_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  target_url TEXT,
  location_code INTEGER,
  language_code TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create tracked_keywords table
CREATE TABLE IF NOT EXISTS public.tracked_keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.keyword_projects(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  search_engine TEXT DEFAULT 'google',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create keyword_history table
CREATE TABLE IF NOT EXISTS public.keyword_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_id UUID NOT NULL REFERENCES public.tracked_keywords(id) ON DELETE CASCADE,
  rank INTEGER,
  rank_change INTEGER DEFAULT 0,
  search_volume INTEGER,
  results_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.keyword_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_history ENABLE ROW LEVEL SECURITY;

-- 5. Policies

-- Keyword Projects
CREATE POLICY "Users can view their own keyword projects" 
  ON public.keyword_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own keyword projects" 
  ON public.keyword_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own keyword projects" 
  ON public.keyword_projects FOR DELETE USING (auth.uid() = user_id);

-- Tracked Keywords
CREATE POLICY "Users can view keywords of their own projects" 
  ON public.tracked_keywords FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.keyword_projects WHERE id = project_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert keywords to their own projects" 
  ON public.tracked_keywords FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.keyword_projects WHERE id = project_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their own tracked keywords" 
  ON public.tracked_keywords FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.keyword_projects WHERE id = project_id AND user_id = auth.uid())
  );

-- Keyword History
CREATE POLICY "Users can view history of their own keywords" 
  ON public.keyword_history FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tracked_keywords tk
      JOIN public.keyword_projects kp ON tk.project_id = kp.id
      WHERE tk.id = keyword_id AND kp.user_id = auth.uid()
    )
  );
