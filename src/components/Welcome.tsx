import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">PhraseUpへようこそ！</h1>
      <p className="welcome-description">
        このアプリは、あなたの英語学習をサポートする便利なツールです。
        <br />
        自分だけの英語フレーズリストを作成し、効果的に学習することができます。
      </p>
      <div className="feature-list">
        <div className="feature-item">
          <h3>フレーズの登録</h3>
          <p>
            覚えたい英語フレーズを日本語と一緒に登録できます。
            自分専用の学習リストを作成しましょう。
          </p>
        </div>
        <div className="feature-item">
          <h3>双方向テスト</h3>
          <p>
            日本語から英語、英語から日本語の両方向でテストができます。
            実践的な学習で確実に身につけましょう。
          </p>
        </div>
      </div>
      <p className="welcome-description">
        ログインして、あなたの英語学習を始めましょう！
      </p>
    </div>
  );
};

export default Welcome;
