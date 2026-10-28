import assert from "node:assert/strict";
import test from "node:test";
import { WaveField } from "../src/lib/wave-field.ts";

test("a disturbance propagates outward and decays without becoming unstable", () => {
  const field = new WaveField(500, 500);
  field.disturb(250, 250, 1.5, 8);
  const sample = (x, y) => field.current[Math.round(y / field.cellSize) * field.columns + Math.round(x / field.cellSize)];
  assert.ok(Math.abs(sample(320, 250)) < .00001);
  for (let i = 0; i < 30; i++) field.step(1 / 60);
  assert.ok(Math.abs(sample(320, 250)) > .001, "wave should reach nearby cells");
  for (let i = 0; i < 1200; i++) field.step(1 / 60);
  assert.ok(field.current.every(Number.isFinite));
  assert.ok(field.current.every((value) => Math.abs(value) < .005), "waves should dissipate");
});

test("fixed simulation steps give the same waves at 30 and 60 fps", () => {
  const a = new WaveField(300, 300);
  const b = new WaveField(300, 300);
  a.disturb(150, 150, 1);
  b.disturb(150, 150, 1);
  for (let i = 0; i < 60; i++) a.step(1 / 60);
  for (let i = 0; i < 30; i++) b.step(1 / 30);
  assert.deepEqual(a.current, b.current);
});

test("large displays keep the field bounded and invalid input leaves it unchanged", () => {
  const field = new WaveField(7680, 4320);
  assert.ok(field.current.length < 92_000);
  field.disturb(NaN, 100, 1);
  field.step(Infinity);
  assert.ok(field.current.every((value) => value === 0));
});
