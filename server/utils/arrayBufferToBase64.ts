export default function arrayBufferToBase64Legacy(buffer: ArrayBuffer) {
  // Convert the ArrayBuffer to a Uint8Array
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;

  // Manually convert bytes to a string of characters
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  // Use the standard btoa() function to encode the binary string to base64
  return btoa(binary);
}