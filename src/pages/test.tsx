import React, { useState, useEffect } from "react";
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

  const getRandomPhrase = () => {
    if (!allPhrases || allPhrases.length === 0) return null;

    // まだ表示していないフレーズをフィルタリング
    const remainingPhrases = allPhrases.filter(
      (phrase) => !displayedPhrases.has(phrase.id)
    );

    // 全てのフレーズを表示済みの場合、状態をリセット
    if (remainingPhrases.length === 0) {
      setDisplayedPhrases(new Set());
      return allPhrases[Math.floor(Math.random() * allPhrases.length)];
    }

    // 未表示のフレーズからランダムに選択
    return remainingPhrases[
      Math.floor(Math.random() * remainingPhrases.length)
    ];
  };

  const fetchPhrase = () => {
    setShowAnswer(false);
    const phrase = getRandomPhrase();
    if (phrase) {
      setCurrentPhrase(phrase);
      setDisplayedPhrases((prev) => new Set([...prev, phrase.id]));
    }
  };

  useEffect(() => {
    if (allPhrases && allPhrases.length > 0 && !currentPhrase) {
      fetchPhrase();
    }
  }, [allPhrases]);

  if (!allPhrases) return <div>読み込み中…</div>;
  if (allPhrases.length === 0) return <div>フレーズが登録されていません。</div>;
  if (!currentPhrase) return <div>読み込み中…</div>;

  return (
    <div
      style={{
        padding: "20px",
        background: "#d1c4e9",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#ff4081" }}>テスト</h1>
      <div style={{ fontSize: "24px", margin: "20px 0" }}>
        {currentPhrase.japanese}
      </div>
      {showAnswer && (
        <div style={{ fontSize: "20px", margin: "20px 0", color: "#000" }}>
          {currentPhrase.english}
        </div>
      )}
      <div>
        <button
          onClick={() => setShowAnswer(true)}
          style={{
            padding: "10px",
            margin: "10px",
            background: "#ff4081",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          正解を確認する
        </button>
        <button
          onClick={fetchPhrase}
          style={{
            padding: "10px",
            margin: "10px",
            background: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          次のフレーズ
        </button>
      </div>
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        {`進捗: ${displayedPhrases.size} / ${allPhrases.length} フレーズ`}
      </div>
    </div>
  );
};

export default Test;
