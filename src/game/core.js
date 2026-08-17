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
  return { x: 60, y: 360, spawnX: 60, spawnY: 360, spawnGroundY: 422, checkpointIndex: 0, vx: 0, vy: 0, w: 32, h: 62, grounded: false, invincible: 0, powered: 0, transformed: false, facing: 1 };
}

export function makeEnemy(x, y, level, seed, forcedType = null) {
  const rosters = [
    ["cassette"],
    ["cassette", "tv"],
    ["cassette", "tv", "ghost"],
    ["cassette", "tv", "ghost", "mic"],
    ["cassette", "tv", "ghost", "mic", "firefly"],
    ["cassette", "tv", "ghost", "mic", "firefly", "barrel"],
  ];
  const roster = rosters[Math.min(rosters.length - 1, Math.floor(level / 3))];
  const type = forcedType ?? roster[(seed * 2 + level) % roster.length];
  const patternByType = {
    cassette: "walk",
    tv: "hop",
    ghost: "fly",
    mic: "charge",
    firefly: "firefly",
    barrel: "roll",
  };
  const pattern = patternByType[type];
  const difficulty = level / Math.max(1, tracks.length - 1);
  const speedBase = 0.56 + difficulty * 0.56 + ((seed * 17 + level * 9) % 18) / 100;
  const speedByType = {
    cassette: speedBase,
    tv: speedBase * 0.86,
    ghost: speedBase * 0.78,
    mic: speedBase * 1.18,
    firefly: speedBase * 0.74,
    barrel: speedBase * 1.05,
  };
  const speed = speedByType[type];
  const hitboxes = {
    cassette: { w: 24, h: 22 },
    tv: { w: 24, h: 24 },
    ghost: { w: 22, h: 26 },
    mic: { w: 28, h: 24 },
    firefly: { w: 22, h: 22 },
    barrel: { w: 24, h: 24 },
  };
  const hitbox = hitboxes[type];
  const spawnBottom = y + 30;
  const groundedY = spawnBottom - hitbox.h;
  const startY = pattern === "fly" || pattern === "firefly" ? y - 6 : groundedY;
  return {
    x,
    y: startY,
    baseY: startY,
    vx: speed,
    min: x - 22,
    max: x + 82 + level * 5 + ((seed * 11) % 42),
    w: hitbox.w,
    h: hitbox.h,
    kind: (seed + level) % 4,
    pattern,
    type,
    phase: seed * 31 + level * 13,
    amp: 18 + Math.floor(difficulty * 12) + ((seed * 19 + level * 7) % 30),
    period: Math.max(18, 34 - Math.floor(difficulty * 8) + ((seed * 23 + level * 5) % 28)),
    wait: 20 + ((seed * 17 + level * 11) % 42),
    burst: 20 + ((seed * 13 + level * 7) % 36),
    style: (seed + level * 3) % 4,
  };
}

export function makeWorld(level) {
  const difficulty = level / (tracks.length - 1);
  const length = 4800 + level * 430;
  const platforms = [];
  const notes = [];
  const blocks = [];
  const mates = [];
  const enemies = [];
  const obstacles = [];
  const obstacleAnchors = [];
  const checkpoints = [];
  const platformCount = 13 + Math.floor(level * 1.18);
  const mateBlockIndexes = new Set(level < 6 ? [3] : level < 11 ? [4] : [3, 9]);

  for (let i = 0; i < platformCount; i += 1) {
    const gap = 252 + Math.floor(difficulty * 56);
    const x = 410 + i * gap + ((i * 37 + level * 29) % 72);
    if (x > length - 360) continue;
    const lift = level < 3 ? 0 : Math.floor((i % 3) * difficulty * 18);
    const y = 410 - ((i + level) % 3) * (28 + Math.floor(difficulty * 8)) - lift;
    const w = Math.max(84, 164 - Math.floor(difficulty * 42) - ((i + level) % 3) * 8);
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

    const gateEvery = level < 3 ? 5 : level < 8 ? 4 : 3;
    const isGate = level >= 1 && i > 0 && i % gateEvery === 1;
    const isLateGate = level >= 8 && i > 4 && i % 5 === 3;
    if (isGate || isLateGate) {
      obstacleAnchors.push({ x, w });
    }
  }

  if (!blocks.some((block) => block.hasMate) && blocks.length > 0) {
    const fallbackMate = blocks[Math.min(blocks.length - 1, level < 6 ? 2 : level < 11 ? 3 : 4)];
    fallbackMate.hasMate = true;
  }

  for (const anchor of obstacleAnchors) {
    const wallY = Math.max(360, 392 - level * 2);
    const wallW = 42 + Math.min(12, Math.floor(level * 1.1));
    const wallCandidates = [anchor.x - 112, anchor.x - 152, anchor.x - 196, anchor.x + anchor.w + 30, anchor.x + anchor.w + 78, anchor.x - 242];
    const wall = wallCandidates
      .map((candidateX) => ({ x: candidateX, y: wallY, w: wallW, h: 468 - wallY, kind: "wall" }))
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

  const desiredGateCount = level < 2 ? 1 : level < 6 ? 2 : level < 11 ? 3 : 4;
  if (obstacles.length > desiredGateCount) obstacles.splice(desiredGateCount);
  for (let i = obstacles.length; i < desiredGateCount; i += 1) {
    const wallY = Math.max(360, 392 - level * 2);
    const wallW = 42 + Math.min(12, Math.floor(level * 1.1));
    const x = Math.floor((length / (desiredGateCount + 1)) * (i + 1)) - 24 + ((level * 31 + i * 53) % 54);
    obstacles.push({ x, y: wallY, w: wallW, h: 468 - wallY, kind: "wall" });
  }

  for (const obstacle of obstacles) {
    let attempts = 0;
    while (attempts < 18 && platforms.some((platform) => platform.y < 455 && rectsOverlap(obstacle, platform))) {
      obstacle.x += 34 + attempts * 4;
      obstacle.x = Math.max(320, Math.min(length - 420, obstacle.x));
      attempts += 1;
    }
  }

  for (const obstacle of obstacles) {
    if (obstacle.h < 92) continue;
    const helperY = 412 - Math.min(42, Math.floor(level * 3.2));
    const highHelperY = helperY - 44 - Math.min(18, Math.floor(level * 1.4));
    const before = { x: obstacle.x - 208, y: helperY, w: 148, h: 20, challenge: true };
    const bridge = { x: obstacle.x - 20, y: highHelperY, w: 92, h: 20, challenge: true };
    const after = { x: obstacle.x + obstacle.w + 42, y: helperY, w: 148, h: 20, challenge: true };
    const gateHelpers = level < 4 ? [before, after] : [before, bridge, after];
    const addedHelpers = [];
    for (const helper of gateHelpers) {
      const overlaps = platforms.some((platform) => platform.y < 455 && rectsOverlap(helper, platform));
      if (!overlaps && helper.x > 240 && helper.x + helper.w < length - 220) {
        platforms.push(helper);
        addedHelpers.push(helper);
        notes.push({ x: helper.x + 36, y: helper.y - 34, collected: false });
      }
    }
    const gateSeed = Math.floor(obstacle.x / 37) + level * 11;
    const groundGuardType = level < 3 ? "cassette" : level < 7 ? "tv" : level < 11 ? "mic" : "barrel";
    const platformGuardType = level < 5 ? "cassette" : level < 9 ? "ghost" : level < 13 ? "firefly" : "mic";
    const guardPlatform = addedHelpers[0] ?? platforms
      .filter((platform) => platform.y < 455 && platform.x < obstacle.x && platform.x + platform.w > obstacle.x - 220)
      .sort((a, b) => b.x - a.x)[0];
    if (guardPlatform) {
      const groundGuard = makeEnemy(guardPlatform.x + 18, guardPlatform.y - 30, level, gateSeed, groundGuardType);
      groundGuard.min = Math.max(guardPlatform.x + 8, groundGuard.x - 22);
      groundGuard.max = Math.min(guardPlatform.x + guardPlatform.w - groundGuard.w - 8, groundGuard.x + 82 + level * 2);
      enemies.push(groundGuard);
    }
    const perch = addedHelpers[Math.min(addedHelpers.length - 1, 1)] ?? gateHelpers[Math.min(gateHelpers.length - 1, 1)];
    const airGuard = makeEnemy(perch.x + 18, perch.y - 30, level, gateSeed + 5, platformGuardType);
    airGuard.min = Math.max(perch.x + 4, airGuard.x - 28);
    airGuard.max = Math.min(perch.x + perch.w - airGuard.w - 4, airGuard.x + 74 + level * 3);
    enemies.push(airGuard);
  }

  const pits = obstacles
    .map((obstacle, index) => {
      const pitW = 122 + Math.min(54, Math.floor(level * 4.2)) + (index % 2) * 18;
      const pitX = Math.max(260, obstacle.x - pitW - 58);
      return { x: pitX, y: 468, w: pitW, h: 80, kind: "pit" };
    })
    .sort((a, b) => a.x - b.x);

  for (let i = 1; i < pits.length; i += 1) {
    const previous = pits[i - 1];
    if (pits[i].x <= previous.x + previous.w + 180) pits[i].x = previous.x + previous.w + 180;
    if (pits[i].x + pits[i].w > length - 240) pits[i].x = length - 240 - pits[i].w;
  }

  let groundStart = 0;
  for (const pit of pits) {
    if (pit.x - groundStart > 90) platforms.push({ x: groundStart, y: 468, w: pit.x - groundStart, h: 80, ground: true });
    groundStart = pit.x + pit.w;
  }
  if (length + 360 - groundStart > 90) platforms.push({ x: groundStart, y: 468, w: length + 360 - groundStart, h: 80, ground: true });

  for (const pit of pits) {
    const entry = { x: Math.max(180, pit.x - 152), y: 398 - Math.floor(difficulty * 22), w: 124, h: 20, challenge: true, route: "required" };
    const exit = { x: pit.x + pit.w + 28, y: entry.y - (level > 6 ? 28 : 0), w: 132, h: 20, challenge: true, route: "required" };
    const mid = level > 4 ? { x: pit.x + Math.floor(pit.w / 2) - 46, y: entry.y - 48, w: 92, h: 20, challenge: true, route: "required" } : null;
    for (const platform of mid ? [entry, mid, exit] : [entry, exit]) {
      const overlaps = platforms.some((other) => other.y < 455 && rectsOverlap(platform, other));
      const hitsObstacle = obstacles.some((obstacle) => rectsOverlap(platform, obstacle));
      if (!overlaps && !hitsObstacle && platform.x > 120 && platform.x + platform.w < length - 100) platforms.push(platform);
    }
    notes.push({ x: pit.x + Math.floor(pit.w / 2), y: entry.y - 64, collected: false, risky: true });
  }

  platforms.sort((a, b) => Number(b.h >= 60) - Number(a.h >= 60) || a.x - b.x || a.y - b.y);

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
      .filter((platform) => x >= platform.x - 40 && x <= platform.x + platform.w + 40)
      .sort((a, b) => Math.abs(x - (a.x + a.w / 2)) - Math.abs(x - (b.x + b.w / 2)))[0];
    const checkpointGroundY = support ? support.y : 468;
    const checkpointX = support
      ? Math.max(support.x + 8, Math.min(x - 24, support.x + support.w - 52))
      : x - 24;
    checkpoints.push({ x: checkpointX, y: checkpointGroundY - 56, w: 76, h: 56, spawnY: checkpointGroundY, active: false });
    notes.push({ x: x + 48, y: 392, collected: false });
  }

  for (let i = 0; i < 8 + Math.floor(level / 3); i += 1) {
    notes.push({ x: 170 + i * (230 - Math.floor(difficulty * 28)), y: 420 - ((i * 37 + level * 19) % 105), collected: false });
  }

  for (const segment of platforms.filter((platform) => platform.ground && platform.w > 620)) {
    const markerCount = Math.min(4, Math.floor(segment.w / 520));
    for (let i = 1; i <= markerCount; i += 1) {
      const x = segment.x + Math.floor((segment.w / (markerCount + 1)) * i);
      if (x < 180 || x > length - 220) continue;
      notes.push({ x, y: 414 - ((i + level) % 2) * 28, collected: false, breather: true });
    }
    if (segment.w > 980 && level > 2) {
      const enemyX = segment.x + Math.floor(segment.w * 0.58);
      if (enemyX > 260 && enemyX < length - 320) {
        const patrol = makeEnemy(enemyX, 436, level, Math.floor(enemyX / 31), level > 10 ? "barrel" : level > 6 ? "mic" : "cassette");
        patrol.min = Math.max(segment.x + 40, enemyX - 90);
        patrol.max = Math.min(segment.x + segment.w - patrol.w - 40, enemyX + 110);
        enemies.push(patrol);
      }
    }
  }

  const finalEnemy = makeEnemy(length - 360, 436, level, 99);
  for (const obstacle of obstacles) {
    const patrolCrossesWall = finalEnemy.baseY + finalEnemy.h > obstacle.y && finalEnemy.min < obstacle.x + obstacle.w && finalEnemy.max + finalEnemy.w > obstacle.x;
    if (!patrolCrossesWall) continue;
    if (finalEnemy.x < obstacle.x) finalEnemy.max = Math.min(finalEnemy.max, obstacle.x - finalEnemy.w - 8);
    else finalEnemy.min = Math.max(finalEnemy.min, obstacle.x + obstacle.w + 8);
    if (finalEnemy.max <= finalEnemy.min) {
      finalEnemy.x = finalEnemy.x < obstacle.x ? obstacle.x + obstacle.w + 36 : obstacle.x - finalEnemy.w - 36;
      finalEnemy.min = finalEnemy.x - 10;
      finalEnemy.max = finalEnemy.x + 46;
    }
  }
  enemies.push(finalEnemy);
  const finalPlatform = { x: length - 260, y: 412 - Math.floor(difficulty * 52), w: 130 - Math.floor(difficulty * 22), h: 20 };
  const finalPlatformClearance = { x: finalPlatform.x - 28, y: finalPlatform.y - 28, w: finalPlatform.w + 56, h: finalPlatform.h + 56 };
  if (!platforms.some((platform) => platform.y < 455 && rectsOverlap(finalPlatformClearance, platform)) && !obstacles.some((obstacle) => rectsOverlap(finalPlatformClearance, obstacle))) {
    platforms.push(finalPlatform);
  }
  return { platforms, notes, blocks, mates, enemies, obstacles, checkpoints, pits, length };
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
  enemy.phase += 1;
  const cycle = enemy.wait + enemy.burst + 18;
  const cycleFrame = enemy.phase % cycle;
  const chargeBoost = enemy.pattern === "charge" && cycleFrame > enemy.wait && cycleFrame < enemy.wait + enemy.burst ? 2.75 : enemy.pattern === "charge" ? 0.32 : 1;
  const rollBoost = enemy.pattern === "roll" && Math.floor(enemy.phase / Math.max(12, enemy.period * 0.55)) % 2 === 0 ? 1.45 : 0.75;
  const hopPause = enemy.pattern === "hop" && cycleFrame < enemy.wait * 0.45 ? 0.28 : 1;
  const drift = enemy.pattern === "firefly" ? Math.sin(enemy.phase / 17 + enemy.style) * 0.62 : 0;
  enemy.x += enemy.vx * chargeBoost * rollBoost * hopPause + drift;
  if (enemy.pattern === "hop") enemy.y = enemy.baseY - Math.max(0, Math.sin(enemy.phase / enemy.period + enemy.style * 0.4)) * enemy.amp;
  if (enemy.pattern === "fly") enemy.y = enemy.baseY + Math.sin(enemy.phase / enemy.period + enemy.style * 0.7) * enemy.amp + Math.sin(enemy.phase / 31) * 5;
  if (enemy.pattern === "firefly") enemy.y = enemy.baseY + Math.sin(enemy.phase / enemy.period + enemy.style) * enemy.amp + Math.sin(enemy.phase / 9) * 8;
  if (enemy.pattern === "roll") enemy.y = enemy.baseY + Math.sin(enemy.phase / 8) * 2;
  if (enemy.pattern === "walk" || enemy.pattern === "charge") enemy.y = enemy.baseY;
  if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.vx *= -1;
  for (const obstacle of obstacles) {
    if ((enemy.pattern === "fly" || enemy.pattern === "firefly") && rectsOverlap(enemy, obstacle)) {
      enemy.x = previousX;
      enemy.vx *= -1;
      if (rectsOverlap(enemy, obstacle)) enemy.y = obstacle.y - enemy.h - 4;
      break;
    }
    if (enemy.pattern === "fly" || enemy.pattern === "firefly") continue;
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
