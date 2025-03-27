import React from "react";
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

const List: React.FC = () => {
  const { data, error, mutate } = useSWR<Phrase[]>("/api/phrase", fetcher);
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [selectedTestMode, setSelectedTestMode] = React.useState<
    "ja2en" | "en2ja" | null
  >(null);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (data && prev.size === data.length) {
        return new Set();
      } else {
        return new Set(data ? data.map((phrase) => phrase.id) : []);
      }
    });
  };

  const handleTestModeSelect = (mode: "ja2en" | "en2ja") => {
    setSelectedTestMode(mode);
  };

  const handleTestStart = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds).join(",");
    router.push(`/test?ids=${ids}&mode=${selectedTestMode}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("このフレーズを削除してもよろしいですか？")) {
      return;
    }

    try {
      const res = await fetch(`/api/phrase?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 一覧を更新
        mutate();
      } else {
        const error = await res.json();
        alert(error.error || "削除に失敗しました。");
      }
    } catch (error) {
      console.error("Error deleting phrase:", error);
      alert("削除中にエラーが発生しました。");
    }
  };

  if (error) return <div className="error-message">エラーが発生しました。</div>;
  if (!data) return <div className="loading-message">読み込み中…</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">一覧</h1>
      {data.length === 0 ? (
        <p className="empty-message">登録されているフレーズはありません。</p>
      ) : (
        <>
          <div className="select-all-container">
            <div className="test-mode-section">
              <span className="test-mode-label">テスト形式：</span>
              <div className="test-mode-buttons">
                <button
                  onClick={() => handleTestModeSelect("ja2en")}
                  className={`test-mode-button ${
                    selectedTestMode === "ja2en" ? "active" : ""
                  }`}
                >
                  日本語→英語
                </button>
                <button
                  onClick={() => handleTestModeSelect("en2ja")}
                  className={`test-mode-button ${
                    selectedTestMode === "en2ja" ? "active" : ""
                  }`}
                >
                  英語→日本語
                </button>
              </div>
            </div>
            <div className="action-buttons">
              <button
                onClick={toggleSelectAll}
                className={`select-all-button ${
                  data && selectedIds.size === data.length ? "active" : ""
                }`}
              >
                {selectedIds.size === data.length ? "全解除" : "全選択"}
              </button>
              <div className="test-start-button-container">
                {selectedIds.size > 0 && (
                  <button
                    onClick={handleTestStart}
                    className={`test-start-button ${
                      selectedIds.size > 0 ? "visible" : ""
                    }`}
                    disabled={!selectedTestMode}
                  >
                    テストする
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="checkbox-column">選択</th>
                  <th>日本語</th>
                  <th>英語</th>
                  <th className="action-column">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.map((phrase: Phrase) => (
                  <tr key={phrase.id}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(phrase.id)}
                        onChange={() => toggleSelection(phrase.id)}
                      />
                    </td>
                    <td>{phrase.japanese}</td>
                    <td>{phrase.english}</td>
                    <td className="action-cell">
                      <button
                        onClick={() => handleDelete(phrase.id)}
                        className="delete-button"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default List;
