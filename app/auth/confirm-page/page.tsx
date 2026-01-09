/// <reference lib="dom" />
// We need to use this little shebang at the top because that's how it's able to see the library/file that holds 'window'
'use client'

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

function ConfirmContent() {
  const [status, setStatus] = useState('Initializing auth...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleInvite = async () => {
      const next = searchParams.get('next') ?? '/';
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken) {
        // Check if session already exists (handled by Supabase auto-detect)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace(next);
          return;
        }
        setStatus('Error: No access token found in URL.');
        return;
      }

      setStatus('Token found. Verifying session...');

      // so there's a known bug with setSession that requires you to wati for auth to change rather than just letting setSession move on.
      // setSession will just block all code and just hang it's super cool https://github.com/supabase/supabase-js/issues/1441

      // 1. SETUP LISTENER FIRST
      // We listen for the 'SIGNED_IN' event. This fires as soon as the session is valid,
      // regardless of whether setSession() promise resolves or hangs.
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setStatus('Session active. Redirecting...');
          router.replace(next);
        }
      });

      // 2. CALL SETSESSION WITHOUT AWAITING (FIRE AND FORGET)
      // We do NOT use 'await' here. If it hangs, we don't care, because
      // the listener above will catch the success event anyway.
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(({ error }) => {
        if (error) {
          setStatus(`Error setting session: ${error.message}`);
        }
      });

      // Cleanup listener on unmount
      return () => {
        subscription.unsubscribe();
      };
    }

    handleInvite();
  }, [router, searchParams, supabase]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Processing Invite</h1>
      <p className="text-muted-foreground font-mono text-sm">{status}</p>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
