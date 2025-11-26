import { useState } from 'react';
import ShapeEditor from './components/ShapeEditor';

function App() {
  const [currentPath, setCurrentPath] = useState<string>('');

  return (
    <div style={{ padding: '20px' }}>
      <h1>図形生成ツール</h1>
      
      <div style={{ display: 'flex', gap: '40px' }}>
        {/* 1. 作る場所 */}
        <div>
          <h3>エディタ</h3>
          <ShapeEditor 
            onUpdatePath={(d) => setCurrentPath(d)} 
          />
        </div>

        {/* 2. 使う場所（プレビュー） */}
        <div>
          <h3>生成された図形 (プレビュー)</h3>
          {/* 生成された path データを使用 */}
          <svg width="300" height="300" style={{ border: '1px solid #eee' }}>
            <path d={currentPath} fill="#e74c3c" />
          </svg>
          
          <div style={{ marginTop: '20px', maxWidth: '300px', wordBreak: 'break-all' }}>
             <h4>Pathデータ:</h4>
             <code>{currentPath}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;