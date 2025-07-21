import { execSync } from 'child_process';
import * as path from 'path';

export async function extraerDatosDesdePDF(pdfPath: string): Promise<any> {
  const rutaAbsoluta = path.resolve(pdfPath);

  try {
    const buffer = execSync(`python ocr_pdf.py "${rutaAbsoluta}"`);
    const resultado = JSON.parse(buffer.toString());
    return resultado;
  } catch (err) {
    console.error('❌ Error ejecutando ocr_pdf.py:', err.message);
    throw new Error('OCR Python falló');
  }
}
