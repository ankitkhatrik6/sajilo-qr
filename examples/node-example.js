/**
 * Sajilo QR - Node.js usage example (CJS and ESM compatible)
 */
const { sajilo } = require('../dist/index.js');

async function main() {
  console.log('Generating QR code the Sajilo way...\n');

  // 1. Basic generation (defaults to Data URL)
  const defaultQr = await sajilo.generate('https://example.com');
  console.log('Default Data URL generated (length:', defaultQr.length, 'chars)');
  console.log('Prefix:', defaultQr.slice(0, 35) + '...\n');

  // 2. Custom configuration
  const customQr = await sajilo.generate('Hello Nepal', {
    size: 400,
    margin: 3,
    dark: '#0f172a',
    light: '#f8fafc',
    errorCorrection: 'H',
  });
  console.log('Custom QR Data URL generated (length:', customQr.length, 'chars)\n');

  // 3. Scalable SVG output
  const svgOutput = await sajilo.toSVG('https://sajilo.dev', {
    size: 250,
    dark: '#1e3a8a',
  });
  console.log('SVG QR generated:');
  console.log(svgOutput.slice(0, 120) + '...\n');

  console.log('Success! Sajilo (सजिलो) means simple and easy in Nepali.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
