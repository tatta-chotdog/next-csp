import React from "react";
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

const List: React.FC = () => {
  const { data, error, mutate } = useSWR<Phrase[]>("/api/phrase", fetcher);

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

  if (error) return <div>エラーが発生しました。</div>;
  if (!data) return <div>読み込み中…</div>;

  return (
    <div style={{ padding: "20px", background: "#fff9c4", minHeight: "100vh" }}>
      <h1 style={{ color: "#ff4081" }}>登録フレーズ一覧</h1>
      {data.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          登録されているフレーズはありません。
        </p>
      ) : (
        <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                日本語
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>英語</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((phrase: Phrase) => (
              <tr key={phrase.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {phrase.japanese}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {phrase.english}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() => handleDelete(phrase.id)}
                    style={{
                      padding: "4px 8px",
                      background: "#ff4081",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default List;
