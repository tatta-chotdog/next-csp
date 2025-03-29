import { useState } from "react";
import React from "react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import Welcome from "../components/Welcome";

export default function Home() {
  const { user, loading } = useAuth();
  const [japanese, setJapanese] = useState("");
  const [english, setEnglish] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!japanese || !english) {
      setMessage("日本語と英語の両方を入力してください");
      setIsSuccess(false);
      return;
    }

    if (!user) {
      setMessage("ログインが必要です");
      setIsSuccess(false);
      return;
    }

    try {
      const { error } = await supabase.from("phrases").insert([
        {
          japanese,
          english,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setMessage("登録が完了しました");
      setIsSuccess(true);
      setJapanese("");
      setEnglish("");
    } catch (error) {
      console.error("Error:", error);
      setMessage("エラーが発生しました");
      setIsSuccess(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="page-container">
        <Welcome />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">登録</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label className="form-label">
          日本語
          <input
            type="text"
            value={japanese}
            onChange={(e) => setJapanese(e.target.value)}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          英語
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            className="form-input"
            required
          />
        </label>

        <button
          type="submit"
          disabled={!japanese || !english}
          className="submit-button"
        >
          登録
        </button>

        {message && (
          <p className={`message ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
