import React from 'react';

// 'circle', 'square', 'triangle' の3種類を受け取る
type ShapeType = 'circle' | 'square' | 'triangle';

type ShapeDisplayProps = {
  color: string;
  shapeType: ShapeType; // 'shapeType' を props として受け取る
};

const ShapeDisplay = ({ color, shapeType }: ShapeDisplayProps) => {
  // 共通のベーススタイル
  const baseStyle: React.CSSProperties = {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    margin: '20px auto',
  };

  // shapeType に応じてスタイルを切り替える
  const getShapeStyle = (): React.CSSProperties => {
    switch (shapeType) {
      case 'circle':
        return {
          ...baseStyle,
          width: '150px',
          height: '150px',
          backgroundColor: color,
          borderRadius: '50%', // 円
        };
      
      case 'triangle': // トゲトゲの形
        return {
          ...baseStyle,
          width: '150px',
          height: '150px',
          backgroundColor: color,
          clipPath: 'polygon(50% 0%, 58% 26%, 79% 10%, 70% 35%, 98% 35%, 75% 50%, 98% 66%, 70% 65%, 79% 91%, 58% 74%, 50% 100%, 42% 74%, 21% 91%, 30% 65%, 2% 66%, 25% 50%, 2% 35%, 30% 35%, 21% 10%, 42% 26%)',
        };

      case 'square':
      default:
        return {
          ...baseStyle,
          width: '150px',
          height: '150px',
          backgroundColor: color,
          borderRadius: '12px', // 角丸四角形
        };
    }
  };

  const shapeStyle = getShapeStyle();

  return (
    <div>
      <h3>図形: {shapeType}</h3>
      <div style={shapeStyle}></div>
      <p>色: <strong>{color}</strong></p>
    </div>
  );
};

export default ShapeDisplay;