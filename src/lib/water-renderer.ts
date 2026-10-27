// A small WebGL 1 surface: refract the existing wallpaper instead of drawing rings over it.
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

  pause() { this.lastFrame = null; }

  step(now: number, fps: number) {
    const interval = 1000 / fps;
    const elapsed = this.lastFrame === null ? interval : now - this.lastFrame;
    if (elapsed < interval - 1) return null;
    this.lastFrame = now;
    this.time += Math.min(elapsed / 1000, 0.05);
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
uniform vec4 uRipples[${MAX_RIPPLES}];

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

void main() {
  vec2 pixel = vUv * uResolution;
  // Two broad, slow currents keep the water alive between pointer interactions.
  float a = dot(pixel, vec2(0.023, 0.009)) + uTime * 0.85;
  float b = dot(pixel, vec2(-0.012, 0.031)) - uTime * 0.63;
  vec2 displacement = vec2(cos(a) * 2.4 + sin(b) * 1.6,
                           sin(a) * 1.4 + cos(b) * 2.2) * uEffects.x;
  float rippleLight = 0.0;
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    float age = uTime - uRipples[i].z;
    if (uEffects.x > 0.5 && age >= 0.0 && age < ${RIPPLE_LIFETIME.toFixed(1)} && uRipples[i].w > 0.0) {
      vec2 delta = pixel - uRipples[i].xy;
      float distanceToCenter = length(delta);
      float front = distanceToCenter - age * 115.0;
      float band = front / 26.0;
      float envelope = exp(-band * band);
      float fade = smoothstep(0.0, 0.12, age) * pow(1.0 - age / ${RIPPLE_LIFETIME.toFixed(1)}, 1.5);
      float wave = sin(front * 0.19) * envelope * fade * uRipples[i].w;
      displacement += delta / max(distanceToCenter, 1.0) * wave * 12.0;
      rippleLight += wave;
    }
  }

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

  // Small refracted points catch wave crests, like light on a water surface.
  vec2 cell = mod(pixel + displacement * 1.6, 25.0) - 12.5;
  float point = 1.0 - smoothstep(0.55, 1.5, length(cell));
  float glint = point * (0.018 + min(abs(rippleLight), 1.0) * 0.24) * uEffects.x;
  float sheen = clamp(dot(waterDisplacement, vec2(-0.003, 0.005)), -0.035, 0.055);
  color += sheen + vec3(0.89, 0.93, 1.0) * glint;
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
  const dispose = () => {
    if (texture) gl.deleteTexture(texture);
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
    const ripples = gl.getUniformLocation(program, "uRipples[0]");
    const effects = gl.getUniformLocation(program, "uEffects");

    return {
      resize(width: number, height: number, pixelRatio: number) {
        canvas.width = Math.max(1, Math.round(width * pixelRatio));
        canvas.height = Math.max(1, Math.round(height * pixelRatio));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, width, height);
        gl.uniform2fv(cover, coverScale(width, height, image.naturalWidth, image.naturalHeight));
      },
      render(seconds: number, values: Float32Array, enabled: { water: boolean; rain: boolean }) {
        gl.uniform1f(time, seconds);
        gl.uniform4fv(ripples, values);
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
