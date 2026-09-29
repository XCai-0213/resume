const fs = require('fs');
// Check all PDFs on the server to find when it last worked
const files = ['/tmp/diag.pdf', '/tmp/good.pdf', '/tmp/fix.pdf'];
for (const f of files) {
  try {
    const b = fs.readFileSync(f);
    const s = b.toString('latin1');
    const pages = (s.match(/\/Type\s*\/Page\b/g) || []).length;
    const fonts = (s.match(/FontFile2|FontFile3/g) || []).length;
    const cjk = s.includes('CIDFont');
    const st = fs.statSync(f);
    console.log(`${f.padEnd(16)} ${st.size} bytes  pages=${pages} fonts=${fonts} CJK=${cjk}  mtime=${st.mtime.toISOString()}`);
  } catch (e) {
    console.log(`${f}: ${e.message}`);
  }
}
