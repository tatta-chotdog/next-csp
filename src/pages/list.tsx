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
    <div
      style={{
        padding: "40px",
        background: "var(--background)",
        minHeight: "calc(100vh - 60px)",
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
        一覧
      </h1>
      {data.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          登録されているフレーズはありません。
        </p>
      ) : (
        <table
          style={{
            margin: "0 auto",
            borderCollapse: "collapse",
            width: "90%",
            maxWidth: "1200px",
          }}
        >
          <thead style={{ background: "var(--primary-light)" }}>
            <tr>
              <th
                style={{
                  border: "1px solid var(--gray-400)",
                  padding: "12px",
                  color: "#fff",
                }}
              >
                日本語
              </th>
              <th
                style={{
                  border: "1px solid var(--gray-400)",
                  padding: "12px",
                  color: "#fff",
                }}
              >
                英語
              </th>
              <th
                style={{
                  border: "1px solid var(--gray-400)",
                  padding: "12px",
                  width: "120px",
                  color: "#fff",
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((phrase: Phrase) => (
              <tr key={phrase.id}>
                <td
                  style={{
                    border: "1px solid var(--gray-400)",
                    padding: "12px",
                  }}
                >
                  {phrase.japanese}
                </td>
                <td
                  style={{
                    border: "1px solid var(--gray-400)",
                    padding: "12px",
                  }}
                >
                  {phrase.english}
                </td>
                <td
                  style={{
                    border: "1px solid var(--gray-400)",
                    padding: "12px",
                    textAlign: "center", // 中央寄せを追加
                    width: "120px", // 操作列の幅を固定
                  }}
                >
                  <button
                    onClick={() => handleDelete(phrase.id)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--error)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "1rem",
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
