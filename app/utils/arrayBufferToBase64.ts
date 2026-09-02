export default function arrayBufferToBase64Legacy(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++)
    binary += String.fromCharCode(bytes[i]!);
  
  return btoa(binary);
}