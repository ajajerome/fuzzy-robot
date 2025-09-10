import { AttackingDirection, Point } from "./types.ts";

export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lineProgressTowardGoal(
  start: Point,
  end: Point,
  direction: AttackingDirection,
): number {
  const delta = end.x - start.x;
  return direction === "left-to-right" ? delta : -delta;
}

export function isPointInBounds(p: Point, width: number, height: number): boolean {
  return p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height;
}

export function polylineLength(points: Point[]): number {
  if (points.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    sum += distance(points[i - 1], points[i]);
  }
  return sum;
}

export function pointNearLine(point: Point, a: Point, b: Point, maxDistance: number): boolean {
  // Compute distance from point to segment AB
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const ap = { x: point.x - a.x, y: point.y - a.y };
  const abLenSq = ab.x * ab.x + ab.y * ab.y;
  if (abLenSq === 0) return distance(point, a) <= maxDistance;
  let t = (ap.x * ab.x + ap.y * ab.y) / abLenSq;
  t = clamp(t, 0, 1);
  const closest = { x: a.x + t * ab.x, y: a.y + t * ab.y };
  return distance(point, closest) <= maxDistance;
}

