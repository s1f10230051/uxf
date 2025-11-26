import { useState, useRef } from 'react';
import { type MouseEvent } from 'react';

// 座標の型定義
type Point = { x: number; y: number };

type Props = {
  width?: number;
  height?: number;
  onUpdatePath: (pathData: string) => void; // 親にパスデータを渡す
};

const ShapeEditor = ({ width = 300, height = 300, onUpdatePath }: Props) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 座標をSVG内の座標系に変換するヘルパー関数
  const getMousePosition = (e: MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  // 1. マウスダウン（頂点追加 または ドラッグ開始）
  const handleMouseDown = (e: MouseEvent, index: number | null = null) => {
    e.stopPropagation(); // イベントのバブリング防止

    if (index !== null) {
      // 既存の頂点をクリックした場合はドラッグ開始
      setDraggingIndex(index);
    } else {
      // 空白をクリックした場合は新しい頂点を追加
      const newPoint = getMousePosition(e);
      const newPoints = [...points, newPoint];
      setPoints(newPoints);
      updateParent(newPoints);
    }
  };

  // 2. マウスムーブ（ドラッグ中）
  const handleMouseMove = (e: MouseEvent) => {
    if (draggingIndex === null) return;

    const currentPoint = getMousePosition(e);
    const newPoints = [...points];
    newPoints[draggingIndex] = currentPoint;
    setPoints(newPoints);
    updateParent(newPoints);
  };

  // 3. マウスアップ（ドラッグ終了）
  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  // ポイント配列をSVGのパス文字列(d属性)に変換して親に通知
  const updateParent = (currentPoints: Point[]) => {
    if (currentPoints.length === 0) return;
    
    // SVG Path Command: M = Move to, L = Line to, Z = Close path
    const d = currentPoints.map((p, i) => {
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
    }).join(' ') + ' Z';

    onUpdatePath(d);
  };

  // リセット機能
  const handleReset = () => {
    setPoints([]);
    onUpdatePath('');
  };

  // ポイント配列からSVGパスを生成（表示用）
  const pathData = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
    : '';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleReset}>リセット</button>
        <span style={{ fontSize: '0.8em', marginLeft: '10px' }}>
          クリックで頂点追加 / ドラッグで移動
        </span>
      </div>

      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ccc', cursor: 'crosshair', backgroundColor: '#fff' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={(e) => handleMouseDown(e, null)} // 背景クリックで追加
      >
        {/* 描画中の図形 */}
        <path
          d={pathData}
          fill="rgba(52, 152, 219, 0.3)"
          stroke="#3498db"
          strokeWidth="2"
        />

        {/* 操作用のハンドル（丸い点） */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6}
            fill={draggingIndex === i ? 'red' : 'white'}
            stroke="#3498db"
            strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onMouseDown={(e) => handleMouseDown(e, i)} // 頂点クリックでドラッグ開始
          />
        ))}
      </svg>
    </div>
  );
};

export default ShapeEditor;