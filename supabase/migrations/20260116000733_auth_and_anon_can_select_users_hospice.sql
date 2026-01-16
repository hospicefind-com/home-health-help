drop policy "Anyone can select" on "public"."users_hospice";


  create policy "Anyone can select"
  on "public"."users_hospice"
  as permissive
  for select
  to anon, authenticated
using (true);



