type Props = {
  pathData: string; // エディタで作られた "M 10 10 L..." という文字列
  color: string;    // ピッカーで選ばれた色
};

const SvgShapeDisplay = ({ pathData, color }: Props) => {
  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      {/* パスデータがある場合のみSVGを表示 */}
      {pathData ? (
        <svg width="300" height="300" style={{ border: '1px dashed #ccc' }}>
          <path
            d={pathData}
            fill={color}        // ここで色が反映される！
            stroke="none"       // 枠線（あってもなくてもOK）
            strokeWidth="20"
            style={{ transition: 'fill 0.3s ease' }} // 色の変化を滑らかに
          />
        </svg>
      ) : (
        // パスデータがない時の案内
        <div style={{ 
          width: '300px', 
          height: '300px', 
          border: '1px dashed #ccc', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#aaa'
        }}>
          左のエディタで図形を描いてください
        </div>
      )}
    </div>
  );
};

export default SvgShapeDisplay;