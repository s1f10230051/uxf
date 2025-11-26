import { useState, useRef, useEffect } from 'react';
import { type MouseEvent } from 'react';


type Point = { x: number; y: number };

type Props = {
  width?: number;
  height?: number;
  onUpdatePath: (pathData: string) => void;
  // ▼▼▼ 追加: 外部からデータを注入するためのProps ▼▼▼
  externalPoints?: Point[];
  externalSmooth?: boolean;
};

const ShapeEditor = ({ 
  width = 300, 
  height = 300, 
  onUpdatePath, 
  externalPoints, 
  externalSmooth 
}: Props) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isSmooth, setIsSmooth] = useState<boolean>(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ▼▼▼ 追加: プリセットが選ばれたらStateを更新する処理 ▼▼▼
  useEffect(() => {
    if (externalPoints) {
      setPoints(externalPoints);
      if (typeof externalSmooth === 'boolean') {
        setIsSmooth(externalSmooth);
      }
      // パスデータも即座に更新して親に通知
      const d = generatePath(externalPoints, externalSmooth ?? false);
      onUpdatePath(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPoints, externalSmooth]); 
  // ▲▲▲ ここまで ▲▲▲

  // ... (getMousePosition 関数はそのまま)
  const getMousePosition = (e: MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  // ... (generatePath 関数はそのまま)
  const generatePath = (pts: Point[], smooth: boolean): string => {
    if (pts.length < 3) return ''; 
    if (!smooth) {
      return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    }
    // 曲線ロジック
    let d = '';
    const len = pts.length;
    const p0 = pts[0];
    const pLast = pts[len - 1];
    const startX = (p0.x + pLast.x) / 2;
    const startY = (p0.y + pLast.y) / 2;
    d += `M ${startX} ${startY}`;
    for (let i = 0; i < len; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % len];
      const endX = (p1.x + p2.x) / 2;
      const endY = (p1.y + p2.y) / 2;
      d += ` Q ${p1.x} ${p1.y} ${endX} ${endY}`;
    }
    return d + ' Z';
  };

  // ... (update 関数やハンドラはそのまま)
  const update = (newPoints: Point[], smooth: boolean) => {
    const d = generatePath(newPoints, smooth);
    setPoints(newPoints);
    onUpdatePath(d);
  };

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

  const toggleSmooth = () => {
    const nextSmooth = !isSmooth;
    setIsSmooth(nextSmooth);
    update(points, nextSmooth);
  };

  const handleReset = () => {
    setPoints([]);
    onUpdatePath('');
  };

  const previewPath = generatePath(points, isSmooth);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={handleReset}>クリア</button>
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
        <path
          d={previewPath}
          fill="rgba(52, 152, 219, 0.3)"
          stroke="#3498db"
          strokeWidth="2"
          style={{ transition: 'd 0.3s ease' }}
        />
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