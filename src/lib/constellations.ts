type Point = { x: number; y: number };
type Link = [number, number];

export function buildConstellations(points: Point[]): Link[] {
  const links: Link[] = [];
  const neighbors: number[][] = points.map(() => []);
  const parent = points.map((_, i) => i);
  const size = points.map(() => 1);
  const root = (i: number): number => parent[i] === i ? i : (parent[i] = root(parent[i]));
  const candidates: { i: number; j: number; length: number }[] = [];
  points.forEach((a, i) => points.slice(i + 1).forEach((b, offset) => {
    const length = Math.hypot(a.x - b.x, a.y - b.y);
    if (length >= 28 && length <= 180) candidates.push({ i, j: i + offset + 1, length });
  }));
  const turn = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const sharp = (i: number, j: number) => neighbors[i].some(k => {
    const a = points[i], b = points[j], c = points[k];
    return ((b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y)) /
      (Math.hypot(b.x - a.x, b.y - a.y) * Math.hypot(c.x - a.x, c.y - a.y)) > .7;
  });
  for (const { i, j } of candidates.sort((a, b) => a.length - b.length)) {
    const ri = root(i), rj = root(j);
    // Short, open chains instead of triangles and a screen-wide mesh.
    if (ri === rj || size[ri] + size[rj] > 6 || neighbors[i].length >= 2 || neighbors[j].length >= 2) continue;
    if (sharp(i, j) || sharp(j, i)) continue;
    const a = points[i], b = points[j];
    if (links.some(([k, l]) => {
      if (i === k || i === l || j === k || j === l) return false;
      const c = points[k], d = points[l];
      return turn(a, b, c) * turn(a, b, d) <= 0 && turn(c, d, a) * turn(c, d, b) <= 0;
    })) continue;
    links.push([i, j]); neighbors[i].push(j); neighbors[j].push(i);
    parent[rj] = ri; size[ri] += size[rj];
  }
  return links;
}
