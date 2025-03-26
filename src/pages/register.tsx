import { useState, FormEvent } from "react";
import React from "react";

const Register: React.FC = () => {
  const [japanese, setJapanese] = useState<string>("");
  const [english, setEnglish] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/phrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ japanese, english }),
      });
      if (res.ok) {
        setMessage("登録成功！");
        setJapanese("");
        setEnglish("");
      } else {
        setMessage("登録失敗…");
      }
    } catch {
      setMessage("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#e1f5fe",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#ff4081" }}>フレーズ登録</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <label>
          日本語:
          <input
            type="text"
            value={japanese}
            onChange={(e) => setJapanese(e.target.value)}
            required
            style={{
              margin: "10px 0",
              padding: "8px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <label>
          英語:
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
            style={{
              margin: "10px 0",
              padding: "8px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px",
            background: isSubmitting ? "#ccc" : "#ff4081",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "登録中..." : "登録"}
        </button>
      </form>
      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: message.includes("成功") ? "#4caf50" : "#f44336",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;
