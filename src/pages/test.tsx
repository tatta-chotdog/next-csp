import React, { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [testMode, setTestMode] = useState<"ja2en" | "en2ja">("ja2en");
  const phrasesToTest = useMemo(() => {
    if (!allPhrases) return [];
    if (router.query.ids) {
      const ids = (router.query.ids as string).split(",").map(Number);
      return allPhrases.filter((p) => ids.includes(p.id));
    }
    return allPhrases;
  }, [allPhrases, router.query.ids]);

  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [displayedPhrases, setDisplayedPhrases] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (
      router.isReady &&
      router.query.mode &&
      (router.query.mode === "ja2en" || router.query.mode === "en2ja")
    ) {
      setTestMode(router.query.mode as "ja2en" | "en2ja");
    }
  }, [router.isReady, router.query.mode]);

  const getRandomPhrase = useCallback(() => {
    if (!phrasesToTest || phrasesToTest.length === 0) return null;

    const remainingPhrases = phrasesToTest.filter(
      (phrase) => !displayedPhrases.has(phrase.id)
    );

    if (remainingPhrases.length === 0) {
      setDisplayedPhrases(new Set());
      return phrasesToTest[Math.floor(Math.random() * phrasesToTest.length)];
    }

    return remainingPhrases[
      Math.floor(Math.random() * remainingPhrases.length)
    ];
  }, [phrasesToTest, displayedPhrases]);

  const fetchPhrase = useCallback(() => {
    setShowAnswer(false);
    const phrase = getRandomPhrase();
    if (phrase) {
      setCurrentPhrase(phrase);
      setDisplayedPhrases((prev) => new Set([...prev, phrase.id]));
    }
  }, [getRandomPhrase]);

  useEffect(() => {
    if (phrasesToTest && phrasesToTest.length > 0 && !currentPhrase) {
      fetchPhrase();
    }
  }, [phrasesToTest, currentPhrase, fetchPhrase]);

  if (!allPhrases) return <div className="loading-message">読み込み中…</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">テスト</h1>
      {phrasesToTest.length === 0 ? (
        <div className="empty-message">
          登録されているフレーズはありません。
        </div>
      ) : !currentPhrase ? (
        <div className="loading-message">読み込み中…</div>
      ) : (
        <>
          <div className="question-text">
            {testMode === "ja2en"
              ? currentPhrase.japanese
              : currentPhrase.english}
          </div>
          {showAnswer && (
            <div className="answer-text">
              {testMode === "ja2en"
                ? currentPhrase.english
                : currentPhrase.japanese}
            </div>
          )}
          <div className="test-controls">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="test-button primary"
            >
              {showAnswer ? "正解を隠す" : "正解を見る"}
            </button>
            <button onClick={fetchPhrase} className="test-button secondary">
              次のフレーズ
            </button>
          </div>
          <div className="progress-counter">
            {`${displayedPhrases.size} / ${phrasesToTest.length}`}
          </div>
        </>
      )}
    </div>
  );
};

export default Test;
