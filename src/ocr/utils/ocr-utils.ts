import * as fs from 'fs';
import * as path from 'path';
import * as vision from '@google-cloud/vision';
import { extraerDatosDesdePDF } from './pdf-to-image';

// Cliente OCR de Google
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.resolve(process.cwd(), 'credentials.json'),
});

export async function detectOCR(ruta: string) {
  const extension = path.extname(ruta).toLowerCase();
  const rutaAbsoluta = path.resolve(process.cwd(), ruta);
  console.log('🛣️ Buscando archivo en:', rutaAbsoluta);

  if (!fs.existsSync(rutaAbsoluta)) {
    throw new Error(`⚠️ Archivo no encontrado: ${rutaAbsoluta}`);
  }

  if (extension === '.pdf') {
    return await extraerDatosDesdePDF(rutaAbsoluta);
  }

  const imageBuffer = fs.readFileSync(rutaAbsoluta);

  const [result] = await client.documentTextDetection({
    image: { content: imageBuffer },
  });

  const texto = result.fullTextAnnotation?.text ?? '';

  return extraerCampos(texto);
}

function extraerCampos(texto: string) {
  // Igual que en Python: busca número precedido por contexto
  const factura =
    texto.match(
      /(?:Factura\s*N[°º]?|Nº Autorización|No[.:]?)\D*(\d{3}-\d{3}-\d{6,9})/,
    )?.[1] ??
    texto.match(/\d{3}-\d{3}-\d{6,9}/)?.[0] ??
    null;

  const ruc = texto.match(/\b\d{13}\b/)?.[0] ?? null;
  const fecha = texto.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] ?? null;
  const total =
    texto.match(/Valor Total[^\d]*(\d+[.,]\d{2})/)?.[1]?.replace(',', '.') ??
    null;

  return {
    numero_factura: factura,
    ruc,
    fecha_emision: fecha,
    valor_total: total,
    texto_completo: texto.substring(0, 300),
  };
}
