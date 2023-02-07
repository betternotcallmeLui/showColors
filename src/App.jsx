import { useState, useEffect } from 'react'
import './App.scss'

function App() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [colorsCSS, setColorsCSS] = useState('');
  const [maxColors, setMaxColors] = useState(50);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      setImage(img);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorCounts = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const key = `${r},${g},${b}`;
      if (!colorCounts[key]) {
        colorCounts[key] = 1;
      } else {
        colorCounts[key]++;
      }
    }

    const sortedColors = Object.entries(colorCounts).sort(
      (a, b) => b[1] - a[1]
    );

    const hexColors = sortedColors
      .map((color) => {
        const rgb = color[0].split(',').map(Number);
        const hex = rgb.map((c) => {
          const hexValue = c.toString(16);
          return hexValue.length === 1 ? '0' + hexValue : hexValue;
        });
        return hex.join('');
      })
      .slice(0, maxColors);

    setColors(hexColors);

    let colorCSS = '';
    hexColors.forEach((color, index) => {
      colorCSS += `--color-${index + 1}: #${color};\n`;
    });
    setColorsCSS(colorCSS);

  }, [image, maxColors]);
  
  const handleCopy = (color) => {
    navigator.clipboard.writeText(`#${color}`);
    alert('Color copiado')
  };
  return (
    <>
      <div className='input-container'>
        <input type="file" onChange={handleImageChange} id="file" />
        <label htmlFor="file" className='btn-1'>Elige un archivo</label>
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: "center",
        }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              border: "1px solid black",
              width: '100px',
              height: '50px',
              backgroundColor: `#${color}`,
              margin: '5px',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
              color: (parseInt(color, 16) > 0xffffff / 2) ? 'black' : 'white'
            }}
            className="color-container"
            onClick={() => handleCopy(color)}
          >#{color}</div>
        )
        )}
      </div>
      <pre style={{
        width: "100%",
      }}>
        {colorsCSS}
        </pre>
    </>
  )

}
export default App;