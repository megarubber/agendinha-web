export default function openMap(lat: number, long: number): void {
    window.location.href = `https://www.google.com/maps?q=${lat},${long}`;
}