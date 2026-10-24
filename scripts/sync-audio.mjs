import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

// Extrai dinamicamente as palavras do worldsData.ts
function extractItemsFromData() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'worldsData.ts');
  const content = fs.readFileSync(dataPath, 'utf-8');
  
  const items = [];
  const regex = /id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*displayName:\s*['"]([^'"]+)['"],\s*syllables:\s*\[([^\]]+)\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    const displayName = match[3];
    const syllables = match[4]
      .split(',')
      .map((s) => s.replace(/['"\s]/g, ''))
      .filter(Boolean);

    items.push({ id, name, displayName, syllables });
  }
  return items;
}

async function generateClip(tts, text, filePath) {
  const { audioStream } = tts.toStream(text);
  await pipeline(audioStream, fs.createWriteStream(filePath));
}

async function main() {
  console.log('⚡ SINCRONIZADOR DE ÁUDIOS NEURAIS (Soletrando o Mundo)');

  const itemsDir = path.join(process.cwd(), 'public', 'audio', 'items');
  fs.mkdirSync(itemsDir, { recursive: true });

  let tts = null;
  const getTTS = async () => {
    if (!tts) {
      tts = new MsEdgeTTS();
      await tts.setMetadata('pt-BR-FranciscaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    }
    return tts;
  };

  const items = extractItemsFromData();
  console.log(`📦 Encontrados ${items.length} objetos para áudio...`);

  let generated = 0;
  for (const item of items) {
    const dest = path.join(itemsDir, `${item.name}.mp3`);
    if (fs.existsSync(dest)) {
      continue;
    }

    const spokenText = `${item.name}!`;
    process.stdout.write(`  + Gerando áudio de "${item.name}"... `);
    const activeTTS = await getTTS();
    await generateClip(activeTTS, spokenText, dest);
    console.log('OK');
    generated++;
  }

  if (tts) tts.close();
  console.log(`✨ Concluído! ${generated} novos áudios gerados.`);
}

main().catch((err) => {
  console.error('Erro na geração de áudio:', err);
  process.exit(1);
});
