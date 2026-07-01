UPDATE "user" SET role = 'admin' WHERE username = 'admin';
SELECT id, username, email, role, is_active FROM public.user WHERE username = 'admin';
