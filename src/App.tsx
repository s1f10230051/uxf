import { useState } from 'react';
import { SketchPicker } from 'react-color';
import { type ColorResult } from 'react-color';
import ShapeEditor from './components/ShapeEditor';      // 前回作成したエディタ
import SvgShapeDisplay from './components/SvgShapeDisplay'; // 今回作成した表示用
import './App.css';

function App() {
  // 1. 図形の形 (SVGパス文字列) を管理する state
  const [customPath, setCustomPath] = useState<string>('');

  // 2. 色を管理する state
  const [selectedColor, setSelectedColor] = useState<string>('#3498db');

  return (
    <div className="App">
      <header className="App-header">
        <h1>カスタムシェイプ・カラーピッカー</h1>
        <p>Step 1: 形を作る → Step 2: 色を選ぶ</p>

        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '50px', padding: '20px' }}>
          
          {/* --- 左側: Step 1 図形作成エリア --- */}
          <div className="section" style={{ width: '350px' }}>
            <h2>Step 1: 形を描く</h2>
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '2px solid #333' }}>
              {/* エディタで操作した結果(パス)を setCustomPath で受け取る */}
              <ShapeEditor 
                width={300} 
                height={300} 
                onUpdatePath={(path) => setCustomPath(path)} 
              />
            </div>
            <p style={{fontSize: '0.8rem', marginTop: '10px'}}>クリックで頂点を追加、ドラッグで移動</p>
          </div>

          {/* --- 矢印 --- */}
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '2rem' }}>
            ➡
          </div>

          {/* --- 右側: Step 2 色選択エリア --- */}
          <div className="section" style={{ width: '350px' }}>
            <h2>Step 2: 色を選ぶ</h2>
            
            {/* ここが「独自のカラーピッカー表示図形」になります */}
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '2px solid #333', marginBottom: '20px' }}>
              <SvgShapeDisplay 
                pathData={customPath} 
                color={selectedColor} 
              />
            </div>

            {/* カラーピッカー本体 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SketchPicker
                color={selectedColor}
                onChange={(color: ColorResult) => setSelectedColor(color.hex)}
                disableAlpha={true} // 透明度を使わない場合
              />
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}

export default App;