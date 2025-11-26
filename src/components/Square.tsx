// src/components/Square.tsx

// このコンポーネント専用のCSSを読み込む
import './Square.css';

// Squareという名前のReactコンポーネントを定義
function Square() {
  return (
    <div className="square">
      <p>これは四角です</p>
    </div>
  );
}

// 他ファイルで使えるようにエクスポートする
export default Square;