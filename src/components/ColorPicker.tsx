import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';

type ColorPickerProps = {
  color: string;
  onChange: (newColor: string) => void;
};

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const handleChangeComplete = (newColor: ColorResult) => {
    onChange(newColor.hex);
  };

  return (
    <div>
      <SketchPicker
        color={color}
        onChangeComplete={handleChangeComplete}
      />
    </div>
  );
};

export default ColorPicker;