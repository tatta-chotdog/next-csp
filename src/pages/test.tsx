import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import Welcome from "../components/Welcome";

interface Phrase {
  id: number;
  japanese: string;
  english: string;
  user_id: string;
}

const Test: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testMode, setTestMode] = useState<"ja2en" | "en2ja">("ja2en");

  // フレーズデータの取得
  useEffect(() => {
    const fetchPhrases = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("phrases")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        setAllPhrases(data || []);
      } catch (err) {
        console.error("Error fetching phrases:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPhrases();
    }
  }, [user]);

  const phrasesToTest = useMemo(() => {
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

  if (loading || isLoading) {
    return <div className="loading-message">読み込み中…</div>;
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
