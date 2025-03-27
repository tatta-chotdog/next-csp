import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-title">英語フレーズアプリ</div>
      <nav>
        <ul className="header-nav">
          <li>
            <Link href="/">登録</Link>
          </li>
          <li>
            <Link href="/list">一覧</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
