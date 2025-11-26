import { useState, useRef } from 'react';
import { type MouseEvent } from 'react';

type Point = { x: number; y: number };

type Props = {
  width?: number;
  height?: number;
  onUpdatePath: (pathData: string) => void;
};

const ShapeEditor = ({ width = 300, height = 300, onUpdatePath }: Props) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [isSmooth, setIsSmooth] = useState<boolean>(false); // 曲線モードの管理
  const svgRef = useRef<SVGSVGElement>(null);

  // マウス座標取得
  const getMousePosition = (e: MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  // --- SVGパス生成ロジック (ここが重要) ---
  const generatePath = (pts: Point[], smooth: boolean): string => {
    if (pts.length < 3) return ''; // 3点未満は描画しない

    // A. 直線モード (Polygon)
    if (!smooth) {
      return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    }

    // B. 曲線モード (Quadratic Bezier Curve近似)
    // 頂点を「制御点」として扱い、頂点と頂点の中点を通る曲線を描きます
    let d = '';
    const len = pts.length;

    // 最初の始点（最後の点と最初の点の中点）
    const p0 = pts[0];
    const pLast = pts[len - 1];
    const startX = (p0.x + pLast.x) / 2;
    const startY = (p0.y + pLast.y) / 2;

    d += `M ${startX} ${startY}`;

    for (let i = 0; i < len; i++) {
      const p1 = pts[i]; // 制御点 (頂点そのもの)
      const p2 = pts[(i + 1) % len]; // 次の点
      
      // 次の終点（現在点と次点の中点）
      const endX = (p1.x + p2.x) / 2;
      const endY = (p1.y + p2.y) / 2;

      // Q = Quadratic Bezier (制御点x,y 終点x,y)
      d += ` Q ${p1.x} ${p1.y} ${endX} ${endY}`;
    }

    return d + ' Z';
  };

  // 描画更新処理
  const update = (newPoints: Point[], smooth: boolean) => {
    const d = generatePath(newPoints, smooth);
    setPoints(newPoints);
    onUpdatePath(d);
  };

  // 操作系イベント
  const handleMouseDown = (e: MouseEvent, index: number | null = null) => {
    e.stopPropagation();
    if (index !== null) {
      setDraggingIndex(index);
    } else {
      const newPoint = getMousePosition(e);
      const newPoints = [...points, newPoint];
      update(newPoints, isSmooth);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingIndex === null) return;
    const currentPoint = getMousePosition(e);
    const newPoints = [...points];
    newPoints[draggingIndex] = currentPoint;
    update(newPoints, isSmooth);
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  // 曲線/直線 切り替え
  const toggleSmooth = () => {
    const nextSmooth = !isSmooth;
    setIsSmooth(nextSmooth);
    update(points, nextSmooth); // 既存の点を維持したままパスを再計算
  };

  const handleReset = () => {
    setPoints([]);
    onUpdatePath('');
  };

  // プレビュー用のパスデータ
  const previewPath = generatePath(points, isSmooth);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={handleReset}>リセット</button>
        
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            checked={isSmooth} 
            onChange={toggleSmooth} 
            style={{ marginRight: '5px' }}
          />
          曲線にする
        </label>
      </div>

      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ccc', cursor: 'crosshair', backgroundColor: '#fff', touchAction: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={(e) => handleMouseDown(e, null)}
      >
        {/* 描画中の図形 */}
        <path
          d={previewPath}
          fill="rgba(52, 152, 219, 0.3)"
          stroke="#3498db"
          strokeWidth="2"
          style={{ transition: 'd 0.3s ease' }} // 形の変化をアニメーション
        />

        {/* 操作ハンドル（点） */}
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
            onMouseDown={(e) => handleMouseDown(e, i)}
          />
        ))}
      </svg>
    </div>
  );
};

export default ShapeEditor;