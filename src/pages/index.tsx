import { useState, FormEvent } from "react";
import React from "react";

const Home: React.FC = () => {
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
        padding: "40px",
        minHeight: "calc(100vh - 60px)",
        background: "var(--background)",
      }}
    >
      <h1
        style={{
          color: "var(--primary)",
          fontSize: "3rem",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        登録
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <label style={{ fontSize: "1.2rem" }}>
          日本語:
          <input
            type="text"
            value={japanese}
            onChange={(e) => setJapanese(e.target.value)}
            required
            style={{
              margin: "10px 0",
              padding: "12px",
              width: "100%",
              borderRadius: "5px",
              border: "1px solid var(--gray-400)",
            }}
          />
        </label>
        <label style={{ fontSize: "1.2rem" }}>
          英語:
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
            style={{
              margin: "10px 0",
              padding: "12px",
              width: "100%",
              borderRadius: "5px",
              border: "1px solid var(--gray-400)",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px",
            background: isSubmitting
              ? "var(--gray-400)"
              : "var(--primary-light)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "1.2rem",
            marginTop: "50px",
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
            color: message.includes("成功") ? "var(--success)" : "var(--error)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Home;
