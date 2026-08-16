import { existsSync } from "node:fs";
import {
  findSafePlatform,
  freshPlayer,
  friction,
  gravity,
  height,
  makeWorld,
  moveEnemy,
  rectsOverlap,
  resolveHorizontalCollision,
  resolveVerticalCollision,
  resizePlayerKeepingFeet,
  snapPlayerToFloor,
  tracks,
} from "../src/game/core.js";

function audioExists(audio) {
  const candidates = [`public/audio/${audio}`, `public/audio/${audio}.mp3`];
  return candidates.some((candidate) => existsSync(candidate));
}

function runPlayerRoute(world) {
  const player = { ...freshPlayer() };
  let falls = 0;
  let finished = false;

  for (let frame = 0; frame < 6200; frame += 1) {
    const obstacleAhead = world.obstacles.some((obstacle) => obstacle.x > player.x && obstacle.x < player.x + 86 && player.y + player.h > obstacle.y + 8);
    const platformAhead = world.platforms.some((platform) => platform.y < 455 && platform.x > player.x + 12 && platform.x < player.x + 125 && platform.y > player.y - 150);
    if (player.grounded && (obstacleAhead || platformAhead)) {
      player.vy = -10.4;
      player.grounded = false;
    }

    player.vx += 0.42;
    player.vx = Math.max(-4.35, Math.min(4.35, player.vx));
    const previousX = player.x;
    player.x += player.vx;
    for (const obstacle of world.obstacles) resolveHorizontalCollision(player, obstacle, previousX);
    player.vx *= friction;

    const previousY = player.y;
    player.vy += gravity;
    player.y += player.vy;
    player.grounded = false;
    const solids = [...world.platforms, ...world.obstacles];
    for (const solid of solids) resolveVerticalCollision(player, solid, previousY, 12);

    if (player.y > height + 80) {
      falls += 1;
      player.x = Math.max(30, player.x - 120);
      player.y = 360;
      player.vx = 0;
      player.vy = 0;
    }

    if (player.x > world.length - 64) {
      finished = true;
      break;
    }
  }

  return { finished, falls, finalX: Math.round(player.x) };
}

const report = [];
let failures = 0;
const coreTests = [];

function assertCore(name, condition, details = "") {
  coreTests.push({ name, passed: Boolean(condition), details });
  if (!condition) failures += 1;
}

{
  const world = makeWorld(0);
  const player = { ...freshPlayer(), x: 90, y: 420 };
  const beforeFeet = player.y + player.h;
  resizePlayerKeepingFeet(player, 38, 64);
  assertCore("power-up resize keeps feet anchored", player.y + player.h === beforeFeet);
  snapPlayerToFloor(player, world);
  assertCore("snapPlayerToFloor lands on ground", player.y + player.h === 468);
}

{
  const world = makeWorld(4);
  const player = { ...freshPlayer(), x: 700, y: 700 };
  const safe = findSafePlatform(player, world);
  assertCore("respawn finds previous safe platform", safe && safe.x <= player.x + 12 && safe.w >= 64);
}

{
  const enemy = makeWorld(12).enemies.find((candidate) => candidate.pattern === "charge") ?? makeWorld(12).enemies[0];
  const startX = enemy.x;
  moveEnemy(enemy);
  assertCore("enemy movement updates position", enemy.x !== startX || enemy.vx === 0);
}

{
  const world = makeWorld(4);
  const obstacle = world.obstacles[0];
  const player = { ...freshPlayer(), x: obstacle.x - 20, y: obstacle.y + 12, vx: 5, vy: 0, grounded: false };
  const previousX = player.x;
  player.x += player.vx;
  resolveHorizontalCollision(player, obstacle, previousX);
  assertCore("player wall collider blocks side gaps", player.x + player.w <= obstacle.x && player.vx <= 0);
}

{
  const platform = { x: 200, y: 360, w: 120, h: 20 };
  const player = { ...freshPlayer(), x: 205, y: 330, vx: 7, vy: 3, grounded: false };
  const previousY = player.y;
  player.y += player.vy;
  resolveVerticalCollision(player, platform, previousY, 12);
  assertCore("platforms keep player from sinking visually", player.y + player.h <= platform.y || player.y >= platform.y + platform.h);
}

{
  const obstacle = { x: 160, y: 360, w: 52, h: 108 };
  const enemy = { x: 132, y: 432, baseY: 432, vx: 4, min: 80, max: 260, w: 30, h: 30, pattern: "walk", phase: 0 };
  moveEnemy(enemy, [obstacle]);
  assertCore("enemy reverses at solid walls", enemy.x + enemy.w <= obstacle.x && enemy.vx < 0);
}

{
  assertCore("rect collision detects overlap", rectsOverlap({ x: 0, y: 0, w: 20, h: 20 }, { x: 10, y: 10, w: 20, h: 20 }));
  assertCore("rect collision rejects separated boxes", !rectsOverlap({ x: 0, y: 0, w: 20, h: 20 }, { x: 40, y: 40, w: 20, h: 20 }));
}

for (let level = 0; level < tracks.length; level += 1) {
  const world = makeWorld(level);
  const ground = world.platforms.find((platform) => platform.x === 0 && platform.y === 468);
  const issues = [];

  if (!ground || ground.w < world.length) issues.push("ground does not cover full route");
  if (!audioExists(tracks[level].audio)) issues.push("audio missing");
  if (world.blocks.some((block) => block.y < 80 || block.y > 430)) issues.push("block outside safe vertical range");
  if (world.notes.some((note) => note.y < 40 || note.y > 460)) issues.push("note outside safe vertical range");
  if (world.enemies.some((enemy) => enemy.y < 120 || enemy.y > 440 || enemy.min < 0 || enemy.max > world.length + 120)) issues.push("enemy outside expected patrol bounds");
  if (level >= 4 && world.obstacles.length === 0) issues.push("expected mandatory platform obstacles");
  if (world.obstacles.some((obstacle) => obstacle.y < 360 || obstacle.y + obstacle.h !== 468 || obstacle.w < 36)) issues.push("obstacle collider does not seal ground route");
  if (world.obstacles.some((obstacle) => world.platforms.some((platform) => platform.y < 455 && rectsOverlap(obstacle, platform)))) issues.push("obstacle overlaps elevated platform");
  if (
    world.enemies.some((enemy) =>
      world.obstacles.some((obstacle) => enemy.baseY + enemy.h > obstacle.y && enemy.min < obstacle.x + obstacle.w && enemy.max + enemy.w > obstacle.x),
    )
  ) {
    issues.push("enemy patrol intersects wall obstacle");
  }
  if (world.checkpoints.length < 2) issues.push("expected at least two checkpoints");

  const runs = Array.from({ length: 10 }, () => runPlayerRoute(world));
  const failedRuns = runs.filter((run) => !run.finished || run.falls > 0);
  if (failedRuns.length > 0) issues.push(`${failedRuns.length}/10 route simulations failed or fell`);

  if (issues.length > 0) failures += 1;
  report.push({
    level: level + 1,
    title: tracks[level].title,
    runs: runs.length,
    passedRuns: runs.length - failedRuns.length,
    audio: audioExists(tracks[level].audio) ? "ok" : "missing",
    issues,
  });
}

console.log(JSON.stringify({ totalLevels: tracks.length, totalRuns: tracks.length * 10, failingLevels: failures, coreTests, report }, null, 2));
