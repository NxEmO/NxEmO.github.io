import assert from "node:assert/strict";
import test from "node:test";
import { coverScale, createWaterRenderer, MAX_RIPPLES, RipplePool, WaterClock } from "../src/lib/water-renderer.ts";

test("water starts on the first frame on both touch and desktop displays", () => {
  for (const fps of [30, 60]) {
    const clock = new WaterClock();
    assert.ok(clock.step(100, fps) > 0);
    assert.equal(clock.step(105, fps), null);
    assert.ok(clock.step(100 + 1000 / fps, fps) > 1 / fps);
  }
});

test("resuming a hidden tab does not jump the water simulation forward", () => {
  const clock = new WaterClock();
  clock.step(100, 60);
  const before = clock.time;
  clock.pause();
  clock.step(100_000, 60);
  assert.ok(Math.abs(clock.time - before - 1 / 60) < 1e-8);
  const resumed = clock.time;
  clock.step(110_000, 60);
  assert.ok(clock.time - resumed <= 0.05 + 1e-8);
});

test("wallpaper keeps its aspect ratio and cover crop in portrait and landscape", () => {
  for (const [width, height] of [[390, 844], [1440, 900], [2560, 720]]) {
    const [x, y] = coverScale(width, height, 2150, 1250);
    assert.ok(x > 0 && x <= 1 && y > 0 && y <= 1);
    assert.ok(Math.abs(Math.max(x, y) - 1) < 1e-8);
    assert.ok(Math.abs((x * 2150) / width - (y * 1250) / height) < 1e-8);
  }
});

test("rapid pointer input stays bounded and retains the newest ripples", () => {
  const pool = new RipplePool();
  for (let i = 0; i < 1000; i++) pool.add(i, i + 1, i, 1);
  assert.equal(pool.values.length, MAX_RIPPLES * 4);
  const times = Array.from({ length: MAX_RIPPLES }, (_, i) => pool.values[i * 4 + 2]);
  assert.deepEqual(times.sort((a, b) => a - b), Array.from({ length: MAX_RIPPLES }, (_, i) => 1000 - MAX_RIPPLES + i));
  const before = pool.values.slice();
  pool.add(NaN, 2, 3, 1);
  assert.deepEqual(pool.values, before);
  pool.clear();
  for (let i = 0; i < MAX_RIPPLES; i++) assert.equal(pool.values[i * 4 + 3], 0);
});

test("WebGL-unavailable devices retain the static wallpaper", () => {
  assert.equal(createWaterRenderer({ getContext: () => null }, {}), null);
});

test("shader failure releases resources and falls back without throwing", () => {
  const deleted = [];
  const gl = {
    createProgram: () => "program",
    createShader: () => "shader",
    getShaderPrecisionFormat: () => ({ precision: 23 }),
    shaderSource() {}, compileShader() {},
    getShaderParameter: () => false,
    deleteProgram: (resource) => deleted.push(resource),
    deleteShader: (resource) => deleted.push(resource),
  };
  assert.equal(createWaterRenderer({ getContext: () => gl }, {}), null);
  assert.deepEqual(deleted.sort(), ["program", "shader"]);
});
