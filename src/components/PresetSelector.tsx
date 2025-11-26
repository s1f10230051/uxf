// 座標の型（ShapeEditorと同じ）
type Point = { x: number; y: number };

type Preset = {
  name: string;
  points: Point[];     // エディタに渡す座標データ
  isSmooth: boolean;   // 最初から曲線モードにするかどうか
  iconPath: string;    // ボタン表示用の簡易アイコン
};

type Props = {
  onSelect: (points: Point[], isSmooth: boolean) => void;
};

const PresetSelector = ({ onSelect }: Props) => {
  const presets: Preset[] = [
    {
      name: '四角形',
      isSmooth: false,
      // 四角形の4頂点
      points: [{x: 50, y: 50}, {x: 250, y: 50}, {x: 250, y: 250}, {x: 50, y: 250}],
      iconPath: 'M 50 50 L 250 50 L 250 250 L 50 250 Z'
    },
    {
      name: '三角形',
      isSmooth: false,
      // 三角形の3頂点
      points: [{x: 150, y: 50}, {x: 250, y: 250}, {x: 50, y: 250}],
      iconPath: 'M 150 50 L 250 250 L 50 250 Z'
    },
    {
      name: '円形 (編集可)',
      isSmooth: true, // これは最初から「曲線モード」にする
      // 円として編集しやすいよう、8角形の座標を定義
      points: [
        {x: 150, y: 50}, {x: 221, y: 79}, {x: 250, y: 150}, {x: 221, y: 221},
        {x: 150, y: 250}, {x: 79, y: 221}, {x: 50, y: 150}, {x: 79, y: 79}
      ],
      iconPath: 'M 150 50 A 100 100 0 1 1 150 250 A 100 100 0 1 1 150 50 Z'
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
      {presets.map((preset) => (
        <button
          key={preset.name}
          // クリック時に座標データと曲線フラグを渡す
          onClick={() => onSelect(preset.points, preset.isSmooth)}
          style={{
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '5px',
            cursor: 'pointer',
            width: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          title={`${preset.name}を読み込む`}
        >
          <svg width="40" height="40" viewBox="0 0 300 300">
            <path d={preset.iconPath} fill="#aaa" stroke="none" />
          </svg>
          <span style={{ fontSize: '10px', marginTop: '4px' }}>{preset.name}</span>
        </button>
      ))}
    </div>
  );
};

export default PresetSelector;