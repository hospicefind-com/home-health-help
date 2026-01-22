"use server"

import { AuthError } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

// now we wanna loop through each email and invite them through supabase
export default async function InviteUsers(formData: FormData, userType: string) {
  // This is our own custom createClient function that makes the client an admin client
  const supabase = CreateAdminClient();

  const emails = formData
    .getAll("email") // this method get's all of the elements associated with a given key
    .map((v) => String(v).trim().toLowerCase());

  // this shouldn't ever happen but it's here just in case
  if (emails.length === 0) {
    return;
  };

  try {
    // need to await each invite call so that it actually sends them.
    await Promise.all(
      emails.map(async (email) => { // have to mark this map function as async as well otherwise we can't await for stuff in it
        // invite the specific email and then redirect them to the /auth/set-password/marketer endpoint
        const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL || 'https://hospicefind.com'; // make sure your env is set to localhost:3000 or whatever it is if it isn't that
        const redirectURL = new URL(`/auth/forgot-password`, baseUrl);
        console.log(redirectURL.toString());
        const { error: inviteUsersError } = await supabase.auth.admin.inviteUserByEmail(
          email,
          {
            redirectTo: redirectURL.toString() // this will only work in production
          }
        );

        // this error is of type AuthError btw
        if (inviteUsersError) throw inviteUsersError; // throw the error if it exists
      })
    );
  } catch (error: unknown) { // apparently typescript catch variables can only take types 'unknown' or 'any'
    if (error instanceof AuthError) {
      // handle Supabase auth errors
      console.error('Invite failed:', error.message);
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message);
    } else {
      console.error('Unknown error inviting users');
    }
  }
}

function CreateAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
