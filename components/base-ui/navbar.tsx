"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/get-user/get-user";
import { LogoutButton } from "../buttons/logout-button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import LoginButton from "../buttons/login-button";
import { GetUserType } from "@/lib/get-user/get-user-type";
import { Button } from "./button";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHospiceUser, setIsHospiceUser] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // fetch the user and their type on the initial check
    const fetchUser = async () => {
      // Technically we could use the GetUserType function to do this same authentication check,
      // however this already works and I've had trouble with determining authentication before
      // so I'm just gonna keep this logic.
      const { isAuthed } = await getUser();
      setIsAuthenticated(isAuthed);

      // Get the inital user type and make note of it
      const { isHospice, isAdmin } = await GetUserType(supabase);
      setIsHospiceUser(isHospice);
      setIsAdminUser(isAdmin);
    };
    fetchUser();

    // then subscribe to listen to authentication changes
    // this listener function stays running in the background,
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // set the authenticated state to be the truthy value of the user session (whether they exist or not)
        setIsAuthenticated(!!session?.user);

        // Only fetch user type if user is authenticated
        if (session?.user) {
          // Create a fresh client and add small delay to ensure session is ready
          await new Promise(resolve => setTimeout(resolve, 100));
          const freshClient = createClient();
          const { isHospice, isAdmin } = await GetUserType(freshClient);
          setIsHospiceUser(isHospice);
          setIsAdminUser(isAdmin);
        } else {
          // Clear user type state on sign out
          setIsHospiceUser(false);
          setIsAdminUser(false);
        }

        // refresh data on the current page if they just signed out or in
        if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
          router.refresh();
        }
      },
    );

    // this is the cleanup function for the useEffect function
    // this gets rid of the background subscription upon changing/leaving the page
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router, supabase]); // Removed supabase from dependencies to prevent recreation

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-foreground-alt ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center h-16">
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:text-foreground-alt transition"
          >
            Find Hospices
          </Link>

          <div className="flex items-center gap-4">
            {isHospiceUser && (
              <Button asChild variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10">
                <Link href="/hospice/dashboard">Dashboard</Link>
              </Button>
            )}

            {isAdminUser && (
              <Button asChild variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10">
                <Link href="/admin/dashboard">Dashboard</Link>
              </Button>
            )}
            <Button asChild size="sm" >
              <Link href="about">About</Link>
            </Button>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
