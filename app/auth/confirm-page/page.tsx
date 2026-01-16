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
    const handleAuth = async () => {
      const next = searchParams.get('next') ?? '/';
      const tokenHash = searchParams.get('token_hash'); // PKCE "new stuff"

      // 2. CHECK FOR PKCE CODE (The New Flow)
      if (tokenHash) {
        setStatus('Verifying link...');
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'invite',
        });

        if (error) {
          setStatus(`Error: ${error.message}`);
        }
        // If successful, onAuthStateChange will catch it and redirect
        return;
      }

      // CHECK IF ALREADY LOGGED IN
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
      } else {
        setStatus('Error: No login code or token found.');
      }

    }

    handleAuth();
  }, [router, searchParams, supabase]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Processing Login</h1>
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
