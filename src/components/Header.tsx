import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header
      style={{
        background: "var(--primary)",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
        英語フレーズアプリ
      </div>
      <nav>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li style={{ marginRight: "15px", color: "#fff" }}>
            <Link href="/">登録</Link>
          </li>
          <li style={{ marginRight: "15px", color: "#fff" }}>
            <Link href="/list">一覧</Link>
          </li>
          <li style={{ color: "#fff" }}>
            <Link href="/test">テスト</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
