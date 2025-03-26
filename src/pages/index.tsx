import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        background: "#f0e6f6",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#ff4081" }}>英語フレーズアプリ</h1>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link href="/register">登録</Link>
          </li>
          <li>
            <Link href="/list">一覧</Link>
          </li>
          <li>
            <Link href="/test">テスト</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
