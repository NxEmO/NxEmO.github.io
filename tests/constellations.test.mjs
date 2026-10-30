import assert from 'node:assert/strict';
import test from 'node:test';
import { buildConstellations, distributeStars } from '../src/lib/constellations.ts';

test('star placement covers the viewport without tight clumps at a lower density', () => {
  let seed = 123;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  for (const [width, height] of [[1265, 712], [390, 844], [2560, 1440]]) {
    const points = distributeStars(width, height, random);
    assert.equal(points.length, Math.min(145, Math.round(width * height / 8500)));
    const quadrants = [0, 0, 0, 0];
    points.forEach((p, i) => {
      assert.ok(p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height);
      quadrants[Number(p.x >= width / 2) + 2 * Number(p.y >= height / 2)]++;
      for (const q of points.slice(i + 1)) assert.ok(Math.hypot(p.x - q.x, p.y - q.y) > 25);
    });
    assert.ok(quadrants.every(count => count >= points.length * .15));
  }
  assert.deepEqual(distributeStars(0, 0), []);
});

test('constellations remain short open chains without crossing edges', () => {
  let seed = 42;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  for (let scene = 0; scene < 30; scene++) {
    const points = Array.from({ length: 140 }, () => ({ x: random() * 1265, y: random() * 712 }));
    const links = buildConstellations(points);
    assert.ok(links.length > 30, 'constellations must still be visible');
    const adjacency = points.map(() => []);
    const turn = (a, b, c) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
    for (const [i,j] of links) {
      adjacency[i].push(j); adjacency[j].push(i);
      for (const [k,l] of links) {
        if ([i,j].includes(k) || [i,j].includes(l)) continue;
        const [a,b,c,d] = [i,j,k,l].map(n => points[n]);
        assert.ok(!(turn(a,b,c)*turn(a,b,d)<=0 && turn(c,d,a)*turn(c,d,b)<=0));
      }
    }
    assert.ok(adjacency.every(list => list.length <= 2));
    const seen = new Set();
    for (let i = 0; i < points.length; i++) {
      if (seen.has(i)) continue;
      let count = 0, degrees = 0;
      const queue = [i]; seen.add(i);
      while (queue.length) {
        const n = queue.pop(); count++; degrees += adjacency[n].length;
        for (const j of adjacency[n]) if (!seen.has(j)) { seen.add(j); queue.push(j); }
      }
      assert.ok(count <= 6);
      assert.equal(degrees / 2, count - 1, 'no closed triangles or cycles');
    }
  }
});
