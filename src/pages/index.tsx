import { useState } from "react";
import React from "react";

export default function Home() {
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

    try {
      const response = await fetch("/api/phrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ japanese, english }),
      });

      if (response.ok) {
        setMessage("登録が完了しました");
        setIsSuccess(true);
        setJapanese("");
        setEnglish("");
      } else {
        const data = await response.json();
        setMessage(data.message || "登録に失敗しました");
        setIsSuccess(false);
      }
    } catch {
      setMessage("エラーが発生しました");
      setIsSuccess(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">登録</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label className="form-label">
          日本語：
          <input
            type="text"
            value={japanese}
            onChange={(e) => setJapanese(e.target.value)}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          英語：
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
