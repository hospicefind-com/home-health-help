'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GetCmsData } from '../hospice-data/get-cms-data';
import { PROVIDER_DATA } from '../globals';

export async function SetMarketerPassword(formData: FormData) {
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  // 1. Initialize Server Client (Reads cookies automatically)
  const supabase = await createClient();

  // 2. Check if we actually have a user (from the invite flow)
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Session expired or invalid. Please try clicking the invite link again." };
  }

  // 3. Update the password (ON THE SERVER - No Deadlocks!)
  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    return { error: updateError.message };
  }

  // 4. Insert the Marketer Data
  const { error: insertError } = await supabase
    .from('users_marketer')
    .insert([{ id: user.id, name: name }]);

  if (insertError) {
    return { error: "Error creating user profile: " + insertError.message };
  }

  // This clears the session on the server side immediately
  // Remove their local session (cookie) only
  await supabase.auth.signOut({ scope: 'local' });

  // 5. Success - Redirect
  // We redirect here because Server Actions must redirect or return data
  redirect('/');
}

export async function SetHospicePassword(formData: FormData) {
  const name = formData.get('company_name') as string
  const password = formData.get('password') as string
  const placeId = formData.get('placeId') as string
  const phoneNum = formData.get('phoneNum') as string

  const supabase = await createClient()

  // Fetch the CMS data first before we do anything with password stuff
  // 3. Fetch CMS Data (Done on server now)
  // Note: Ensure GetCmsData can run server-side (uses fetch/axios, not window)
  const cmsPhoneQuery = `[SELECT cms_certification_number_ccn FROM ${PROVIDER_DATA}][WHERE telephone_number = "${phoneNum}"][LIMIT 1]`;

  // Get the CMS data
  const cmsResponse = await GetCmsData(cmsPhoneQuery);

  if (!cmsResponse || cmsResponse.length === 0) {
    return { error: "Could not find a hospice matching that phone number." };
  }

  // STEP C: Get the CCN
  // Important: Since your query was "SELECT ccn", Socrata usually returns the key as "ccn", 
  // not "cms_certification_number_ccn". We check both just in case.
  const ccn = cmsResponse[0].cms_certification_number_ccn;

  if (!ccn) {
    return { error: "Found the hospice, but the CCN was missing." };
  }

  // 1. Verify Session
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Session expired. Please click the invite link again." }
  }

  // 4. Insert into users_hospice
  const { error: insertError } = await supabase
    .from('users_hospice')
    .insert([{
      id: user.id,
      company: name,
      place_id: placeId,
      phone_num: phoneNum,
      ccn
    }]);

  if (insertError) {
    return { error: "Error creating hospice profile: " + insertError.message }
  }

  // 2. Update Password (Server Side - No Deadlock)
  const { error: updateError } = await supabase.auth.updateUser({ password })

  if (updateError) {
    return { error: updateError.message }
  }



  // This clears the session on the server side immediately
  // Remove their local session (cookie) only
  await supabase.auth.signOut({ scope: 'local' });

  // Redirect to Login
  redirect("/auth/login?message=Password updated. Please log in.");
}
