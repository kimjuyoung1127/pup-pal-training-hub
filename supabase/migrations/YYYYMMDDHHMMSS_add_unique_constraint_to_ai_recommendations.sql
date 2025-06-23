ALTER TABLE public.ai_recommendations
ADD CONSTRAINT ai_recommendations_dog_id_user_id_key UNIQUE (dog_id, user_id);