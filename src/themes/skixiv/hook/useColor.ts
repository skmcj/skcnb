interface RGB {
  r: number;
  g: number;
  b: number;
}

const rgbs: RGB[] = [
  { r: 153, g: 188, b: 172 },
  { r: 238, g: 121, b: 89 },
  { r: 139, g: 112, b: 66 },
  { r: 167, g: 98, b: 131 },
  { r: 190, g: 177, b: 170 },
  { r: 229, g: 168, b: 75 },
  { r: 192, g: 214, b: 149 },
  { r: 169, g: 190, b: 123 },
  { r: 119, g: 150, b: 73 },
  { r: 186, g: 91, b: 73 },
  { r: 246, g: 190, b: 200 },
  { r: 240, g: 145, b: 160 },
  { r: 250, g: 192, b: 61 },
  { r: 154, g: 167, b: 177 },
  { r: 199, g: 198, b: 182 },
  { r: 188, g: 131, b: 107 },
  { r: 0, g: 113, b: 117 },
  { r: 40, g: 72, b: 82 },
  { r: 121, g: 131, b: 108 },
  { r: 210, g: 163, b: 108 },
  { r: 195, g: 217, b: 78 },
  { r: 110, g: 155, b: 197 },
  { r: 65, g: 130, b: 164 },
  { r: 61, g: 142, b: 134 }
];

const rgbCount = rgbs.length - 1;

/**
 * 获取随机RGB颜色字符串
 * @param {number} a 不透明度，默认为 1
 * @returns {string} rgb(red, green, blue)
 */
export const randomRGB = (a: number = 1) => {
  const t = Math.round(Math.random() * rgbCount);
  const rgb = rgbs[t];
  return a < 1 ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})` : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

export const randomRGBP = () => {
  const t = Math.round(Math.random() * rgbCount);
  const rgb = rgbs[t];
  return {
    origin: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    alpha: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
  };
};
