
-- Update the messages table to reference profiles instead of auth.users directly
ALTER TABLE public.messages 
DROP CONSTRAINT IF EXISTS messages_author_id_fkey;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
