"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  title: string;
  theme: string;
  sky: string;
  ground: string;
  accent: string;
  enemy: string;
  audio: string;
};

type Player = {
  x: number;
  y: number;
  spawnX: number;
  spawnY: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  grounded: boolean;
  invincible: number;
  powered: number;
  transformed: boolean;
  facing: 1 | -1;
};

type Platform = { x: number; y: number; w: number; h: number };
type Note = { x: number; y: number; collected: boolean };
type Block = { x: number; y: number; hit: boolean; bump: number; hasMate: boolean };
type Mate = { x: number; y: number; vx: number; vy: number; collected: boolean };
type Enemy = {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  min: number;
  max: number;
  w: number;
  h: number;
  kind: number;
  pattern: "walk" | "hop" | "sine" | "charge";
  phase: number;
};
type World = { platforms: Platform[]; notes: Note[]; blocks: Block[]; mates: Mate[]; enemies: Enemy[]; length: number };

const tracks: Track[] = [
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

const width = 960;
const height = 540;
const gravity = 0.42;
const friction = 0.86;
const saveKey = "milo-j-pixel-run-progress";

function freshPlayer(): Player {
  return { x: 60, y: 360, spawnX: 60, spawnY: 360, vx: 0, vy: 0, w: 32, h: 46, grounded: false, invincible: 0, powered: 0, transformed: false, facing: 1 };
}

function makeEnemy(x: number, y: number, level: number, seed: number): Enemy {
  const patterns: Enemy["pattern"][] = level < 3 ? ["walk"] : level < 7 ? ["walk", "hop"] : level < 11 ? ["walk", "hop", "sine"] : ["walk", "hop", "sine", "charge"];
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

function makeWorld(level: number): World {
  const difficulty = level / (tracks.length - 1);
  const length = 2450 + level * 185;
  const platforms: Platform[] = [];
  const notes: Note[] = [];
  const blocks: Block[] = [];
  const mates: Mate[] = [];
  const enemies: Enemy[] = [];
  const platformCount = 7 + Math.floor(level * 0.62);
  const mateBlockIndexes = new Set<number>(level < 6 ? [3] : level < 11 ? [4] : [3, 9]);
  const groundGap = 0;
  const groundChunk = length + 360;

  for (let x = 0; x < length + 360; x += groundChunk + groundGap) {
    platforms.push({ x, y: 468, w: Math.min(groundChunk, length + 360 - x), h: 80 });
  }

  for (let i = 0; i < platformCount; i += 1) {
    const gap = 240 + Math.floor(difficulty * 30) + ((i * 19 + level * 13) % 34);
    const x = 410 + i * gap;
    const lift = level < 3 ? 0 : Math.floor((i % 3) * difficulty * 18);
    const y = 410 - ((i + level) % 3) * (28 + Math.floor(difficulty * 8)) - lift;
    const w = Math.max(92, 170 - Math.floor(difficulty * 36) - ((i + level) % 3) * 8);
    platforms.push({ x, y, w, h: 20 });

    notes.push({ x: x + 24, y: y - 34, collected: false });
    if (i % 2 === 0) notes.push({ x: x + Math.min(w - 24, 78), y: y - 62, collected: false });

    if (i % 3 === 0 || i > 6) {
      enemies.push(makeEnemy(x + 16, y - 30, level, i));
    }

    if ((i + level) % 3 !== 1) {
      blocks.push({ x: x + Math.min(34, w - 44), y: y - 96, hit: false, bump: 0, hasMate: mateBlockIndexes.has(i) });
    }
  }

  for (let i = 0; i < 8 + Math.floor(level / 3); i += 1) {
    notes.push({ x: 170 + i * (230 - Math.floor(difficulty * 28)), y: 420 - ((i * 37 + level * 19) % 105), collected: false });
  }

  enemies.push(makeEnemy(length - 360, 436, level, 99));
  platforms.push({ x: length - 260, y: 412 - Math.floor(difficulty * 52), w: 130 - Math.floor(difficulty * 22), h: 20 });
  return { platforms, notes, blocks, mates, enemies, length };
}

function rectsOverlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function drawPixelText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 16, color = "#fff") {
  ctx.fillStyle = color;
  ctx.font = `${size}px var(--font-pixel), monospace`;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
}

function audioCandidates(fileName: string) {
  return [`/audio/${fileName}`, `/audio/${fileName}.mp3`];
}

async function firstPlayableAudio(fileName: string) {
  for (const candidate of audioCandidates(fileName)) {
    const response = await fetch(candidate, { method: "HEAD" });
    if (response.ok) return candidate;
  }
  return null;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keys = useRef<Record<string, boolean>>({});
  const loop = useRef<number | null>(null);
  const tick = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const worldRef = useRef<World>(makeWorld(0));
  const player = useRef<Player>(freshPlayer());
  const [level, setLevel] = useState(0);
  const [unlocked, setUnlocked] = useState(1);
  const [status, setStatus] = useState("Milo chiquito corre. Busca un mate raro y llega al Obelisco.");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  const currentTrack = tracks[level];
  const levelLabel = useMemo(() => `${String(level + 1).padStart(2, "0")} / ${tracks.length}`, [level]);

  useEffect(() => {
    const saved = Number(localStorage.getItem(saveKey) ?? "1");
    if (Number.isFinite(saved)) setUnlocked(Math.max(1, Math.min(tracks.length, saved)));
  }, []);

  const resetLevel = (levelIndex: number) => {
    worldRef.current = makeWorld(levelIndex);
    player.current = freshPlayer();
    tick.current = 0;
    setScore(0);
    setLives(3);
    setWon(false);
    setGameOver(false);
    setStatus(`Nivel ${levelIndex + 1}: ${tracks[levelIndex].title}`);
  };

  useEffect(() => {
    resetLevel(level);
  }, [level]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    audio.loop = true;
    if (musicEnabled) {
      firstPlayableAudio(tracks[level].audio)
        .then((src) => {
          if (!src) {
            setStatus(`Falta public/audio/${tracks[level].audio}`);
            return;
          }
          audio.src = src;
          return audio.play();
        })
        .catch(() => setStatus("El navegador bloqueo el audio. Toca Musica otra vez."));
    }
  }, [level, musicEnabled]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true;
      if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) event.preventDefault();
    };
    const up = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resizePlayerKeepingFeet = (nextW: number, nextH: number) => {
      const p = player.current;
      const feet = p.y + p.h;
      const center = p.x + p.w / 2;
      p.w = nextW;
      p.h = nextH;
      p.x = center - nextW / 2;
      p.y = feet - nextH;
    };

    const snapPlayerToFloor = () => {
      const p = player.current;
      const world = worldRef.current;
      const feet = p.y + p.h;
      const support = world.platforms.find(
        (platform) =>
          p.x + p.w > platform.x + 4 &&
          p.x < platform.x + platform.w - 4 &&
          feet >= platform.y - 10 &&
          feet <= platform.y + 22,
      );
      if (!support) return;
      p.y = support.y - p.h;
      p.vy = 0;
      p.grounded = true;
    };

    const respawnOnSafePlatform = () => {
      const p = player.current;
      const world = worldRef.current;
      const candidates = world.platforms
        .filter((platform) => platform.x <= p.x + 12 && platform.y < height && platform.w >= 64)
        .sort((a, b) => b.x - a.x || b.w - a.w);
      const safe = candidates[0] ?? world.platforms[0];
      p.x = Math.max(30, Math.min(safe.x + 28, safe.x + safe.w - p.w - 18));
      p.y = safe.y - p.h;
      p.spawnX = p.x;
      p.spawnY = p.y;
      p.vx = 0;
      p.vy = -2;
      p.grounded = false;
      p.invincible = 105;
      p.powered = 0;
      p.transformed = false;
    };

    const hurtPlayer = () => {
      const p = player.current;
      const fell = p.y > height + 40;
      if (fell) respawnOnSafePlatform();
      else {
        p.invincible = 85;
        p.powered = 0;
        p.transformed = false;
        p.x = Math.max(30, p.x - 120);
        p.y = Math.max(120, p.y - 24);
        p.vx = 0;
        p.vy = -3;
      }
      setLives((value) => {
        const next = value - 1;
        if (next <= 0) {
          setGameOver(true);
          p.vx = 0;
          p.vy = 0;
          setStatus("Game over. Dale a Reiniciar para volver al nivel.");
          return 0;
        }
        setStatus(fell ? "Caida salvada: reapareces en la plataforma segura anterior." : "Te tocaron. Perdiste el power y seguis.");
        return next;
      });
    };

    const finishLevel = () => {
      if (won) return;
      setWon(true);
      const nextUnlock = Math.min(tracks.length, Math.max(unlocked, level + 2));
      setUnlocked(nextUnlock);
      localStorage.setItem(saveKey, String(nextUnlock));
      setScore((value) => value + 100);
      setStatus(level === tracks.length - 1 ? "Album completo en el Obelisco." : "Llegaste al Obelisco. Se abre la proxima cancion.");
    };

    const step = () => {
      tick.current += 1;
      const track = tracks[level];
      const world = worldRef.current;
      const p = player.current;
      const left = keys.current.a || keys.current.arrowleft;
      const right = keys.current.d || keys.current.arrowright;
      const jump = keys.current.w || keys.current.arrowup || keys.current[" "];

      if (!won && !gameOver) {
        if (left) p.vx -= 0.42;
        if (right) p.vx += 0.42;
        if (left) p.facing = -1;
        if (right) p.facing = 1;
        p.vx = Math.max(-4.35, Math.min(4.35, p.vx));
        if (jump && p.grounded) {
          p.vy = -10.4;
          p.grounded = false;
        }

        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= friction;
        p.grounded = false;

        for (const platform of world.platforms) {
          if (rectsOverlap(p, platform) && p.vy >= 0 && p.y + p.h - p.vy <= platform.y + 4) {
            p.y = platform.y - p.h;
            p.vy = 0;
            p.grounded = true;
          }
        }

        for (const block of world.blocks) {
          const blockRect = { x: block.x, y: block.y + block.bump, w: 34, h: 34 };
          if (!rectsOverlap(p, blockRect)) continue;
          if (p.vy < 0 && p.y - p.vy >= blockRect.y + blockRect.h - 8) {
            p.y = blockRect.y + blockRect.h;
            p.vy = 3.4;
            if (!block.hit) {
              block.hit = true;
              block.bump = -8;
              if (block.hasMate) {
                world.mates.push({ x: block.x + 7, y: block.y - 8, vx: 0.7, vy: -3.4, collected: false });
                setStatus("Aparecio un mate especial. No hay muchos.");
              } else {
                world.notes.push({ x: block.x + 12, y: block.y - 18, collected: false });
                setScore((value) => value + 5);
                setStatus("Bloque vacio: solo una nota escondida.");
              }
            }
          } else if (p.vy >= 0 && p.y + p.h - p.vy <= blockRect.y + 5) {
            p.y = blockRect.y - p.h;
            p.vy = 0;
            p.grounded = true;
          } else if (p.x < blockRect.x) {
            p.x = blockRect.x - p.w;
            p.vx = 0;
          } else {
            p.x = blockRect.x + blockRect.w;
            p.vx = 0;
          }
        }

        p.x = Math.max(0, Math.min(world.length, p.x));
        if (p.y > height + 80) hurtPlayer();
        if (p.invincible > 0) p.invincible -= 1;
        if (p.powered > 0) p.powered -= 1;

        for (const note of world.notes) {
          if (!note.collected && rectsOverlap(p, { x: note.x - 10, y: note.y - 10, w: 20, h: 20 })) {
            note.collected = true;
            setScore((value) => value + 10);
          }
        }

        for (const mate of world.mates) {
          if (mate.collected) continue;
          mate.vy += 0.28;
          mate.x += mate.vx;
          mate.y += mate.vy;
          for (const platform of world.platforms) {
            if (rectsOverlap({ x: mate.x, y: mate.y, w: 22, h: 26 }, platform) && mate.vy > 0) {
              mate.y = platform.y - 26;
              mate.vy = -1.2;
              mate.vx *= 0.98;
            }
          }
          if (rectsOverlap(p, { x: mate.x, y: mate.y, w: 22, h: 26 })) {
            mate.collected = true;
            p.powered = 700;
            p.transformed = true;
            p.invincible = Math.max(p.invincible, 100);
            resizePlayerKeepingFeet(36, 52);
            snapPlayerToFloor();
            setScore((value) => value + 75);
            setLives((value) => Math.min(5, value + 1));
            setStatus("Mate power: Milo de ahora. Mas grande, mas fuerte, por poco tiempo.");
          }
        }

        if (p.powered <= 0) {
          if (p.w !== 32 || p.h !== 46) {
            resizePlayerKeepingFeet(32, 46);
            snapPlayerToFloor();
          }
        }

        for (const enemy of world.enemies) {
          moveEnemy(enemy);
          if (rectsOverlap(p, enemy)) {
            if (p.vy > 2 && p.y + p.h < enemy.y + 18) {
              p.vy = -8.2;
              enemy.x = -9999;
              setScore((value) => value + 25);
            } else if (p.powered > 0) {
              enemy.x = -9999;
              setScore((value) => value + 45);
              setStatus("Milo actual lo paso por arriba.");
            } else if (p.invincible <= 0) {
              hurtPlayer();
            }
          }
        }

        if (p.x > world.length - 64) finishLevel();
      }

      draw(ctx, track, world, p);
      loop.current = requestAnimationFrame(step);
    };

    const moveEnemy = (enemy: Enemy) => {
      if (enemy.x < -1000) return;
      enemy.phase += 1;
      const chargeBoost = enemy.pattern === "charge" && Math.floor(enemy.phase / 95) % 2 === 1 ? 1.9 : 1;
      enemy.x += enemy.vx * chargeBoost;
      if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.vx *= -1;
      if (enemy.pattern === "hop") enemy.y = enemy.baseY - Math.max(0, Math.sin(enemy.phase / 18)) * 28;
      if (enemy.pattern === "sine") enemy.y = enemy.baseY + Math.sin(enemy.phase / 22) * 34;
      if (enemy.pattern === "walk" || enemy.pattern === "charge") enemy.y = enemy.baseY;
    };

    const draw = (context: CanvasRenderingContext2D, track: Track, world: World, p: Player) => {
      const cam = Math.max(0, Math.min(world.length - width + 120, p.x - 260));
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, width, height);
      drawBackdrop(context, level, track, cam);

      for (const platform of world.platforms) drawPlatform(context, platform.x - cam, platform.y, platform.w, platform.h, track.ground, level);
      for (const block of world.blocks) {
        if (block.bump < 0) block.bump += 1;
        drawQuestionBlock(context, block.x - cam, block.y + block.bump, block.hit, block.hasMate, track.accent);
      }
      for (const note of world.notes) if (!note.collected) drawNote(context, note.x - cam, note.y, track.accent);
      for (const mate of world.mates) if (!mate.collected) drawMate(context, mate.x - cam, mate.y);
      for (const enemy of world.enemies) if (enemy.x > -1000) drawEnemy(context, enemy.x - cam, enemy.y, enemy.w, enemy.h, track.enemy, enemy.kind, enemy.pattern);

      drawObeliscoGoal(context, world.length - cam - 82, 330, track.accent);
      drawMilo(context, p.x - cam, p.y, p.invincible, p.powered, p.transformed, p.facing, track.accent);
      drawPixelText(context, track.title, 24, 18, 20, "#fff");
      drawPixelText(context, track.theme, 24, 44, 13, "rgba(255,255,255,0.82)");
      drawPixelText(context, `Notas ${score}  Vidas ${lives}  Mate ${p.powered > 0 ? "PODER" : p.transformed ? "LOOK" : "RARO"}`, 520, 18, 14, "#fff");

      if (won) {
        context.fillStyle = "rgba(10,12,20,0.76)";
        context.fillRect(230, 174, 500, 150);
        drawPixelText(context, "NIVEL COMPLETADO", 302, 206, 26, track.accent);
        drawPixelText(context, level === tracks.length - 1 ? "Terminaste el album en el Obelisco" : "Se abre la proxima cancion", 318, 250, 15, "#fff");
      }
      if (gameOver) {
        context.fillStyle = "rgba(10,12,20,0.82)";
        context.fillRect(250, 168, 460, 170);
        drawPixelText(context, "GAME OVER", 356, 204, 34, "#ff5f6d");
        drawPixelText(context, "Reinicia el nivel y volve a intentarlo", 298, 260, 15, "#fff");
      }
    };

    const drawBackdrop = (context: CanvasRenderingContext2D, levelIndex: number, track: Track, cam: number) => {
      context.fillStyle = track.sky;
      context.fillRect(0, 0, width, height);
      const drift = cam * 0.16;

      context.fillStyle = "rgba(255,255,255,0.12)";
      for (let i = 0; i < 10; i += 1) {
        const x = ((i * 173 - drift) % 1100) - 80;
        context.fillRect(x, 44 + (i % 5) * 28, 38, 8);
        context.fillRect(x + 10, 36 + (i % 5) * 28, 54, 8);
      }

      const motif = levelIndex % tracks.length;
      if (motif === 0) drawSkinLayers(context, cam, track.accent);
      if (motif === 1) drawPatio(context, cam);
      if (motif === 2) drawCity(context, cam, track.accent);
      if (motif === 3) drawSunset(context, cam);
      if (motif === 4) drawSolarRoad(context, cam);
      if (motif === 5) drawFolkloreNight(context, cam);
      if (motif === 6) drawStudio(context, cam, track.accent);
      if (motif === 7) drawRain(context, cam, track.accent);
      if (motif === 8) drawMemoryFrames(context, cam);
      if (motif === 9) drawBoilingKitchen(context, cam);
      if (motif === 10) drawHourglass(context, cam, track.accent);
      if (motif === 11) drawFootball(context, cam);
      if (motif === 12) drawInvisibleWoods(context, cam);
      if (motif === 13) drawFireflies(context, cam);
      if (motif === 14) drawRiver(context, cam);
    };

    const drawSkinLayers = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      for (let i = 0; i < 7; i += 1) {
        context.fillStyle = i % 2 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
        context.fillRect(-80 + i * 180 - (cam * 0.08) % 180, 170 + i * 18, 260, 22);
      }
      context.fillStyle = accent;
      context.fillRect(720 - (cam * 0.04) % 120, 118, 50, 10);
    };

    const drawPatio = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "rgba(255,255,255,0.2)";
      context.fillRect(80 - (cam * 0.07) % 160, 280, 120, 80);
      context.fillStyle = "#b5494a";
      context.fillRect(92 - (cam * 0.07) % 160, 250, 96, 30);
      context.fillStyle = "rgba(0,0,0,0.2)";
      for (let x = 0; x < width; x += 90) context.fillRect(x - (cam * 0.22) % 90, 408, 46, 12);
    };

    const drawCity = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      for (let x = -80; x < width + 180; x += 92) {
        const px = x - (cam * 0.28) % 92;
        context.fillStyle = "rgba(0,0,0,0.24)";
        context.fillRect(px, 260 + (x % 3) * 28, 58, 210);
        context.fillStyle = accent;
        context.fillRect(px + 12, 290, 8, 8);
        context.fillRect(px + 34, 336, 8, 8);
      }
    };

    const drawSunset = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "#ffe082";
      context.fillRect(690 - (cam * 0.05) % 80, 86, 86, 86);
      context.fillStyle = "rgba(80,42,40,0.24)";
      context.fillRect(0, 292, width, 20);
      context.fillRect(0, 330, width, 14);
    };

    const drawSolarRoad = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "rgba(255,255,255,0.2)";
      for (let x = 40; x < width; x += 130) context.fillRect(x - (cam * 0.4) % 130, 390, 64, 8);
      context.fillStyle = "rgba(0,0,0,0.18)";
      context.fillRect(0, 420, width, 48);
    };

    const drawFolkloreNight = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "#f4d7a1";
      context.fillRect(760 - (cam * 0.04) % 60, 72, 54, 54);
      context.fillStyle = "rgba(255,255,255,0.18)";
      for (let x = 0; x < width; x += 160) {
        const px = x - (cam * 0.12) % 160;
        context.fillRect(px, 318, 46, 46);
        context.fillRect(px + 14, 298, 18, 20);
      }
    };

    const drawStudio = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = "rgba(0,0,0,0.25)";
      context.fillRect(70, 128, 190, 120);
      context.fillStyle = accent;
      for (let i = 0; i < 14; i += 1) context.fillRect(94 + i * 12, 196 - ((i * 17 + Math.floor(cam)) % 44), 7, 44);
    };

    const drawRain = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      for (let i = 0; i < 32; i += 1) {
        const x = (i * 47 - cam * 0.5) % width;
        context.fillRect(x, 50 + ((i * 37 + tick.current * 5) % 360), 4, 18);
      }
    };

    const drawMemoryFrames = (context: CanvasRenderingContext2D, cam: number) => {
      for (let x = 40; x < width; x += 190) {
        const px = x - (cam * 0.18) % 190;
        context.fillStyle = "rgba(255,255,255,0.18)";
        context.fillRect(px, 150, 82, 62);
        context.fillStyle = "rgba(0,0,0,0.22)";
        context.fillRect(px + 8, 158, 66, 46);
      }
    };

    const drawBoilingKitchen = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "#28222a";
      context.fillRect(120 - (cam * 0.1) % 180, 336, 120, 42);
      context.fillStyle = "#ff784f";
      context.fillRect(148 - (cam * 0.1) % 180, 318, 64, 18);
      context.fillStyle = "rgba(255,255,255,0.26)";
      for (let i = 0; i < 4; i += 1) context.fillRect(160 + i * 18 - (cam * 0.1) % 180, 278 - (tick.current + i * 12) % 42, 10, 24);
    };

    const drawHourglass = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      const x = 760 - (cam * 0.06) % 140;
      context.fillStyle = "rgba(255,255,255,0.2)";
      context.fillRect(x, 114, 68, 12);
      context.fillRect(x, 228, 68, 12);
      context.fillStyle = accent;
      context.fillRect(x + 28, 128, 12, 42);
      context.fillRect(x + 24, 186, 20, 40);
    };

    const drawFootball = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "rgba(255,255,255,0.26)";
      context.fillRect(0, 390, width, 4);
      context.fillRect(480 - (cam * 0.24) % 200, 330, 4, 138);
      context.strokeStyle = "rgba(255,255,255,0.28)";
      context.strokeRect(690 - (cam * 0.2) % 260, 330, 110, 70);
    };

    const drawInvisibleWoods = (context: CanvasRenderingContext2D, cam: number) => {
      for (let x = -40; x < width + 120; x += 100) {
        const px = x - (cam * 0.18) % 100;
        context.fillStyle = "rgba(255,255,255,0.08)";
        context.fillRect(px + 24, 250, 18, 150);
        context.fillStyle = "rgba(255,255,255,0.06)";
        context.fillRect(px, 218, 66, 48);
      }
    };

    const drawFireflies = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "#faff70";
      for (let i = 0; i < 28; i += 1) {
        const x = (i * 71 - cam * 0.14) % width;
        const y = 120 + ((i * 37 + Math.floor(tick.current * 0.8)) % 210);
        context.fillRect(x, y, 5, 5);
      }
    };

    const drawRiver = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "rgba(120,210,230,0.34)";
      context.fillRect(0, 398, width, 70);
      context.fillStyle = "rgba(255,255,255,0.28)";
      for (let x = 0; x < width; x += 120) context.fillRect(x - (cam * 0.42) % 120, 424, 72, 6);
    };

    const drawPlatform = (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, levelIndex: number) => {
      context.fillStyle = color;
      context.fillRect(x, y, w, h);
      context.fillStyle = "rgba(255,255,255,0.24)";
      context.fillRect(x, y, w, 5);
      context.fillStyle = "rgba(0,0,0,0.24)";
      context.fillRect(x, y + h - 6, w, 6);
      const tileSize = levelIndex > 9 ? 18 : 24;
      for (let tile = 0; tile < w; tile += tileSize) {
        context.fillStyle = "rgba(0,0,0,0.18)";
        context.fillRect(x + tile + 2, y + 8, 4, 4);
        context.fillRect(x + tile + 12, y + 14, 5, 5);
      }
    };

    const drawQuestionBlock = (context: CanvasRenderingContext2D, x: number, y: number, hit: boolean, hasMate: boolean, accent: string) => {
      context.fillStyle = hit ? "#7a6b58" : hasMate ? "#b56d28" : "#9f7445";
      context.fillRect(x, y, 34, 34);
      context.fillStyle = hit ? "#a89678" : hasMate ? "#f6c45f" : "#c79b5f";
      context.fillRect(x + 4, y + 4, 26, 5);
      context.fillRect(x + 4, y + 4, 5, 26);
      context.fillStyle = "rgba(0,0,0,0.28)";
      context.fillRect(x + 28, y + 7, 4, 24);
      context.fillRect(x + 7, y + 28, 24, 4);
      context.fillStyle = hit ? "#5d5146" : hasMate ? accent : "#f3e0ad";
      context.fillRect(x + 14, y + 8, 6, 5);
      context.fillRect(x + 20, y + 13, 5, 7);
      context.fillRect(x + 14, y + 20, 6, 5);
      context.fillRect(x + 15, y + 28, 5, 4);
    };

    const drawNote = (context: CanvasRenderingContext2D, x: number, y: number, color: string) => {
      context.fillStyle = "rgba(0,0,0,0.24)";
      context.fillRect(x - 9, y + 20, 18, 6);
      context.fillStyle = color;
      context.fillRect(x, y, 7, 25);
      context.fillRect(x + 7, y, 13, 7);
      context.fillRect(x - 9, y + 17, 16, 9);
      context.fillStyle = "#fff7c7";
      context.fillRect(x + 2, y + 2, 3, 15);
    };

    const drawMate = (context: CanvasRenderingContext2D, x: number, y: number) => {
      context.fillStyle = "#5a3325";
      context.fillRect(x + 4, y + 8, 18, 16);
      context.fillStyle = "#8a5638";
      context.fillRect(x + 7, y + 5, 12, 5);
      context.fillStyle = "#74c476";
      context.fillRect(x + 7, y + 8, 12, 5);
      context.fillStyle = "#d7d2c8";
      context.fillRect(x + 16, y - 4, 4, 15);
      context.fillRect(x + 19, y - 6, 8, 4);
      context.fillStyle = "rgba(255,255,255,0.3)";
      context.fillRect(x + 7, y + 10, 4, 11);
    };

    const drawEnemy = (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, kind: number, pattern: Enemy["pattern"]) => {
      context.fillStyle = "rgba(0,0,0,0.24)";
      context.fillRect(x + 2, y + h - 2, w, 5);
      context.fillStyle = color;
      context.fillRect(x + 3, y + 7, w - 6, h - 9);
      context.fillStyle = pattern === "charge" ? "#ffef70" : pattern === "hop" ? "#c7f9ff" : pattern === "sine" ? "#ffd1dc" : "rgba(255,255,255,0.24)";
      context.fillRect(x + 7, y + 2, w - 14, 6);
      context.fillStyle = "rgba(255,255,255,0.22)";
      context.fillRect(x + 6, y + 9, w - 12, 5);
      context.fillStyle = "#161616";
      context.fillRect(x + 8, y + 15, 5, 5);
      context.fillRect(x + w - 14, y + 15, 5, 5);
      context.fillRect(x + 12, y + h - 9, w - 24, 4);
      context.fillStyle = kind === 0 ? "#fff0a6" : kind === 1 ? "#c7f9ff" : kind === 2 ? "#ffd1dc" : "#b8ffb1";
      context.fillRect(x + 3, y + h - 5, 8, 6);
      context.fillRect(x + w - 11, y + h - 5, 8, 6);
      if (pattern === "charge") {
        context.fillStyle = "#111";
        context.fillRect(x + 1, y + 10, 5, 6);
        context.fillRect(x + w - 6, y + 10, 5, 6);
      }
    };

    const drawObeliscoGoal = (context: CanvasRenderingContext2D, x: number, y: number, accent: string) => {
      context.fillStyle = "rgba(0,0,0,0.22)";
      context.fillRect(x - 18, y + 132, 100, 8);
      context.fillStyle = "#e9e2d0";
      context.fillRect(x + 24, y + 36, 22, 98);
      context.fillRect(x + 18, y + 124, 34, 10);
      context.fillStyle = "#f7f3df";
      context.fillRect(x + 28, y + 18, 14, 24);
      context.fillStyle = "#d8cdbb";
      context.fillRect(x + 34, y + 18, 8, 116);
      context.fillStyle = accent;
      context.fillRect(x + 50, y + 28, 8, 88);
      context.fillStyle = "#74c0fc";
      context.fillRect(x + 58, y + 30, 48, 10);
      context.fillStyle = "#ffffff";
      context.fillRect(x + 58, y + 40, 48, 10);
      context.fillStyle = "#74c0fc";
      context.fillRect(x + 58, y + 50, 48, 10);
      context.fillStyle = "#ffd43b";
      context.fillRect(x + 78, y + 42, 8, 6);
    };

    const drawMilo = (context: CanvasRenderingContext2D, x: number, y: number, blink: number, powered: number, transformed: boolean, facing: 1 | -1, accent: string) => {
      if (blink > 0 && Math.floor(blink / 6) % 2 === 0) return;
      const walking = Math.abs(player.current.vx) > 0.45 && player.current.grounded;
      const stepFrame = walking ? Math.floor(tick.current / 8) % 2 : 0;
      if (transformed) drawMiloActual(context, x, y - 6, stepFrame, powered > 0, accent);
      else drawMiloChiquito(context, x, y, stepFrame, accent);
    };

    const drawMiloChiquito = (context: CanvasRenderingContext2D, x: number, y: number, stepFrame: number, accent: string) => {
      const stepA = stepFrame === 0 ? 0 : 3;
      const stepB = stepFrame === 0 ? 3 : 0;
      context.fillStyle = "#111";
      context.fillRect(x + 7, y + 1, 22, 7);
      context.fillRect(x + 5, y + 8, 27, 7);
      context.fillRect(x + 3, y + 14, 7, 5);
      context.fillRect(x + 27, y + 14, 6, 5);
      context.fillStyle = "#2b1a12";
      context.fillRect(x + 8, y + 8, 20, 3);
      context.fillStyle = "#d9a276";
      context.fillRect(x + 9, y + 17, 18, 13);
      context.fillStyle = "#111";
      context.fillRect(x + 12, y + 22, 4, 4);
      context.fillRect(x + 22, y + 22, 4, 4);
      context.fillStyle = "#7a3d36";
      context.fillRect(x + 16, y + 29, 7, 3);
      context.fillStyle = "#cfd7e5";
      context.fillRect(x + 16, y + 31, 3, 8);
      context.fillRect(x + 17, y + 39, 4, 3);
      context.fillStyle = "#2d5d86";
      context.fillRect(x + 3, y + 31, 30, 16);
      context.fillStyle = "#477da8";
      context.fillRect(x + 6, y + 33, 8, 13);
      context.fillRect(x + 23, y + 33, 8, 13);
      context.fillStyle = "#f0f0f0";
      context.fillRect(x + 12, y + 31, 13, 16);
      context.fillStyle = accent;
      context.fillRect(x + 13, y + 35, 11, 4);
      context.fillStyle = "#d9a276";
      context.fillRect(x + 2, y + 32, 6, 11);
      context.fillRect(x + 28, y + 32, 6, 11);
      context.fillStyle = "#1f2a44";
      context.fillRect(x + 8, y + 46, 8, 15 + stepA);
      context.fillRect(x + 20, y + 46, 8, 15 + stepB);
      context.fillStyle = "#efefef";
      context.fillRect(x + 5, y + 59 + stepA, 11, 4);
      context.fillRect(x + 20, y + 59 + stepB, 11, 4);
    };

    const drawMiloActual = (context: CanvasRenderingContext2D, x: number, y: number, stepFrame: number, poweredNow: boolean, accent: string) => {
      const stepA = stepFrame === 0 ? 0 : 3;
      const stepB = stepFrame === 0 ? 3 : 0;
      if (poweredNow) {
        context.fillStyle = "rgba(115,240,189,0.26)";
        context.fillRect(x - 6, y - 2, 48, 62);
      }
      context.fillStyle = "#101010";
      context.fillRect(x + 9, y, 20, 5);
      context.fillRect(x + 6, y + 5, 26, 7);
      context.fillRect(x + 4, y + 12, 29, 7);
      context.fillStyle = "#1b1b1b";
      context.fillRect(x + 5, y + 3, 5, 16);
      context.fillRect(x + 30, y + 6, 4, 13);
      context.fillStyle = "#d6a06f";
      context.fillRect(x + 8, y + 18, 22, 15);
      context.fillStyle = "#111";
      context.fillRect(x + 12, y + 23, 4, 4);
      context.fillRect(x + 24, y + 23, 4, 4);
      context.fillStyle = "#6b332f";
      context.fillRect(x + 17, y + 31, 9, 3);
      context.fillStyle = "#ffd54a";
      context.fillRect(x + 23, y + 31, 3, 3);
      context.fillStyle = "#4b241b";
      context.fillRect(x + 4, y + 34, 30, 21);
      context.fillStyle = "#6a3829";
      context.fillRect(x + 6, y + 36, 9, 18);
      context.fillRect(x + 23, y + 36, 9, 18);
      context.fillStyle = "#d8d0c0";
      context.fillRect(x + 18, y + 35, 3, 20);
      context.fillRect(x + 16, y + 35, 7, 3);
      context.fillStyle = accent;
      context.fillRect(x + 24, y + 39, 5, 10);
      context.fillRect(x + 27, y + 45, 5, 3);
      context.fillStyle = "#111";
      context.fillRect(x, y + 36, 7, 14);
      context.fillRect(x + 32, y + 36, 7, 14);
      context.fillStyle = "#d6a06f";
      context.fillRect(x, y + 36, 7, 14);
      context.fillRect(x + 32, y + 36, 7, 14);
      context.fillStyle = "#111";
      context.fillRect(x + 6, y + 53, 10, 16 + stepA);
      context.fillRect(x + 22, y + 53, 10, 16 + stepB);
      context.fillStyle = "#efefef";
      context.fillRect(x + 4, y + 66 + stepA, 12, 4);
      context.fillRect(x + 22, y + 66 + stepB, 12, 4);
    };

    loop.current = requestAnimationFrame(step);
    return () => {
      if (loop.current) cancelAnimationFrame(loop.current);
    };
  }, [level, lives, score, unlocked, won, gameOver]);

  const press = (key: string, value: boolean) => {
    keys.current[key] = value;
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicEnabled) {
      audio.pause();
      setMusicEnabled(false);
      setStatus("Musica pausada.");
      return;
    }
    audio.volume = 0.55;
    audio.loop = true;
    firstPlayableAudio(tracks[level].audio)
      .then((src) => {
        if (!src) {
          throw new Error("missing-audio");
        }
        audio.src = src;
        return audio.play();
      })
      .then(() => {
        setMusicEnabled(true);
        setStatus(`Sonando: ${tracks[level].title}`);
      })
      .catch(() => {
        setMusicEnabled(false);
        setStatus(`Falta public/audio/${tracks[level].audio}`);
      });
  };

  return (
    <main className="game-shell">
      <section className="stage-panel" aria-label="Juego Milo J Pixel Run">
        <div className="topbar">
          <div>
            <span className="kicker">Milo J Pixel Run v5</span>
            <h1>La Vida Era Mas Corta</h1>
          </div>
          <div className="level-readout">
            <strong>{levelLabel}</strong>
            <span>{currentTrack.theme}</span>
          </div>
        </div>

        <canvas ref={canvasRef} width={width} height={height} aria-label="Escenario del juego" />

        <div className="hud">
          <p>{status}</p>
          <div className="actions">
            <button type="button" onClick={() => setLevel((value) => Math.max(0, value - 1))} disabled={level === 0}>
              Anterior
            </button>
            <button type="button" onClick={() => resetLevel(level)}>
              Reiniciar
            </button>
            <button type="button" onClick={toggleMusic}>
              {musicEnabled ? "Pausar musica" : "Musica"}
            </button>
            <button type="button" onClick={() => setLevel((value) => Math.min(unlocked - 1, value + 1))} disabled={level >= unlocked - 1}>
              Siguiente
            </button>
          </div>
        </div>

        <audio ref={audioRef} preload="none" onEnded={() => audioRef.current?.play()} />

        <div className="touch-controls" aria-label="Controles tactiles">
          <button onPointerDown={() => press("arrowleft", true)} onPointerUp={() => press("arrowleft", false)} onPointerLeave={() => press("arrowleft", false)}>
            {"<"}
          </button>
          <button onPointerDown={() => press("arrowright", true)} onPointerUp={() => press("arrowright", false)} onPointerLeave={() => press("arrowright", false)}>
            {">"}
          </button>
          <button className="jump" onPointerDown={() => press(" ", true)} onPointerUp={() => press(" ", false)} onPointerLeave={() => press(" ", false)}>
            {"^"}
          </button>
        </div>
      </section>

      <aside className="playlist" aria-label="Niveles del album">
        <h2>Niveles</h2>
        {tracks.map((track, index) => (
          <button
            type="button"
            key={track.title}
            className={index === level ? "active" : ""}
            disabled={index >= unlocked}
            onClick={() => setLevel(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{track.title}</strong>
            <small>{index < unlocked ? track.theme : "bloqueado"}</small>
          </button>
        ))}
      </aside>
    </main>
  );
}
