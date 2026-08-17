export const width = 960;
export const height = 540;
export const gravity = 0.42;
export const friction = 0.86;
export const saveKey = "milo-j-pixel-run-progress";
export const progressKey = "milo-j-pixel-run-detail-progress";

export const tracks = [
  { title: "Bajo De La Piel", theme: "Capas bajo la piel", sky: "#3b245d", ground: "#6f4a7f", accent: "#f6c45f", enemy: "#2ee6a6", audio: "01-bajo-de-la-piel.mp3" },
  { title: "Nino", theme: "Patio de infancia", sky: "#82c8cf", ground: "#5d7f42", accent: "#f7da73", enemy: "#d94848", audio: "02-nino.mp3" },
  { title: "Gil", theme: "Ciudad filosa", sky: "#202938", ground: "#596073", accent: "#e34f5f", enemy: "#f0b35a", audio: "03-gil.mp3" },
  { title: "Ama De Mi Sol", theme: "Atardecer dorado", sky: "#f2a65a", ground: "#7a5c3e", accent: "#fff3a5", enemy: "#5b5fc7", audio: "04-ama-de-mi-sol.mp3" },
  { title: "Solifican12", theme: "Ruta solar", sky: "#f7c65b", ground: "#a25f3b", accent: "#45b7ff", enemy: "#47344f", audio: "05-solifican12.mp3" },
  { title: "Lucia", theme: "Noche folklorica", sky: "#23395b", ground: "#76583f", accent: "#ffcf8a", enemy: "#80e1ff", audio: "06-lucia.mp3" },
  { title: "MmmM", theme: "Estudio raro", sky: "#5d4a66", ground: "#3e3a44", accent: "#ff8fc7", enemy: "#d6f264", audio: "07-mmmm.mp3" },
  { title: "Llora Llora", theme: "Lluvia neon", sky: "#153a4c", ground: "#2c6268", accent: "#9ef7ff", enemy: "#ff7a97", audio: "08-llora-llora.mp3" },
  { title: "Recorde", theme: "Album de recuerdos", sky: "#684c3c", ground: "#395b50", accent: "#e9d8a6", enemy: "#c65f5f", audio: "09-recorde.mp3" },
  { title: "Cuando El Agua Hirviendo", theme: "Cocina volcan", sky: "#5a1d22", ground: "#6a4834", accent: "#ffdf6f", enemy: "#ff6b2f", audio: "10-cuando-el-agua-hirviendo.mp3" },
  { title: "La Vida Era Mas Corta", theme: "Reloj partido", sky: "#2b2d42", ground: "#8d6b94", accent: "#edf2f4", enemy: "#ef476f", audio: "11-la-vida-era-mas-corta.mp3" },
  { title: "Radamel", theme: "Cancha de barrio", sky: "#14784f", ground: "#335c37", accent: "#ffffff", enemy: "#1b2a41", audio: "12-radamel.mp3" },
  { title: "El Invisible", theme: "Monte espectral", sky: "#253126", ground: "#656d4a", accent: "#caffbf", enemy: "#d8f3dc", audio: "13-el-invisible.mp3" },
  { title: "Luciernagas", theme: "Bosque brillante", sky: "#101926", ground: "#365945", accent: "#faff70", enemy: "#75ddff", audio: "14-luciernagas.mp3" },
  { title: "Jangadero", theme: "Rio final", sky: "#245a73", ground: "#7f674f", accent: "#ffd166", enemy: "#6e44ff", audio: "15-jangadero.mp3" },
];

export const tutorialTrack = {
  title: "Tutorial",
  theme: "Patio de practica",
  sky: "#2b3147",
  ground: "#5d7f42",
  accent: "#ffd166",
  enemy: "#2ee6a6",
  audio: null,
  tutorial: true,
};

export function freshPlayer() {
  return { x: 60, y: 360, spawnX: 60, spawnY: 360, checkpointIndex: 0, vx: 0, vy: 0, w: 32, h: 62, grounded: false, invincible: 0, powered: 0, transformed: false, facing: 1 };
}

export function makeEnemy(x, y, level, seed) {
  const patterns = level < 3 ? ["walk"] : level < 7 ? ["walk", "hop"] : level < 11 ? ["walk", "hop", "sine"] : ["walk", "hop", "sine", "charge"];
  const pattern = patterns[(seed + level) % patterns.length];
  const speed = 0.62 + level * 0.035 + (pattern === "charge" ? 0.22 : 0);
  return {
    x,
    y,
    baseY: y,
    vx: speed,
    min: x - 22,
    max: x + 96 + level * 6,
    w: pattern === "charge" ? 36 : 30,
    h: pattern === "sine" ? 28 : 30,
    kind: (seed + level) % 4,
    pattern,
    phase: seed * 31,
  };
}

export function makeWorld(level) {
  const difficulty = level / (tracks.length - 1);
  const length = 3350 + level * 245;
  const platforms = [];
  const notes = [];
  const blocks = [];
  const mates = [];
  const enemies = [];
  const obstacles = [];
  const obstacleAnchors = [];
  const checkpoints = [];
  const platformCount = 10 + Math.floor(level * 0.82);
  const mateBlockIndexes = new Set(level < 6 ? [3] : level < 11 ? [4] : [3, 9]);
  const groundChunk = length + 360;

  for (let x = 0; x < length + 360; x += groundChunk) {
    platforms.push({ x, y: 468, w: Math.min(groundChunk, length + 360 - x), h: 80 });
  }

  for (let i = 0; i < platformCount; i += 1) {
    const gap = 250 + Math.floor(difficulty * 34);
    const x = 410 + i * gap + ((i * 37 + level * 29) % 72);
    const lift = level < 3 ? 0 : Math.floor((i % 3) * difficulty * 18);
    const y = 410 - ((i + level) % 3) * (28 + Math.floor(difficulty * 8)) - lift;
    const w = Math.max(92, 170 - Math.floor(difficulty * 36) - ((i + level) % 3) * 8);
    platforms.push({ x, y, w, h: 20 });
    notes.push({ x: x + 24, y: y - 34, collected: false });
    if (i % 2 === 0) notes.push({ x: x + Math.min(w - 24, 78), y: y - 62, collected: false });
    if (i % 3 === 0 || i > 6) {
      const enemy = makeEnemy(x + 16, y - 30, level, i);
      enemy.min = Math.max(enemy.min, x + 8);
      enemy.max = Math.min(enemy.max, x + w - enemy.w - 8);
      enemies.push(enemy);
    }
    if ((i + level) % 3 !== 1) blocks.push({ x: x + Math.min(34, w - 44), y: y - 96, hit: false, bump: 0, hasMate: mateBlockIndexes.has(i) });

    if (level >= 4 && i > 0 && i % 3 === 1) {
      obstacleAnchors.push({ x, w });
    }
  }

  if (!blocks.some((block) => block.hasMate) && blocks.length > 0) {
    const fallbackMate = blocks[Math.min(blocks.length - 1, level < 6 ? 2 : level < 11 ? 3 : 4)];
    fallbackMate.hasMate = true;
  }

  for (const anchor of obstacleAnchors) {
    const wallY = 402;
    const wallCandidates = [anchor.x - 104, anchor.x - 144, anchor.x - 184, anchor.x + anchor.w + 28, anchor.x + anchor.w + 68, anchor.x - 224];
    const wall = wallCandidates
      .map((candidateX) => ({ x: candidateX, y: wallY, w: 40, h: 468 - wallY, kind: "wall" }))
      .find(
        (candidate) =>
          !platforms.some(
            (platform) =>
              platform.y < 455 &&
              (rectsOverlap(candidate, platform) || (candidate.x < platform.x + platform.w + 38 && candidate.x + candidate.w > platform.x - 38)),
          ),
      );
    if (wall) obstacles.push(wall);
  }

  for (const enemy of enemies) {
    for (const obstacle of obstacles) {
      const patrolCrossesWall = enemy.baseY + enemy.h > obstacle.y && enemy.min < obstacle.x + obstacle.w && enemy.max + enemy.w > obstacle.x;
      if (!patrolCrossesWall) continue;
      if (enemy.x < obstacle.x) enemy.max = Math.min(enemy.max, obstacle.x - enemy.w - 8);
      else enemy.min = Math.max(enemy.min, obstacle.x + obstacle.w + 8);
      if (enemy.max <= enemy.min) {
        enemy.min = enemy.x - 12;
        enemy.max = enemy.x + 12;
      }
    }
  }

  const checkpointCount = 2 + Math.floor(level / 7);
  for (let i = 1; i <= checkpointCount; i += 1) {
    const x = Math.floor((length / (checkpointCount + 1)) * i);
    const support = platforms
      .filter((platform) => platform.y < 455 && x >= platform.x - 40 && x <= platform.x + platform.w + 40)
      .sort((a, b) => Math.abs(x - (a.x + a.w / 2)) - Math.abs(x - (b.x + b.w / 2)))[0];
    const checkpointGroundY = support ? support.y : 468;
    checkpoints.push({ x: x - 24, y: checkpointGroundY - 56, w: 76, h: 56, spawnY: checkpointGroundY, active: false });
    notes.push({ x: x + 48, y: 392, collected: false });
  }

  for (let i = 0; i < 8 + Math.floor(level / 3); i += 1) {
    notes.push({ x: 170 + i * (230 - Math.floor(difficulty * 28)), y: 420 - ((i * 37 + level * 19) % 105), collected: false });
  }

  enemies.push(makeEnemy(length - 360, 436, level, 99));
  const finalPlatform = { x: length - 260, y: 412 - Math.floor(difficulty * 52), w: 130 - Math.floor(difficulty * 22), h: 20 };
  const finalPlatformClearance = { x: finalPlatform.x - 28, y: finalPlatform.y - 28, w: finalPlatform.w + 56, h: finalPlatform.h + 56 };
  if (!platforms.some((platform) => platform.y < 455 && rectsOverlap(finalPlatformClearance, platform))) {
    platforms.push(finalPlatform);
  }
  return { platforms, notes, blocks, mates, enemies, obstacles, checkpoints, length };
}

export function makeTutorialWorld() {
  const length = 1900;
  const platforms = [
    { x: 0, y: 468, w: length + 260, h: 80 },
    { x: 340, y: 410, w: 190, h: 20 },
    { x: 650, y: 380, w: 160, h: 20 },
    { x: 980, y: 408, w: 180, h: 20 },
    { x: 1290, y: 370, w: 150, h: 20 },
  ];
  const notes = [
    { x: 180, y: 420, collected: false },
    { x: 385, y: 370, collected: false },
    { x: 452, y: 348, collected: false },
    { x: 695, y: 336, collected: false },
    { x: 1020, y: 365, collected: false },
    { x: 1330, y: 328, collected: false },
  ];
  const blocks = [
    { x: 250, y: 356, hit: false, bump: 0, hasMate: false },
    { x: 560, y: 286, hit: false, bump: 0, hasMate: true },
    { x: 1180, y: 314, hit: false, bump: 0, hasMate: false },
  ];
  const mates = [];
  const enemies = [
    { ...makeEnemy(1040, 378, 0, 1), min: 990, max: 1120, baseY: 378, pattern: "walk", vx: 0.58 },
  ];
  const obstacles = [{ x: 830, y: 402, w: 40, h: 66, kind: "wall" }];
  const checkpoints = [{ x: 892, y: 346, w: 76, h: 56, spawnY: 402, active: false }];
  return { platforms, notes, blocks, mates, enemies, obstacles, checkpoints, length, tutorial: true };
}

export function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function horizontalOverlap(a, b) {
  return Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
}

export function hasSolidFooting(entity, platform, minOverlap = 10) {
  return horizontalOverlap(entity, platform) >= minOverlap;
}

export function isSeparatedByPlatform(player, enemy, platforms) {
  return platforms.some(
    (platform) =>
      platform.y < height &&
      horizontalOverlap(player, platform) >= 8 &&
      horizontalOverlap(enemy, platform) >= 8 &&
      enemy.y + enemy.h <= platform.y + 6 &&
      player.y < platform.y + platform.h &&
      player.y + player.h > platform.y,
  );
}

export function resolveHorizontalCollision(entity, solid, previousX) {
  if (!rectsOverlap(entity, solid)) return null;
  const previousRight = previousX + entity.w;
  const solidRight = solid.x + solid.w;

  if (previousRight <= solid.x + 2) {
    entity.x = solid.x - entity.w;
    entity.vx = Math.min(0, entity.vx);
    return "left";
  }

  if (previousX >= solidRight - 2) {
    entity.x = solidRight;
    entity.vx = Math.max(0, entity.vx);
    return "right";
  }

  const pushLeft = entity.x + entity.w - solid.x;
  const pushRight = solidRight - entity.x;
  if (pushLeft < pushRight) {
    entity.x = solid.x - entity.w;
    entity.vx = Math.min(0, entity.vx);
    return "left";
  }

  entity.x = solidRight;
  entity.vx = Math.max(0, entity.vx);
  return "right";
}

export function resolveVerticalCollision(entity, solid, previousY, minFooting = 0) {
  if (!rectsOverlap(entity, solid) || horizontalOverlap(entity, solid) < minFooting) return null;
  const previousBottom = previousY + entity.h;
  const solidBottom = solid.y + solid.h;

  if (previousBottom <= solid.y + 4 && entity.vy >= 0) {
    entity.y = solid.y - entity.h;
    entity.vy = 0;
    entity.grounded = true;
    return "top";
  }

  if (previousY >= solidBottom - 4 && entity.vy < 0) {
    entity.y = solidBottom;
    entity.vy = Math.max(0, entity.vy);
    return "bottom";
  }

  const pushUp = entity.y + entity.h - solid.y;
  const pushDown = solidBottom - entity.y;
  if (pushUp < pushDown) {
    entity.y = solid.y - entity.h;
    entity.vy = 0;
    entity.grounded = true;
    return "top";
  }

  entity.y = solidBottom;
  entity.vy = Math.max(0, entity.vy);
  return "bottom";
}

export function resolvePlatformLanding(entity, platform, previousY, minFooting = 12) {
  if (!rectsOverlap(entity, platform) || horizontalOverlap(entity, platform) < minFooting) return null;
  const previousBottom = previousY + entity.h;
  if (previousBottom > platform.y + 4 || entity.vy < 0) return null;
  entity.y = platform.y - entity.h;
  entity.vy = 0;
  entity.grounded = true;
  return "top";
}

export function resolveSolidCollision(entity, solid, previousX, previousY) {
  if (!rectsOverlap(entity, solid)) return null;

  const prevLeft = previousX;
  const prevRight = previousX + entity.w;
  const prevTop = previousY;
  const prevBottom = previousY + entity.h;
  const solidRight = solid.x + solid.w;
  const solidBottom = solid.y + solid.h;

  if (prevBottom <= solid.y + 4 && entity.vy >= 0) {
    entity.y = solid.y - entity.h;
    entity.vy = 0;
    entity.grounded = true;
    return "top";
  }

  if (prevTop >= solidBottom - 4 && entity.vy < 0) {
    entity.y = solidBottom;
    entity.vy = Math.max(0, entity.vy);
    return "bottom";
  }

  if (prevRight <= solid.x + 4) {
    entity.x = solid.x - entity.w;
    entity.vx = Math.min(0, entity.vx);
    return "left";
  }

  if (prevLeft >= solidRight - 4) {
    entity.x = solidRight;
    entity.vx = Math.max(0, entity.vx);
    return "right";
  }

  const pushLeft = entity.x + entity.w - solid.x;
  const pushRight = solidRight - entity.x;
  const pushUp = entity.y + entity.h - solid.y;
  const pushDown = solidBottom - entity.y;
  const smallestPush = Math.min(pushLeft, pushRight, pushUp, pushDown);

  if (smallestPush === pushUp && entity.vy >= 0) {
    entity.y = solid.y - entity.h;
    entity.vy = 0;
    entity.grounded = true;
    return "top";
  }

  if (smallestPush === pushDown && entity.vy < 0) {
    entity.y = solidBottom;
    entity.vy = Math.max(0, entity.vy);
    return "bottom";
  }

  if (smallestPush === pushLeft) {
    entity.x = solid.x - entity.w;
    entity.vx = Math.min(0, entity.vx);
    return "left";
  }

  entity.x = solidRight;
  entity.vx = Math.max(0, entity.vx);
  return "right";
}

export function moveEnemy(enemy, obstacles = []) {
  if (enemy.x < -1000) return;
  const previousX = enemy.x;
  const previousY = enemy.y;
  enemy.phase += 1;
  const chargeBoost = enemy.pattern === "charge" && Math.floor(enemy.phase / 95) % 2 === 1 ? 1.9 : 1;
  enemy.x += enemy.vx * chargeBoost;
  if (enemy.pattern === "hop") enemy.y = enemy.baseY - Math.max(0, Math.sin(enemy.phase / 18)) * 28;
  if (enemy.pattern === "sine") enemy.y = enemy.baseY + Math.sin(enemy.phase / 22) * 34;
  if (enemy.pattern === "walk" || enemy.pattern === "charge") enemy.y = enemy.baseY;
  if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.vx *= -1;
  for (const obstacle of obstacles) {
    const speed = Math.abs(enemy.vx);
    const hitSide = resolveHorizontalCollision(enemy, obstacle, previousX);
    if (!hitSide) continue;
    if (hitSide === "left") enemy.vx = -speed;
    if (hitSide === "right") enemy.vx = speed;
    break;
  }
}

export function resizePlayerKeepingFeet(player, nextW, nextH) {
  const feet = player.y + player.h;
  const center = player.x + player.w / 2;
  player.w = nextW;
  player.h = nextH;
  player.x = center - nextW / 2;
  player.y = feet - nextH;
}

export function snapPlayerToFloor(player, world) {
  const feet = player.y + player.h;
  const support = world.platforms.find(
    (platform) =>
      player.x + player.w > platform.x + 4 &&
      player.x < platform.x + platform.w - 4 &&
      feet >= platform.y - 10 &&
      feet <= platform.y + 22,
  );
  if (!support) return;
  player.y = support.y - player.h;
  player.vy = 0;
  player.grounded = true;
}

export function findSafePlatform(player, world) {
  const candidates = world.platforms
    .filter((platform) => platform.x <= player.x + 12 && platform.y < height && platform.w >= 64)
    .sort((a, b) => b.x - a.x || b.w - a.w);
  return candidates[0] ?? world.platforms[0];
}

export function audioCandidates(fileName) {
  return [`/audio/${fileName}`, `/audio/${fileName}.mp3`];
}

export function defaultProgress() {
  return {
    unlocked: 1,
    bestScores: Array(tracks.length).fill(0),
    notesCollected: Array(tracks.length).fill(0),
    musicEnabled: false,
  };
}

export function readProgress(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(progressKey) ?? "");
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function writeProgress(storage, progress) {
  storage.setItem(progressKey, JSON.stringify(progress));
  storage.setItem(saveKey, String(progress.unlocked));
}
