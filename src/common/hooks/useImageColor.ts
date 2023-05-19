
const CHANNELS = 4;
const DEFAULT_SETTINGS = {
  colors: 5,
  cors: false,
  windowSize: 50,
};

const chunk = (original: Uint8ClampedArray, chunkSize = 4) => {
  const data = [];

  for (let i = 0; i < original.length; i += chunkSize * DEFAULT_SETTINGS.windowSize) {
    data.push(original.slice(i, i + chunkSize));
  }

  return data;
}

const mapToHex = (values: Uint8ClampedArray) => {
  let str = "#";
  values.forEach((value: any) => {
    const h = value.toString(16);
    const a = ((h.length === 1) ? `0${h}` : `${h}`);
    str += a;
  });
  return str;
};

export default function getMostCommonColor(src: string, assetName: string) {
  const settings = { ...DEFAULT_SETTINGS };

  const canvas = document.createElement('canvas');
  const img = document.createElement('img');
  const context = canvas.getContext('2d');

  if (settings.cors) {
    img.setAttribute('crossOrigin', '');
  }

  img.crossOrigin = "Anonymous";
  img.src = src;

  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    context?.drawImage(img, 0, 0);
    const imageData = context?.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    if (imageData) {
      const { data } = imageData;
      const hexColors = chunk(data, CHANNELS).map(mapToHex)
      const colorsMap: { [k: string]: number } = {};
      let mostCommonColor: string = "";
      let mostCommonColorCount = 0;
      hexColors.forEach(color => {
        if (color !== "#00000000") {
          if (color in colorsMap) {
            const count = colorsMap[color];
            colorsMap[color] = count + 1;
          } else {
            colorsMap[color] = 1;
          }

          if (colorsMap[color] > mostCommonColorCount) {
            mostCommonColor = color;
            mostCommonColorCount = colorsMap[color];
          }
        }
      });
      console.log(`COIN:"${assetName}" : "${mostCommonColor}",`)
    }
  };
}