CREATE TABLE public.ai_recommendations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    dog_id uuid NOT NULL,
    user_id uuid NOT NULL,
    recommendations jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT ai_recommendations_pkey PRIMARY KEY (id),
    CONSTRAINT ai_recommendations_dog_id_fkey FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE,
    CONSTRAINT ai_recommendations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for own recommendations" ON public.ai_recommendations
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own recommendations" ON public.ai_recommendations
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for own recommendations" ON public.ai_recommendations
AS PERMISSIVE FOR DELETE
TO authenticated
USING (auth.uid() = user_id);