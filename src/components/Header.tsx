import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useAuth } from "../lib/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Header: React.FC = () => {
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="header">
      <Link href="/" className="header-title">
        PhraseUp
      </Link>
      <nav>
        <ul className="header-nav">
          {user ? (
            <>
              <li>
                <Link href="/">登録</Link>
              </li>
              <li>
                <Link href="/list">一覧</Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="auth-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleSignIn} className="auth-button">
                <Image
                  src="/google-icon.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Login
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
