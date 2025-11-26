import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';
import ShapeDisplay from './ShapeDisplay'; // 既存の図形コンポーネント

// 親コンポーネント(App.tsx)に渡す結果の「型」を定義
export type ExperimentResult = {
  shape: string;
  task: string;
  color: string;
  time_ms: number; // ミリ秒
};

// このコンポーネントが受け取る props
type Props = {
  shapeType: 'circle' | 'square' | 'triangle';
  taskName: string; // 例: "柔らかい色"
  onRecord: (result: ExperimentResult) => void; // 結果を親に渡すための関数
};

const TimedPicker = ({ shapeType, taskName, onRecord }: Props) => {
  const [color, setColor] = useState<string>('#ffffff');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);

  // 1. 「タスク開始」ボタンが押された時の処理
  const handleStart = () => {
    setStartTime(performance.now()); // 現在の正確な時刻を記録
    setIsTaskRunning(true);
  };

  // 2. 「色を決定」ボタンが押された時の処理
  const handleConfirm = () => {
    if (startTime === null) return; // 開始されていなければ何もしない

    const endTime = performance.now(); // 終了時刻を記録
    const duration = Math.round(endTime - startTime); // 経過時間(ms)を計算

    // 親コンポーネントに結果を送信
    onRecord({
      shape: shapeType,
      task: taskName,
      color: color,
      time_ms: duration,
    });

    // 状態をリセット
    setIsTaskRunning(false);
    setStartTime(null);
  };

  return (
    <div className="picker-set">
      {/* お題と図形の表示 */}
      <h3>お題: {taskName}</h3>
      <ShapeDisplay color={color} shapeType={shapeType} />

      {/* カラーピッカー (タスク実行中のみ操作可能) */}
      <div style={{ opacity: isTaskRunning ? 1 : 0.5 }}>
        <SketchPicker
          color={color}
          onChange={(newColor: ColorResult) => setColor(newColor.hex)}
        />
      </div>

      {/* タイマーボタン */}
      <div className="timer-controls">
        {!isTaskRunning ? (
          <button onClick={handleStart}>タスク開始</button>
        ) : (
          <button onClick={handleConfirm} style={{ backgroundColor: '#2ecc71' }}>
            この色で決定
          </button>
        )}
      </div>
    </div>
  );
};

export default TimedPicker;