import React, { useState, useEffect, useCallback } from "react";
import useSWR from "swr";

interface Phrase {
  id: number;
  japanese: string;
  english: string;
}

const fetcher = (url: string): Promise<Phrase[]> =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("APIエラーが発生しました");
    }
    return res.json();
  });

const Test: React.FC = () => {
  const { data: allPhrases } = useSWR<Phrase[]>("/api/phrase", fetcher);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [displayedPhrases, setDisplayedPhrases] = useState<Set<number>>(
    new Set()
  );

  const getRandomPhrase = useCallback(() => {
    if (!allPhrases || allPhrases.length === 0) return null;

    const remainingPhrases = allPhrases.filter(
      (phrase) => !displayedPhrases.has(phrase.id)
    );

    if (remainingPhrases.length === 0) {
      setDisplayedPhrases(new Set());
      return allPhrases[Math.floor(Math.random() * allPhrases.length)];
    }

    return remainingPhrases[
      Math.floor(Math.random() * remainingPhrases.length)
    ];
  }, [allPhrases, displayedPhrases]);

  const fetchPhrase = useCallback(() => {
    setShowAnswer(false);
    const phrase = getRandomPhrase();
    if (phrase) {
      setCurrentPhrase(phrase);
      setDisplayedPhrases((prev) => new Set([...prev, phrase.id]));
    }
  }, [getRandomPhrase]);

  useEffect(() => {
    if (allPhrases && allPhrases.length > 0 && !currentPhrase) {
      fetchPhrase();
    }
  }, [allPhrases, currentPhrase, fetchPhrase]);

  if (!allPhrases) return <div>読み込み中…</div>;
  if (allPhrases.length === 0) return <div>フレーズが登録されていません。</div>;
  if (!currentPhrase) return <div>読み込み中…</div>;

  return (
    <div
      style={{
        padding: "40px",
        background: "var(--background)",
        minHeight: "calc(100vh - 60px)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          color: "var(--primary)",
          fontSize: "3rem",
          marginBottom: "20px",
        }}
      >
        テスト
      </h1>
      <div
        style={{
          color: "var(--gray-700)",
          fontSize: "2.5rem",
          margin: "20px 0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {currentPhrase.japanese}
      </div>
      {showAnswer && (
        <div
          style={{
            fontSize: "1.3rem",
            margin: "20px 0",
            color: "var(--gray-600)",
          }}
        >
          {currentPhrase.english}
        </div>
      )}
      <div>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          style={{
            padding: "12px",
            margin: "10px",
            background: "var(--primary-light)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          正解を見る
        </button>
        <button
          onClick={fetchPhrase}
          style={{
            padding: "12px",
            margin: "10px",
            background: "var(--success)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          次のフレーズ
        </button>
      </div>
      <div
        style={{
          marginTop: "20px",
          fontSize: "1rem",
          color: "var(--gray-600)",
        }}
      >
        {`${displayedPhrases.size} / ${allPhrases.length}`}
      </div>
    </div>
  );
};

export default Test;
