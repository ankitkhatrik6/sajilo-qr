<div align="center">

# sajilo-qr

[![npm version](https://img.shields.io/npm/v/sajilo-qr.svg?style=flat-square)](https://www.npmjs.com/package/sajilo-qr)
[![npm downloads](https://img.shields.io/npm/dm/sajilo-qr.svg?style=flat-square)](https://www.npmjs.com/package/sajilo-qr)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**sajilo-qr** is a simple, predictable, and lightweight QR code generation library for JavaScript and TypeScript.<br/>
The library is built with one philosophy: generating QR codes should be effortless, dependable, and require zero boilerplate for common use cases.

</div>


---

## Features

- **Dead-simple API**: Generate a browser-ready QR code in one line of code.
- **Sensible Defaults**: Zero configuration required for normal usage.
- **Multiple Output Formats**: Data URL (PNG), scalable SVG, and HTML Canvas.
- **Dual Module Support**: Full ESM (`import`) and CommonJS (`require`) compatibility.
- **First-class TypeScript**: Accurate type declarations included out of the box.
- **Robust Validation**: Helpful, human-readable error messages for bad inputs.
- **Lightweight & Reliable**: Built on top of the battle-tested `qrcode` core.

---

## Installation

```bash
npm install sajilo-qr
```

Or using yarn / pnpm / bun:

```bash
# Yarn
yarn add sajilo-qr

# pnpm
pnpm add sajilo-qr

# Bun
bun add sajilo-qr
```

---

## Quick Start

```typescript
import { sajilo } from 'sajilo-qr';

// Generates a browser-ready Data URL (PNG)
const qr = await sajilo.generate('https://example.com');

console.log(qr);
// data:image/png;base64,iVBORw0KGgoAAA...
```

---

## Browser Usage

### Using with an `<img>` Tag

```html
<img id="qr-code" alt="QR Code" />

<script type="module">
  import { sajilo } from 'sajilo-qr';

  const qrUrl = await sajilo.generate('https://example.com');
  document.querySelector('#qr-code').src = qrUrl;
</script>
```

### Rendering Directly to `<canvas>`

```html
<canvas id="qr-canvas"></canvas>

<script type="module">
  import { sajilo } from 'sajilo-qr';

  const canvas = document.getElementById('qr-canvas');
  await sajilo.toCanvas(canvas, 'https://example.com', {
    size: 300,
    margin: 2
  });
</script>
```

---

## API Reference

### `sajilo.generate(data, options?)`

Primary generation method. Returns a Promise resolving to a PNG Data URL string.

```typescript
const qr = await sajilo.generate('https://example.com', {
  size: 350,
  margin: 3,
  dark: '#0f172a',
  light: '#f8fafc',
  errorCorrection: 'H'
});
```

- **`data`** (`string`, required): The text or URL to encode into the QR code.
- **`options`** (`SajiloOptions`, optional): Configuration options.
- **Returns**: `Promise<string>` (Data URL starting with `data:image/png;base64,`).

---

### `sajilo.toDataURL(data, options?)`

Explicit alias for generating a PNG Data URL string.

```typescript
const dataUrl = await sajilo.toDataURL('Hello Nepal');
```

- **Returns**: `Promise<string>` (Data URL).

---

### `sajilo.toSVG(data, options?)`

Generates clean, scalable SVG markup as a string. Ideal for responsive vector icons, printing, or server-side SVG injection.

```typescript
const svgString = await sajilo.toSVG('https://sajilo.dev', {
  size: 250,
  dark: '#1e3a8a',
  light: '#ffffff'
});

// Output: <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" ...>
```

- **Returns**: `Promise<string>` (Raw SVG markup string).

---

### `sajilo.toCanvas(canvas, data, options?)`

Draws the QR code directly onto a provided HTML `<canvas>` element.

```typescript
const canvas = document.querySelector('#my-canvas');
await sajilo.toCanvas(canvas, 'https://example.com');
```

- **`canvas`** (`HTMLCanvasElement`, required): The target canvas element.
- **`data`** (`string`, required): The text or URL to encode.
- **`options`** (`SajiloOptions`, optional): Configuration options.
- **Returns**: `Promise<HTMLCanvasElement | void>`.

*Note: `toCanvas` requires a browser environment or a compatible canvas implementation.*

---

## Options

All options are optional and have sensible defaults.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `number` | `300` | Width and height in pixels. Must be a positive number. |
| `margin` | `number` | `2` | Quiet zone margin around the QR code in modules. Must be >= 0. |
| `dark` | `string` | `"#000000"` | Hex or CSS color string for the dark modules. |
| `light` | `string` | `"#ffffff"` | Hex or CSS color string for the light modules / background. |
| `errorCorrection` | `"L" \| "M" \| "Q" \| "H"` | `"M"` | Error correction redundancy level. |

### Error Correction Levels

- **`"L"`** (Low): ~7% of codewords can be restored.
- **`"M"`** (Medium - Default): ~15% of codewords can be restored.
- **`"Q"`** (Quartile): ~25% of codewords can be restored.
- **`"H"`** (High): ~30% of codewords can be restored.

---

## Error Handling

`sajilo-qr` performs strict input validation and throws a clear, descriptive `SajiloError`:

```typescript
import { sajilo, SajiloError } from 'sajilo-qr';

try {
  await sajilo.generate('', { size: -100 });
} catch (err) {
  if (err instanceof SajiloError) {
    console.error(err.message);
    // e.g. 'Sajilo QR: QR data is required.'
    // e.g. 'Sajilo QR: "size" must be a positive number.'
  }
}
```

### Common Error Messages

- `Sajilo QR: QR data is required.` : Data argument is missing or empty.
- `Sajilo QR: QR data must be a string.` : Data argument is not a string.
- `Sajilo QR: "size" must be a positive number.` : Negative, zero, or non-number size.
- `Sajilo QR: "margin" must be a non-negative number.` : Negative margin.
- `Sajilo QR: "dark" must be a valid color string.` : Invalid dark color string.
- `Sajilo QR: "light" must be a valid color string.` : Invalid light color string.
- `Sajilo QR: "errorCorrection" must be one of "L", "M", "Q", or "H".` : Invalid recovery level.
- `Sajilo QR: Target canvas element is required.` : Canvas parameter missing in `toCanvas`.

---

## Environment Compatibility

| Environment | `generate()` | `toDataURL()` | `toSVG()` | `toCanvas()` |
| :--- | :---: | :---: | :---: | :---: |
| **Node.js (>= 18)** | Yes | Yes | Yes | Canvas DOM required |
| **Browsers (Chrome, Firefox, Safari, Edge)** | Yes | Yes | Yes | Yes |
| **Deno / Bun** | Yes | Yes | Yes | Canvas DOM required |

---

## Examples

### Node.js (CommonJS)

```javascript
const { sajilo } = require('sajilo-qr');

async function main() {
  const qr = await sajilo.generate('https://example.com');
  console.log('Generated Data URL:', qr.slice(0, 40) + '...');
}

main();
```

### Node.js (ES Modules)

```javascript
import { sajilo } from 'sajilo-qr';

const svg = await sajilo.toSVG('https://example.com', {
  size: 200,
  dark: '#2563eb'
});

console.log(svg);
```

---

## License

MIT (c) [Ankit Khatri KC](LICENSE)
