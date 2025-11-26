import { useState } from 'react';
import { SketchPicker } from 'react-color';
import { type ColorResult } from 'react-color';
import ShapeEditor from './components/ShapeEditor';
import SvgShapeDisplay from './components/SvgShapeDisplay';
import PresetSelector from './components/PresetSelector';
import './App.css';

// 座標の型定義
type Point = { x: number; y: number };

function App() {
  const [customPath, setCustomPath] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#3498db');

  // ▼▼▼ エディタに渡すためのデータ ▼▼▼
  const [editorPoints, setEditorPoints] = useState<Point[] | undefined>(undefined);
  const [editorSmooth, setEditorSmooth] = useState<boolean | undefined>(undefined);

  // プリセットが選ばれた時の処理
  const handlePresetSelect = (points: Point[], isSmooth: boolean) => {
    // 座標データをセットすると、ShapeEditor内のuseEffectが反応して反映される
    setEditorPoints(points);
    setEditorSmooth(isSmooth);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>カスタムシェイプ・カラーピッカー</h1>

        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '50px', padding: '20px' }}>
          
          <div className="section" style={{ width: '350px' }}>
            <h2>Step 1: 形を決める</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>サンプルからロード:</p>
              {/* onSelect で座標と曲線フラグを受け取る */}
              <PresetSelector onSelect={handlePresetSelect} />
            </div>

            <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>調整する:</p>
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '2px solid #333' }}>
              {/* externalPoints などを渡す */}
              <ShapeEditor 
                width={300} 
                height={300} 
                onUpdatePath={(path) => setCustomPath(path)} 
                externalPoints={editorPoints}
                externalSmooth={editorSmooth}
              />
            </div>
            <p style={{fontSize: '0.8rem', marginTop: '10px'}}>頂点をドラッグして微調整できます</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', fontSize: '2rem' }}>
            ➡
          </div>

          <div className="section" style={{ width: '350px' }}>
            <h2>Step 2: 色を選ぶ</h2>
            
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '2px solid #333', marginBottom: '20px' }}>
              <SvgShapeDisplay 
                pathData={customPath} 
                color={selectedColor} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SketchPicker
                color={selectedColor}
                onChange={(color: ColorResult) => setSelectedColor(color.hex)}
                disableAlpha={true}
              />
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}

export default App;