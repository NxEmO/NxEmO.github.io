import { WaveField } from "./wave-field.ts";

// A WebGL 1 surface driven by a damped two-dimensional wave field.
// No external assets or rendering dependencies are required.
// Leave room for surface controls within WebGL 1's minimum uniform budget.
export const MAX_RIPPLES = 10;
export const RIPPLE_LIFETIME = 4.8;

export function surfaceEffects(preferences: { water?: string; rain?: string }) {
  return { water: preferences.water !== "off", rain: preferences.rain === "on" };
}

export class WaterClock {
  time = 0;
  private lastFrame: number | null = null;
  private lastTick: number | null = null;

  pause() { this.lastFrame = null; this.lastTick = null; }

  step(now: number, fps: number) {
    const interval = 1000 / fps;
    const elapsed = this.lastFrame === null ? interval : now - this.lastFrame;
    if (elapsed < interval - 1) return null;
    const delta = this.lastTick === null ? interval : now - this.lastTick;
    // Retain the fractional scheduling remainder on 90/144/165 Hz displays.
    this.lastFrame = this.lastFrame === null ? now :
      this.lastFrame + Math.max(1, Math.floor((elapsed + 1) / interval)) * interval;
    this.lastTick = now;
    this.time += Math.min(delta / 1000, 0.05);
    return this.time;
  }
}

export function coverScale(width: number, height: number, imageWidth: number, imageHeight: number) {
  const scale = Math.max(width / imageWidth, height / imageHeight);
  return [width / (imageWidth * scale), height / (imageHeight * scale)] as const;
}

export class RipplePool {
  readonly values = new Float32Array(MAX_RIPPLES * 4);
  private cursor = 0;

  constructor() { this.clear(); }

  clear() {
    this.values.fill(0);
    for (let i = 0; i < MAX_RIPPLES; i++) this.values[i * 4 + 2] = -100;
    this.cursor = 0;
  }

  add(x: number, y: number, time: number, strength: number) {
    if (![x, y, time, strength].every(Number.isFinite)) return;
    this.values.set([x, y, time, strength], this.cursor * 4);
    this.cursor = (this.cursor + 1) % MAX_RIPPLES;
  }
}

const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentSource = `
varying vec2 vUv;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform float uTime;
uniform vec2 uEffects;
uniform sampler2D uWave;
uniform vec2 uFieldSize;
uniform float uCellSize;
uniform vec3 uPageColor;

float hash21(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

// Each bead is a lens with a rounded head and a wet trail above it.
// Returned xy refracts the wallpaper; z limits softness to wet glass, w catches light.
vec4 fallingDrops(vec2 pixel, float time, float scale, float seed) {
  vec2 cellSize = vec2(100.0, 180.0) * scale;
  vec2 grid = pixel / cellSize;
  float column = floor(grid.x);
  float phase = hash21(vec2(column, seed));
  grid.y -= time * (0.12 + phase * 0.13) + phase * 8.0;
  vec2 id = floor(grid);
  float random = hash21(id + seed);
  vec2 q = fract(grid) - 0.5;
  float center = (random - 0.5) * 0.62 + sin(time * 0.8 + phase * 6.28) * 0.025;
  vec2 ellipse = vec2((q.x - center) / (0.065 + random * 0.04), q.y / 0.065);
  float radius = length(ellipse);
  float mask = 1.0 - smoothstep(0.74, 1.0, radius);
  float height = sqrt(max(0.0, 1.0 - dot(ellipse, ellipse)));
  vec2 normal = ellipse * height * mask;
  float trail = (1.0 - smoothstep(0.012, 0.035, abs(q.x - center)));
  trail *= smoothstep(-0.45, -0.15, q.y) * (1.0 - smoothstep(-0.10, -0.03, q.y));
  // A broken thin film follows the sliding head instead of a drawn rain streak.
  trail *= 0.35 + 0.65 * (1.0 - smoothstep(0.2, 0.48, abs(fract(q.y * 19.0 + random) - 0.5)));
  float light = mask * (-normal.x * 0.10 - normal.y * 0.15) + trail * 0.012;
  return vec4(normal * (15.0 * scale) + vec2(trail * 1.5, 0.0), max(mask, trail * 0.3), light);
}

vec4 restingDrops(vec2 pixel, float time) {
  vec2 grid = pixel / 38.0;
  vec2 id = floor(grid);
  float random = hash21(id + 17.0);
  vec2 center = vec2(random, hash21(id + 43.0)) * 0.7 + 0.15;
  vec2 q = (fract(grid) - center) / (0.035 + random * 0.045);
  float radius = length(q);
  float pulse = 0.6 + 0.4 * sin(time * 0.23 + random * 6.28);
  float mask = (1.0 - smoothstep(0.65, 1.0, radius)) * step(0.42, random) * pulse;
  vec2 normal = q * sqrt(max(0.0, 1.0 - dot(q, q))) * mask;
  return vec4(normal * 5.0, mask, (-normal.x - normal.y) * 0.12);
}

float heightAt(vec2 p) {
  vec2 uv = (p / uCellSize + 0.5) / uFieldSize;
  vec2 channels = texture2D(uWave, clamp(uv, 0.0, 1.0)).rg;
  return (dot(channels, vec2(65280.0, 255.0)) / 65535.0 - 0.5) * 8.0;
}

vec2 slopeAt(vec2 p) {
  return vec2(heightAt(p + vec2(uCellSize, 0.0)) - heightAt(p - vec2(uCellSize, 0.0)),
              heightAt(p + vec2(0.0, uCellSize)) - heightAt(p - vec2(0.0, uCellSize)));
}

vec2 bendAt(vec2 p) {
  vec2 slope = slopeAt(p);
  float energy = clamp(length(slope) * 7.0 + abs(heightAt(p)) * 1.8, 0.0, 1.0);
  return clamp(slope * vec2(38.0, 28.0) * energy, -18.0, 18.0);
}

void main() {
  vec2 pixel = vUv * uResolution;
  // Continuous refraction without square cells or a visible grid.
  vec2 displacement = -bendAt(pixel) * uEffects.x;
  vec2 waterDisplacement = displacement;
  vec4 drops = vec4(0.0);
  if (uEffects.y > 0.5) {
    drops = fallingDrops(pixel, uTime, 1.0, 3.7)
          + fallingDrops(pixel + vec2(47.0, 93.0), uTime, 0.68, 9.1)
          + restingDrops(pixel, uTime);
    displacement += drops.xy;
  }

  // Match CSS background-size: cover and background-position: center top exactly.
  vec2 uv = (vUv + displacement / uResolution) * uCover;
  uv.x += (1.0 - uCover.x) * 0.5;
  vec3 color = texture2D(uImage, clamp(uv, 0.001, 0.999)).rgb;
  // Keep dry parts of the image sharp; only a water-covered pixel gets softened.
  if (drops.z > 0.01) {
    vec2 soft = uCover / uResolution * 1.2;
    vec3 wet = (texture2D(uImage, clamp(uv + soft, 0.001, 0.999)).rgb
              + texture2D(uImage, clamp(uv - soft, 0.001, 0.999)).rgb) * 0.5;
    color = mix(color, wet, min(drops.z, 1.0) * 0.25);
    color += drops.w;
  }

  if (uEffects.x > 0.5) {
    float crest = heightAt(pixel);
    float glow = clamp(abs(crest) * 0.12 + length(slopeAt(pixel)) * 0.08, 0.0, 0.08);
    vec3 crestColor = crest > 0.0 ? vec3(0.84, 0.91, 1.0) : uPageColor * 0.45;
    color = mix(color, crestColor, glow);

    // Sparse drifting stars replace the former regular all-over dot pattern.
    vec2 stars = pixel + vec2(uTime * 0.7, uTime * 0.3) + waterDisplacement * 0.6;
    vec2 cell = floor(stars / 85.0);
    float seed = hash21(cell);
    vec2 star = (vec2(seed, hash21(cell + 13.0)) * 0.8 + 0.1) * 85.0;
    float starMask = 1.0 - smoothstep(0.5, 1.7, length(mod(stars, 85.0) - star));
    color = mix(color, vec3(0.88, 0.93, 1.0), starMask * (0.4 + 0.2 * sin(uTime + seed * 20.0)));
  }
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

export function createWaterRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const gl = canvas.getContext("webgl", {
    alpha: false, antialias: false, depth: false, stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let texture: WebGLTexture | null = null;
  let waveTexture: WebGLTexture | null = null;
  let field = new WaveField(1, 1);
  let lastTime: number | null = null;
  const seen = new Float64Array(MAX_RIPPLES).fill(-Infinity);
  const dispose = () => {
    if (texture) gl.deleteTexture(texture);
    if (waveTexture) gl.deleteTexture(waveTexture);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
  };

  try {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Water shader is unavailable");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Water shader could not compile");
      return shader;
    };
    program = gl.createProgram();
    if (!program) throw new Error("Water program is unavailable");
    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ? "highp" : "mediump";
    gl.attachShader(program, compile(gl.VERTEX_SHADER, `precision ${precision} float;\n${vertexSource}`));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, `precision ${precision} float;\n${fragmentSource}`));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Water program could not link");
    gl.useProgram(program);

    buffer = gl.createBuffer();
    texture = gl.createTexture();
    if (!buffer || !texture) throw new Error("Water resources are unavailable");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    if (gl.getError() !== gl.NO_ERROR) throw new Error("Water image could not be uploaded");
    gl.uniform1i(gl.getUniformLocation(program, "uImage"), 0);
    const resolution = gl.getUniformLocation(program, "uResolution");
    const cover = gl.getUniformLocation(program, "uCover");
    const time = gl.getUniformLocation(program, "uTime");
    const effects = gl.getUniformLocation(program, "uEffects");
    const fieldSize = gl.getUniformLocation(program, "uFieldSize");
    const cellSize = gl.getUniformLocation(program, "uCellSize");
    const pageColor = gl.getUniformLocation(program, "uPageColor");
    waveTexture = gl.createTexture();
    if (!waveTexture) throw new Error("Wave texture is unavailable");
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, waveTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, "uWave"), 1);

    return {
      resize(width: number, height: number, pixelRatio: number) {
        canvas.width = Math.max(1, Math.round(width * pixelRatio));
        canvas.height = Math.max(1, Math.round(height * pixelRatio));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, width, height);
        gl.uniform2fv(cover, coverScale(width, height, image.naturalWidth, image.naturalHeight));
        field = new WaveField(width, height);
        lastTime = null;
        seen.fill(-Infinity);
        gl.uniform2f(fieldSize, field.columns, field.rows);
        gl.uniform1f(cellSize, field.cellSize);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, field.columns, field.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, field.pixels);
      },
      render(seconds: number, values: Float32Array, enabled: { water: boolean; rain: boolean }, background = [0.95, 0.94, 0.96]) {
        for (let i = 0; i < MAX_RIPPLES; i++) {
          const offset = i * 4;
          if (values[offset + 3] > 0 && values[offset + 2] !== seen[i]) {
            if (enabled.water) field.disturb(values[offset], values[offset + 1], values[offset + 3], values[offset + 3] > 1 ? 8 : 12);
            seen[i] = values[offset + 2];
          }
        }
        field.step(lastTime === null ? 1 / 60 : seconds - lastTime);
        lastTime = seconds;
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, field.columns, field.rows, gl.RGBA, gl.UNSIGNED_BYTE, field.pixels);
        gl.uniform1f(time, seconds);
        gl.uniform3fv(pageColor, background);
        gl.uniform2f(effects, enabled.water ? 1 : 0, enabled.rain ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}
