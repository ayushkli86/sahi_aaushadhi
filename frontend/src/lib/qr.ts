import QRCode from 'qrcode';

export async function generateQR(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}

export function decodeQR(data: string): string {
  // QR decoding logic - typically handled by a scanner library
  return data;
}
