import Link from "next/link";
import React from "react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";

const Header: React.FC = () => {
  const { user } = useAuth();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="header">
      <div className="header-title">英語フレーズアプリ</div>
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
                  ログアウト
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleSignIn} className="auth-button">
                Googleでログイン
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
