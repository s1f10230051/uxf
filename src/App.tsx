import React, { useState } from 'react';
import TimedPicker, { type ExperimentResult } from './components/TimedPicker';
import { CSVLink } from 'react-csv'; // CSV書き出しライブラリ
import './App.css';

function App() {
  // 1. 全ての実験結果を保存する state
  const [results, setResults] = useState<ExperimentResult[]>([]);

  // 2. TimedPicker から結果を受け取るための関数
  const handleRecordResult = (result: ExperimentResult) => {
    setResults((prevResults) => [...prevResults, result]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>色彩選定の実験</h1>

        <div className="picker-container">
          {/* 3. 実験ブースを3つ並べる (お題は自由に変更可能) */}
          <TimedPicker
            shapeType="circle"
            taskName="柔らかい色"
            onRecord={handleRecordResult}
          />
          <TimedPicker
            shapeType="triangle"
            taskName="緊張感のある色"
            onRecord={handleRecordResult}
          />
          <TimedPicker
            shapeType="triangle"
            taskName="柔らかい色"
            onRecord={handleRecordResult}
          />
        </div>

        {/* 4. 結果の書き出しエリア */}
        <div className="results-area">
          <h2>実験結果 ({results.length}件)</h2>
          {/* CSVLinkコンポーネントを設置 */}
          <CSVLink
            data={results}
            filename={"color-picker-results.csv"}
            className="csv-button"
          >
            Excel (CSV) に書き出す
          </CSVLink>

          {/* 記録されたデータの簡易表示 */}
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;