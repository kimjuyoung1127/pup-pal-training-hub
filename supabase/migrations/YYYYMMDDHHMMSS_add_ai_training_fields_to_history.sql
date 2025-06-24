ALTER TABLE public.training_history
ADD COLUMN is_ai_training BOOLEAN DEFAULT FALSE,
ADD COLUMN ai_training_details JSONB;