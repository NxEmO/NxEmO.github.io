// Damped finite-difference wave equation, sampled in CSS pixels.
// Independent implementation; no code from the reference site's bundle is included.
export class WaveField {
  readonly columns: number;
  readonly rows: number;
  readonly cellSize: number;
  readonly pixels: Uint8Array;
  current: Float32Array;
  private previous: Float32Array;
  private absorption: Float32Array;
  private remainder = 0;

  constructor(width: number, height: number) {
    this.cellSize = Math.max(5, Math.sqrt(width * height / 90_000));
    this.columns = Math.max(3, Math.ceil(width / this.cellSize) + 1);
    this.rows = Math.max(3, Math.ceil(height / this.cellSize) + 1);
    const length = this.columns * this.rows;
    this.current = new Float32Array(length);
    this.previous = new Float32Array(length);
    this.absorption = new Float32Array(length);
    this.pixels = new Uint8Array(length * 4);
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const edge = Math.min(x, y, this.columns - 1 - x, this.rows - 1 - y);
        this.absorption[y * this.columns + x] = Math.exp(-1.1 / 120 - Math.max(0, 1 - edge / 12) ** 2 * .2);
      }
    }
    this.encode();
  }

  disturb(x: number, y: number, strength: number, radius = 12) {
    if (![x, y, strength, radius].every(Number.isFinite) || radius <= 0) return;
    const cx = x / this.cellSize;
    const cy = y / this.cellSize;
    const spread = radius / this.cellSize;
    const reach = Math.ceil(spread * 3);
    for (let row = Math.max(1, Math.floor(cy) - reach); row < Math.min(this.rows - 1, cy + reach); row++) {
      for (let col = Math.max(1, Math.floor(cx) - reach); col < Math.min(this.columns - 1, cx + reach); col++) {
        const distance = ((col - cx) ** 2 + (row - cy) ** 2) / (2 * spread * spread);
        const index = row * this.columns + col;
        const amount = -strength * Math.exp(-distance);
        // Displace both time slices to avoid injecting a frame-rate-dependent velocity.
        this.current[index] += amount;
        this.previous[index] += amount;
      }
    }
  }

  step(seconds: number) {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    this.remainder += Math.min(seconds, .05);
    const dt = 1 / 120;
    const coefficient = (170 * dt / this.cellSize) ** 2;
    while (this.remainder + 1e-9 >= dt) {
      const a = this.current;
      const b = this.previous;
      const stride = this.columns;
      for (let y = 1; y < this.rows - 1; y++) {
        for (let x = 1; x < stride - 1; x++) {
          const i = y * stride + x;
          const laplacian = a[i - 1] + a[i + 1] + a[i - stride] + a[i + stride] - 4 * a[i];
          b[i] = (2 * a[i] - b[i] + coefficient * laplacian) * this.absorption[i];
        }
      }
      this.current = b;
      this.previous = a;
      this.remainder -= dt;
    }
    this.encode();
  }

  private encode() {
    for (let i = 0; i < this.current.length; i++) {
      const encoded = Math.round((Math.max(-4, Math.min(4, this.current[i])) / 8 + .5) * 65535);
      this.pixels[i * 4] = encoded >> 8;
      this.pixels[i * 4 + 1] = encoded & 255;
      this.pixels[i * 4 + 2] = 0;
      this.pixels[i * 4 + 3] = 255;
    }
  }
}
