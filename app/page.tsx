"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  audioCandidates,
  defaultProgress,
  findSafePlatform,
  freshPlayer,
  friction,
  gravity,
  height,
  isSeparatedByPlatform,
  makeTutorialWorld,
  makeWorld,
  moveEnemy,
  readProgress,
  rectsOverlap,
  resolveHorizontalCollision,
  resolvePlatformLanding,
  resolveVerticalCollision,
  resizePlayerKeepingFeet,
  snapPlayerToFloor,
  tutorialTrack,
  tracks,
  width,
  writeProgress,
} from "../src/game/core";

type Track = (typeof tracks)[number];
type PlayableTrack = Track | typeof tutorialTrack;
type Player = ReturnType<typeof freshPlayer>;
type World = ReturnType<typeof makeWorld> | ReturnType<typeof makeTutorialWorld>;
type Enemy = World["enemies"][number];
type SpriteRect = [number, number, number, number, string];
type SpriteFrame = SpriteRect[];

const titleArt = "/art/super-milo-title.png";
const miloSpriteSheet = "/art/milo-spritesheet.png";
const terrainSpriteSheet = "/art/terrain-spritesheet.png";
const enemySpriteSheet = "/art/enemy-spritesheet.png";
const miloSpriteTrims = [
  [
    { x: 96, y: 123, w: 107, h: 257 },
    { x: 74, y: 123, w: 144, h: 257 },
    { x: 66, y: 126, w: 150, h: 253 },
    { x: 61, y: 134, w: 161, h: 242 },
    { x: 0, y: 88, w: 222, h: 251 },
    { x: 0, y: 178, w: 222, h: 196 },
    { x: 0, y: 144, w: 188, h: 236 },
    { x: 8, y: 117, w: 132, h: 263 },
  ],
  [
    { x: 92, y: 54, w: 111, h: 269 },
    { x: 73, y: 59, w: 143, h: 264 },
    { x: 61, y: 60, w: 151, h: 262 },
    { x: 55, y: 69, w: 167, h: 253 },
    { x: 0, y: 29, w: 222, h: 253 },
    { x: 0, y: 113, w: 222, h: 203 },
    { x: 0, y: 86, w: 192, h: 237 },
    { x: 12, y: 40, w: 128, h: 283 },
  ],
];
const backgroundArt = [
  "/art/bg-00-tutorial.png",
  "/art/bg-01-bajo-de-la-piel.png",
  "/art/bg-02-nino.png",
  "/art/bg-03-gil.png",
  "/art/bg-04-ama-de-mi-sol.png",
  "/art/bg-05-solifican12.png",
  "/art/bg-06-lucia.png",
  "/art/bg-07-mmmm.png",
  "/art/bg-08-llora-llora.png",
  "/art/bg-09-recorde.png",
  "/art/bg-10-cuando-el-agua-hirviendo.png",
  "/art/bg-11-la-vida-era-mas-corta.png",
  "/art/bg-12-radamel.png",
  "/art/bg-13-el-invisible.png",
  "/art/bg-14-luciernagas.png",
  "/art/bg-15-jangadero.png",
];

function backgroundForLevel(levelIndex: number) {
  if (levelIndex < 0) return backgroundArt[0];
  return backgroundArt[levelIndex + 1] ?? backgroundArt[1];
}

const miloPalette = {
  hair: "#101010",
  skin: "#d9a276",
  skinShade: "#b87955",
  blue: "#2d5d86",
  blueLight: "#477da8",
  white: "#f0f0f0",
  pants: "#1f2a44",
  shoe: "#efefef",
  mouth: "#7a3d36",
  brown: "#4b241b",
  brownLight: "#6a3829",
  gold: "#ffd54a",
  zipper: "#d8d0c0",
};

const miloSprites: Record<"chico" | "actual", Record<"idle" | "run1" | "run2" | "jump" | "hit", SpriteFrame>> = {
  chico: {
    idle: [
      [7, 1, 22, 7, "hair"], [5, 8, 27, 7, "hair"], [3, 14, 7, 5, "hair"], [27, 14, 6, 5, "hair"],
      [8, 8, 20, 3, "brown"], [9, 17, 18, 13, "skin"], [12, 22, 4, 4, "hair"], [22, 22, 4, 4, "hair"], [16, 29, 7, 3, "mouth"],
      [3, 31, 30, 16, "blue"], [6, 33, 8, 13, "blueLight"], [23, 33, 8, 13, "blueLight"], [12, 31, 13, 16, "white"],
      [2, 32, 6, 11, "skin"], [28, 32, 6, 11, "skin"], [8, 46, 8, 16, "pants"], [20, 46, 8, 16, "pants"], [5, 60, 11, 4, "shoe"], [20, 60, 11, 4, "shoe"],
    ],
    run1: [
      [7, 1, 22, 7, "hair"], [5, 8, 27, 7, "hair"], [3, 14, 7, 5, "hair"], [27, 14, 6, 5, "hair"],
      [9, 17, 18, 13, "skin"], [12, 22, 4, 4, "hair"], [22, 22, 4, 4, "hair"], [16, 29, 7, 3, "mouth"],
      [3, 31, 30, 16, "blue"], [6, 33, 8, 13, "blueLight"], [23, 33, 8, 13, "blueLight"], [12, 31, 13, 16, "white"],
      [0, 34, 7, 10, "skin"], [29, 30, 6, 12, "skin"], [7, 46, 8, 19, "pants"], [21, 46, 8, 14, "pants"], [4, 63, 12, 4, "shoe"], [21, 58, 12, 4, "shoe"],
    ],
    run2: [
      [7, 2, 22, 7, "hair"], [5, 9, 27, 7, "hair"], [3, 15, 7, 5, "hair"], [27, 15, 6, 5, "hair"],
      [9, 18, 18, 13, "skin"], [12, 23, 4, 4, "hair"], [22, 23, 4, 4, "hair"], [16, 30, 7, 3, "mouth"],
      [3, 32, 30, 16, "blue"], [6, 34, 8, 13, "blueLight"], [23, 34, 8, 13, "blueLight"], [12, 32, 13, 16, "white"],
      [1, 30, 7, 12, "skin"], [29, 34, 6, 10, "skin"], [8, 47, 8, 14, "pants"], [20, 47, 8, 19, "pants"], [5, 59, 12, 4, "shoe"], [20, 64, 12, 4, "shoe"],
    ],
    jump: [
      [7, 0, 22, 7, "hair"], [5, 7, 27, 7, "hair"], [9, 16, 18, 13, "skin"], [12, 21, 4, 4, "hair"], [22, 21, 4, 4, "hair"],
      [3, 30, 30, 16, "blue"], [12, 30, 13, 16, "white"], [0, 26, 7, 14, "skin"], [29, 26, 6, 14, "skin"],
      [9, 45, 8, 17, "pants"], [19, 45, 8, 17, "pants"], [6, 60, 11, 4, "shoe"], [19, 60, 11, 4, "shoe"],
    ],
    hit: [
      [7, 1, 22, 7, "hair"], [5, 8, 27, 7, "hair"], [9, 17, 18, 13, "skin"], [11, 22, 5, 4, "hair"], [23, 22, 5, 4, "hair"],
      [3, 31, 30, 16, "blue"], [12, 31, 13, 16, "white"], [2, 32, 6, 11, "skin"], [28, 32, 6, 11, "skin"],
      [8, 46, 8, 16, "pants"], [20, 46, 8, 16, "pants"], [5, 60, 11, 4, "shoe"], [20, 60, 11, 4, "shoe"],
    ],
  },
  actual: {
    idle: [
      [9, 0, 20, 5, "hair"], [6, 5, 26, 7, "hair"], [4, 12, 29, 7, "hair"], [8, 18, 22, 15, "skin"],
      [12, 23, 4, 4, "hair"], [24, 23, 4, 4, "hair"], [17, 31, 9, 3, "mouth"], [23, 31, 3, 3, "gold"],
      [4, 34, 30, 21, "brown"], [6, 36, 9, 18, "brownLight"], [23, 36, 9, 18, "brownLight"], [18, 35, 3, 20, "zipper"],
      [0, 36, 7, 14, "skin"], [32, 36, 7, 14, "skin"], [6, 53, 10, 17, "hair"], [22, 53, 10, 17, "hair"], [4, 67, 12, 4, "shoe"], [22, 67, 12, 4, "shoe"],
    ],
    run1: [
      [9, 0, 20, 5, "hair"], [6, 5, 26, 7, "hair"], [4, 12, 29, 7, "hair"], [8, 18, 22, 15, "skin"],
      [12, 23, 4, 4, "hair"], [24, 23, 4, 4, "hair"], [17, 31, 9, 3, "mouth"], [23, 31, 3, 3, "gold"],
      [4, 34, 30, 21, "brown"], [18, 35, 3, 20, "zipper"], [0, 37, 7, 13, "skin"], [32, 34, 7, 13, "skin"],
      [5, 53, 10, 20, "hair"], [23, 53, 10, 15, "hair"], [3, 70, 13, 4, "shoe"], [23, 65, 12, 4, "shoe"],
    ],
    run2: [
      [9, 1, 20, 5, "hair"], [6, 6, 26, 7, "hair"], [4, 13, 29, 7, "hair"], [8, 19, 22, 15, "skin"],
      [12, 24, 4, 4, "hair"], [24, 24, 4, 4, "hair"], [17, 32, 9, 3, "mouth"], [23, 32, 3, 3, "gold"],
      [4, 35, 30, 21, "brown"], [18, 36, 3, 20, "zipper"], [0, 34, 7, 13, "skin"], [32, 38, 7, 13, "skin"],
      [6, 54, 10, 15, "hair"], [22, 54, 10, 20, "hair"], [4, 66, 12, 4, "shoe"], [22, 71, 13, 4, "shoe"],
    ],
    jump: [
      [9, 0, 20, 5, "hair"], [6, 5, 26, 7, "hair"], [4, 12, 29, 7, "hair"], [8, 18, 22, 15, "skin"],
      [12, 23, 4, 4, "hair"], [24, 23, 4, 4, "hair"], [17, 31, 9, 3, "mouth"], [23, 31, 3, 3, "gold"],
      [4, 34, 30, 21, "brown"], [18, 35, 3, 20, "zipper"], [0, 30, 7, 15, "skin"], [32, 30, 7, 15, "skin"],
      [7, 53, 10, 17, "hair"], [21, 53, 10, 17, "hair"], [5, 67, 12, 4, "shoe"], [21, 67, 12, 4, "shoe"],
    ],
    hit: [
      [9, 0, 20, 5, "hair"], [6, 5, 26, 7, "hair"], [4, 12, 29, 7, "hair"], [8, 18, 22, 15, "skin"],
      [11, 23, 5, 4, "hair"], [24, 23, 5, 4, "hair"], [17, 31, 9, 3, "mouth"], [23, 31, 3, 3, "gold"],
      [4, 34, 30, 21, "brown"], [18, 35, 3, 20, "zipper"], [0, 36, 7, 14, "skin"], [32, 36, 7, 14, "skin"],
      [6, 53, 10, 17, "hair"], [22, 53, 10, 17, "hair"], [4, 67, 12, 4, "shoe"], [22, 67, 12, 4, "shoe"],
    ],
  },
};

function drawPixelText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 16, color = "#fff") {
  ctx.fillStyle = color;
  ctx.font = `${size}px var(--font-pixel), monospace`;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
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
  const artImages = useRef<Record<string, HTMLImageElement>>({});
  const worldRef = useRef<World>(makeWorld(0));
  const player = useRef<Player>(freshPlayer());
  const hurtFlash = useRef(0);
  const mateFlash = useRef(0);
  const victoryPose = useRef(false);
  const [level, setLevel] = useState(0);
  const [unlocked, setUnlocked] = useState(1);
  const [status, setStatus] = useState("Milo chiquito corre. Busca un mate raro y llega al Obelisco.");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [progress, setProgress] = useState(defaultProgress());
  const [debugMode, setDebugMode] = useState(false);
  const [playMode, setPlayMode] = useState<"tutorial" | "album">("album");
  const [showGlobalIntro, setShowGlobalIntro] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [routeProgress, setRouteProgress] = useState(0);

  const isTutorial = playMode === "tutorial";
  const currentTrack: PlayableTrack = isTutorial ? tutorialTrack : tracks[level];
  const levelLabel = useMemo(() => (isTutorial ? "Tutorial" : `${String(level + 1).padStart(2, "0")} / ${tracks.length}`), [isTutorial, level]);

  useEffect(() => {
    const saved = readProgress(localStorage);
    setProgress(saved);
    setUnlocked(Math.max(1, Math.min(tracks.length, saved.unlocked)));
    setMusicEnabled(Boolean(saved.musicEnabled));
    [titleArt, miloSpriteSheet, terrainSpriteSheet, enemySpriteSheet, ...backgroundArt].forEach((src) => {
      const image = new Image();
      image.src = src;
      artImages.current[src] = image;
    });
  }, []);

  const persistProgress = (nextProgress: ReturnType<typeof defaultProgress>) => {
    setProgress(nextProgress);
    writeProgress(localStorage, nextProgress);
  };

  const resetLevel = (levelIndex: number, mode = playMode) => {
    worldRef.current = mode === "tutorial" ? makeTutorialWorld() : makeWorld(levelIndex);
    player.current = freshPlayer();
    tick.current = 0;
    hurtFlash.current = 0;
    mateFlash.current = 0;
    victoryPose.current = false;
    setScore(0);
    setLives(3);
    setWon(false);
    setGameOver(false);
    setRouteProgress(0);
    setShowIntro(true);
    setStatus(mode === "tutorial" ? "Tutorial: practica movimiento, bloques, mate, enemigo y checkpoint." : `Nivel ${levelIndex + 1}: ${tracks[levelIndex].title}`);
  };

  useEffect(() => {
    resetLevel(level, playMode);
  }, [level, playMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    audio.loop = true;
    if (isTutorial) {
      audio.pause();
      audio.removeAttribute("src");
      return;
    }
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
  }, [level, musicEnabled, isTutorial]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true;
      if (event.key.toLowerCase() === "h" && event.shiftKey) setDebugMode((value) => !value);
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

    const respawnOnSafePlatform = () => {
      const p = player.current;
      const world = worldRef.current;
      if (p.checkpointIndex > 0) {
        p.x = p.spawnX;
        p.y = p.spawnY;
      } else {
        const safe = findSafePlatform(p, world);
        p.x = Math.max(30, Math.min(safe.x + 28, safe.x + safe.w - p.w - 18));
        p.y = safe.y - p.h;
      }
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
        hurtFlash.current = 85;
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
      const p = player.current;
      setWon(true);
      victoryPose.current = true;
      p.vx = 0;
      p.vy = 0;
      p.grounded = true;
      p.facing = 1;
      if (isTutorial) {
        setScore((value) => value + 50);
        setStatus("Tutorial completo. Ya podes arrancar el album.");
        return;
      }
      const nextUnlock = Math.min(tracks.length, Math.max(unlocked, level + 2));
      setUnlocked(nextUnlock);
      const collectedNotes = worldRef.current.notes.filter((note) => note.collected).length;
      setScore((value) => {
        const finalScore = value + 100;
        const nextProgress = {
          ...progress,
          unlocked: nextUnlock,
          bestScores: progress.bestScores.map((best: number, index: number) => (index === level ? Math.max(best, finalScore) : best)),
          notesCollected: progress.notesCollected.map((best: number, index: number) => (index === level ? Math.max(best, collectedNotes) : best)),
        };
        persistProgress(nextProgress);
        return finalScore;
      });
      setStatus(level === tracks.length - 1 ? "Album completo en el Obelisco." : "Llegaste al Obelisco. Se abre la proxima cancion.");
    };

    const step = () => {
      tick.current += 1;
      const track = isTutorial ? tutorialTrack : tracks[level];
      const world = worldRef.current;
      const p = player.current;
      const left = keys.current.a || keys.current.arrowleft;
      const right = keys.current.d || keys.current.arrowright;
      const jump = keys.current.w || keys.current.arrowup || keys.current[" "];

      if (!showIntro && !won && !gameOver) {
        if (tick.current % 12 === 0) setRouteProgress(Math.min(100, Math.max(0, Math.round((p.x / Math.max(1, world.length)) * 100))));
        if (left) p.vx -= 0.34;
        if (right) p.vx += 0.34;
        if (left) p.facing = -1;
        if (right) p.facing = 1;
        p.vx = Math.max(-3.65, Math.min(3.65, p.vx));
        if (jump && p.grounded) {
          p.vy = -10.4;
          p.grounded = false;
        }

        const previousX = p.x;
        p.x += p.vx;
        for (const obstacle of world.obstacles) resolveHorizontalCollision(p, obstacle, previousX);
        p.x = Math.max(0, Math.min(world.length, p.x));
        p.vx *= friction;

        const previousY = p.y;
        p.vy += gravity;
        p.y += p.vy;
        p.grounded = false;
        for (const platform of world.platforms) resolvePlatformLanding(p, platform, previousY, 12);
        for (const obstacle of world.obstacles) resolveVerticalCollision(p, obstacle, previousY, 12);

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

        if (p.y > height + 80) hurtPlayer();
        if (p.invincible > 0) p.invincible -= 1;
        if (hurtFlash.current > 0) hurtFlash.current -= 1;
        if (mateFlash.current > 0) mateFlash.current -= 1;
        if (p.powered > 0) p.powered -= 1;

        for (const checkpoint of world.checkpoints) {
          if (checkpoint.active || p.x + p.w < checkpoint.x || p.x > checkpoint.x + checkpoint.w || p.y + p.h < checkpoint.y) continue;
          checkpoint.active = true;
          p.checkpointIndex += 1;
          p.spawnX = checkpoint.x + 12;
          p.spawnY = (checkpoint.spawnY ?? 468) - p.h;
          setStatus(`Checkpoint ${p.checkpointIndex}: si caes, volves aca.`);
        }

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
            mateFlash.current = 80;
            resizePlayerKeepingFeet(p, 38, 64);
            snapPlayerToFloor(p, worldRef.current);
            setScore((value) => value + 75);
            setLives((value) => Math.min(5, value + 1));
            setStatus("Mate power: Milo de ahora. Mas grande, mas fuerte, por poco tiempo.");
          }
        }

        if (p.powered <= 0) {
          if (p.w !== 32 || p.h !== 62) {
            resizePlayerKeepingFeet(p, 32, 62);
            snapPlayerToFloor(p, worldRef.current);
          }
        }

        for (const enemy of world.enemies) {
          moveEnemy(enemy, world.obstacles);
          if (rectsOverlap(p, enemy)) {
            if (isSeparatedByPlatform(p, enemy, world.platforms)) continue;
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

    const draw = (context: CanvasRenderingContext2D, track: PlayableTrack, world: World, p: Player) => {
      const cam = Math.max(0, Math.min(world.length - width + 120, p.x - 260));
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, width, height);
        drawBackdrop(context, isTutorial ? -1 : level, track, cam);

      for (const platform of world.platforms) drawPlatform(context, platform.x - cam, platform.y, platform.w, platform.h, track.ground, level);
      for (const block of world.blocks) {
        if (block.bump < 0) block.bump += 1;
        drawQuestionBlock(context, block.x - cam, block.y + block.bump, block.hit, block.hasMate, track.accent);
      }
      for (const note of world.notes) if (!note.collected) drawNote(context, note.x - cam, note.y, track.accent);
      for (const mate of world.mates) if (!mate.collected) drawMate(context, mate.x - cam, mate.y);
      for (const enemy of world.enemies) if (enemy.x > -1000) drawEnemy(context, enemy.x - cam, enemy.y, enemy.w, enemy.h, track.enemy, enemy.kind, enemy.pattern);
      for (const obstacle of world.obstacles) drawObstacle(context, obstacle.x - cam, obstacle.y, obstacle.w, obstacle.h, track.ground, track.accent);
      for (const checkpoint of world.checkpoints) drawCheckpoint(context, checkpoint.x - cam, checkpoint.y, checkpoint.active, track.accent);

      drawObeliscoGoal(context, world.length - cam - 82, 330, track.accent);
      drawMilo(context, p.x - cam, p.y, hurtFlash.current, p.powered, p.transformed, p.facing, track.accent, mateFlash.current, won || victoryPose.current);
      if (debugMode) drawDebug(context, world, p, cam);
      drawPixelText(context, track.title, 24, 18, 20, "#fff");
      drawPixelText(context, track.theme, 24, 44, 13, "rgba(255,255,255,0.82)");
      drawPixelText(context, `Notas ${score}  Vidas ${lives}  CP ${p.checkpointIndex}/${world.checkpoints.length}  Mate ${p.powered > 0 ? "PODER" : p.transformed ? "LOOK" : "RARO"}`, 430, 18, 14, "#fff");

      if (won) {
        context.fillStyle = "rgba(10,12,20,0.76)";
        context.fillRect(230, 174, 500, 150);
        drawPixelText(context, "NIVEL COMPLETADO", 302, 206, 26, track.accent);
        drawPixelText(context, isTutorial ? "Listo para el album" : level === tracks.length - 1 ? "Terminaste el album en el Obelisco" : "Se abre la proxima cancion", 318, 250, 15, "#fff");
      }
      if (gameOver) {
        context.fillStyle = "rgba(10,12,20,0.82)";
        context.fillRect(250, 168, 460, 170);
        drawPixelText(context, "GAME OVER", 356, 204, 34, "#ff5f6d");
        drawPixelText(context, "Reinicia el nivel y volve a intentarlo", 298, 260, 15, "#fff");
      }
    };

    const drawDebug = (context: CanvasRenderingContext2D, world: World, p: Player, cam: number) => {
      context.save();
      context.strokeStyle = "#ff3355";
      context.lineWidth = 2;
      context.strokeRect(p.x - cam, p.y, p.w, p.h);
      context.strokeStyle = "#68f7ff";
      for (const platform of world.platforms) context.strokeRect(platform.x - cam, platform.y, platform.w, platform.h);
      context.strokeStyle = "#ffec5c";
      for (const block of world.blocks) context.strokeRect(block.x - cam, block.y + block.bump, 34, 34);
      context.strokeStyle = "#ff8fcb";
      for (const enemy of world.enemies) if (enemy.x > -1000) context.strokeRect(enemy.x - cam, enemy.y, enemy.w, enemy.h);
      context.strokeStyle = "#ff7a2f";
      for (const obstacle of world.obstacles) context.strokeRect(obstacle.x - cam, obstacle.y, obstacle.w, obstacle.h);
      context.strokeStyle = "#73f0bd";
      for (const checkpoint of world.checkpoints) context.strokeRect(checkpoint.x - cam, checkpoint.y, checkpoint.w, checkpoint.h);
      context.fillStyle = "rgba(0,0,0,0.62)";
      context.fillRect(20, 72, 310, 76);
      drawPixelText(context, `x ${Math.round(p.x)} y ${Math.round(p.y)} vx ${p.vx.toFixed(2)} vy ${p.vy.toFixed(2)}`, 32, 84, 12, "#fff");
      drawPixelText(context, `ground ${p.grounded ? "yes" : "no"} power ${p.powered} look ${p.transformed ? "actual" : "chico"}`, 32, 106, 12, "#fff");
      drawPixelText(context, `entities p${world.platforms.length} b${world.blocks.length} e${world.enemies.filter((enemy) => enemy.x > -1000).length}`, 32, 128, 12, "#fff");
      context.restore();
    };

    const drawBackdrop = (context: CanvasRenderingContext2D, levelIndex: number, track: PlayableTrack, cam: number) => {
      context.fillStyle = track.sky;
      context.fillRect(0, 0, width, height);
      drawArtBackdrop(context, backgroundForLevel(levelIndex), cam);
    };

    const drawArtBackdrop = (context: CanvasRenderingContext2D, src: string, cam: number) => {
      const image = artImages.current[src];
      if (!image?.complete || image.naturalWidth === 0) return;
      const drift = Math.floor((cam * 0.035) % 18);
      context.drawImage(image, -drift, 0, width + 36, height);
      context.fillStyle = "rgba(8, 9, 14, 0.08)";
      context.fillRect(0, 0, width, height);
    };

    const drawLevelAtmosphere = (context: CanvasRenderingContext2D, levelIndex: number, cam: number, track: PlayableTrack) => {
      const motif = levelIndex < 0 ? 1 : levelIndex % tracks.length;
      if (levelIndex < 0) drawTutorialSpark(context, cam, track.accent);
      else if (motif === 0) drawDust(context, cam, track.accent);
      else if (motif === 1) drawPatioLeaves(context, cam, track.accent);
      else if (motif === 2) drawStageGlow(context, cam, track.accent);
      else if (motif === 3 || motif === 4) drawHeat(context, cam, track.accent);
      else if (motif === 5) drawMoonNotes(context, cam, track.accent);
      else if (motif === 6) drawStudioPulse(context, cam, track.accent);
      else if (motif === 7) drawRain(context, cam, track.accent);
      else if (motif === 8) drawMemoryGlints(context, cam, track.accent);
      else if (motif === 9) drawSteam(context, cam);
      else if (motif === 10) drawClockShards(context, cam, track.accent);
      else if (motif === 11) drawFieldLights(context, cam);
      else if (motif === 12) drawFog(context, cam);
      else if (motif === 13) drawFireflies(context, cam);
      else if (motif === 14) drawRiverWaves(context, cam);
    };

    const drawTutorialSpark = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      for (let i = 0; i < 10; i += 1) {
        const x = (i * 97 - cam * 0.12 + tick.current * 0.2) % width;
        const y = 105 + ((i * 31 + tick.current) % 160);
        context.globalAlpha = 0.28;
        context.fillRect(x, y, 4, 4);
      }
      context.globalAlpha = 1;
    };

    const drawPatioLeaves = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      for (let i = 0; i < 16; i += 1) {
        const x = (i * 73 - cam * 0.18 + tick.current * 0.35) % width;
        const y = 95 + ((i * 29 + Math.floor(tick.current * 0.8)) % 250);
        context.globalAlpha = 0.22;
        context.fillRect(x, y, 7, 3);
      }
      context.globalAlpha = 1;
    };

    const drawHeat = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      context.globalAlpha = 0.16;
      for (let i = 0; i < 9; i += 1) {
        const x = (i * 119 - cam * 0.22) % width;
        const y = 260 + ((i * 17 + tick.current) % 80);
        context.fillRect(x, y, 46, 3);
        context.fillRect(x + 18, y + 8, 38, 3);
      }
      context.globalAlpha = 1;
    };

    const drawMoonNotes = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      context.globalAlpha = 0.2;
      for (let i = 0; i < 8; i += 1) {
        const x = (i * 151 - cam * 0.16) % width;
        const y = 90 + ((i * 41 + tick.current) % 160);
        context.fillRect(x, y, 5, 20);
        context.fillRect(x + 5, y, 12, 5);
      }
      context.globalAlpha = 1;
    };

    const drawStudioPulse = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      context.globalAlpha = 0.18;
      for (let i = 0; i < 14; i += 1) {
        const h = 16 + ((i * 13 + tick.current) % 58);
        context.fillRect(80 + i * 24 - (cam * 0.08) % 24, 310 - h, 7, h);
      }
      context.globalAlpha = 1;
    };

    const drawMemoryGlints = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      context.globalAlpha = 0.2;
      for (let i = 0; i < 12; i += 1) {
        const x = (i * 83 - cam * 0.12) % width;
        const y = 120 + ((i * 47 + tick.current) % 180);
        context.fillRect(x, y, 4, 4);
        context.fillRect(x - 5, y + 1, 14, 2);
      }
      context.globalAlpha = 1;
    };

    const drawSteam = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "#ffffff";
      context.globalAlpha = 0.18;
      for (let i = 0; i < 7; i += 1) {
        const x = 160 + i * 76 - (cam * 0.1) % 76;
        const y = 250 - ((tick.current + i * 17) % 70);
        context.fillRect(x, y, 10, 30);
        context.fillRect(x + 8, y - 12, 10, 20);
      }
      context.globalAlpha = 1;
    };

    const drawFog = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "#caffbf";
      context.globalAlpha = 0.12;
      for (let i = 0; i < 8; i += 1) {
        const x = (i * 142 - cam * 0.2 + tick.current * 0.12) % width;
        const y = 190 + ((i * 23) % 160);
        context.fillRect(x, y, 94, 8);
        context.fillRect(x + 20, y - 7, 62, 7);
      }
      context.globalAlpha = 1;
    };

    const drawRiverWaves = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "#d6eef2";
      context.globalAlpha = 0.26;
      for (let i = 0; i < 11; i += 1) {
        const x = (i * 104 - cam * 0.32 + tick.current * 0.28) % width;
        const y = 390 + ((i * 19) % 80);
        context.fillRect(x, y, 46, 4);
        context.fillRect(x + 18, y - 5, 38, 4);
      }
      context.globalAlpha = 1;
    };

    const drawDust = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      for (let i = 0; i < 20; i += 1) {
        const x = (i * 91 - cam * 0.18 + tick.current * 0.18) % width;
        const y = 120 + ((i * 43 + tick.current) % 230);
        context.globalAlpha = 0.16;
        context.fillRect(x, y, 3, 3);
      }
      context.globalAlpha = 1;
    };

    const drawStageGlow = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = "rgba(255,255,255,0.08)";
      for (let i = 0; i < 4; i += 1) {
        const x = ((i * 260 - cam * 0.12) % 1100) - 90;
        context.fillRect(x, 0, 36, height);
        context.fillStyle = `${accent}44`;
        context.fillRect(x + 8, 120, 12, 260);
        context.fillStyle = "rgba(255,255,255,0.08)";
      }
    };

    const drawClockShards = (context: CanvasRenderingContext2D, cam: number, accent: string) => {
      context.fillStyle = accent;
      for (let i = 0; i < 9; i += 1) {
        const x = ((i * 137 - cam * 0.08) % 1050) - 30;
        const y = 86 + (i % 4) * 46;
        context.fillRect(x, y, 22, 4);
        context.fillRect(x + 9, y - 8, 4, 20);
      }
    };

    const drawFieldLights = (context: CanvasRenderingContext2D, cam: number) => {
      context.fillStyle = "rgba(255,255,210,0.16)";
      for (let i = 0; i < 3; i += 1) {
        const x = ((i * 340 - cam * 0.1) % 1120) - 80;
        context.fillRect(x, 90, 90, 190);
      }
    };

    const drawAlbumParallax = (context: CanvasRenderingContext2D, motif: number, cam: number, track: PlayableTrack) => {
      const far = cam * 0.07;
      const mid = cam * 0.2;
      context.fillStyle = "rgba(0,0,0,0.1)";
      for (let x = -120; x < width + 160; x += 150) {
        const px = x - (far % 150);
        drawSoftPixelHill(context, px, 338 + ((x + motif * 17) % 4) * 10, 116, 130);
      }

      context.fillStyle = "rgba(255,255,255,0.08)";
      for (let x = -60; x < width + 180; x += 220) {
        const px = x - (mid % 220);
        drawDistantWindow(context, px, 378 + ((motif + x) % 3) * 8, track.accent);
      }

      const x = 760 - (cam * 0.12) % 980;
      context.fillStyle = "rgba(255,255,255,0.2)";
      if (motif === 0) {
        context.fillRect(x, 218, 120, 14);
        context.fillRect(x + 24, 240, 150, 14);
        context.fillRect(x + 52, 262, 98, 14);
      } else if (motif === 1) {
        context.fillRect(x, 300, 86, 58);
        context.fillStyle = "#b5494a";
        context.fillRect(x + 10, 278, 66, 22);
      } else if (motif === 2) {
        context.fillRect(x, 214, 64, 200);
        context.fillStyle = track.accent;
        for (let i = 0; i < 5; i += 1) context.fillRect(x + 14, 244 + i * 28, 8, 8);
      } else if (motif === 3 || motif === 4) {
        context.fillStyle = "rgba(255,255,255,0.24)";
        context.fillRect(x, 126, 78, 78);
        context.fillStyle = track.accent;
        context.fillRect(x - 36, 330, 170, 8);
      } else if (motif === 5) {
        context.fillRect(x, 322, 46, 70);
        context.fillRect(x + 70, 300, 42, 92);
        context.fillStyle = track.accent;
        context.fillRect(x + 12, 286, 20, 36);
      } else if (motif === 6) {
        context.fillStyle = "rgba(0,0,0,0.28)";
        context.fillRect(x, 176, 190, 120);
        context.fillStyle = track.accent;
        for (let i = 0; i < 12; i += 1) context.fillRect(x + 22 + i * 12, 252 - (i % 4) * 18, 7, 42);
      } else if (motif === 7) {
        context.fillStyle = track.accent;
        for (let i = 0; i < 12; i += 1) context.fillRect(x + i * 28, 184 + (i % 3) * 40, 4, 28);
      } else if (motif === 8) {
        context.fillRect(x, 170, 72, 52);
        context.fillRect(x + 94, 218, 72, 52);
      } else if (motif === 9) {
        context.fillStyle = "#28222a";
        context.fillRect(x, 328, 130, 48);
        context.fillStyle = "#ff784f";
        context.fillRect(x + 34, 304, 64, 24);
      } else if (motif === 10) {
        context.fillRect(x, 134, 74, 12);
        context.fillRect(x, 238, 74, 12);
        context.fillStyle = track.accent;
        context.fillRect(x + 32, 150, 10, 84);
      } else if (motif === 11) {
        context.strokeStyle = "rgba(255,255,255,0.24)";
        context.strokeRect(x, 306, 112, 72);
        context.fillStyle = "#fff";
        context.fillRect(x + 54, 306, 4, 72);
      } else if (motif === 12) {
        context.fillRect(x + 20, 248, 20, 160);
        context.fillRect(x, 216, 70, 46);
        context.fillRect(x + 76, 238, 18, 170);
      } else if (motif === 13) {
        context.fillStyle = track.accent;
        for (let i = 0; i < 18; i += 1) context.fillRect(x + i * 18, 164 + ((i * 29 + tick.current) % 150), 5, 5);
      } else {
        context.fillStyle = "rgba(120,210,230,0.34)";
        context.fillRect(0, 398, width, 70);
        context.fillStyle = track.accent;
        context.fillRect(x, 340, 94, 20);
        context.fillRect(x + 18, 320, 44, 20);
      }
    };

    const drawSoftPixelHill = (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      context.fillRect(x, y + 34, w, h - 34);
      context.fillRect(x + 16, y + 18, w - 30, 18);
      context.fillRect(x + 38, y, w - 70, 20);
      context.fillStyle = "rgba(255,255,255,0.035)";
      context.fillRect(x + 18, y + 42, 26, 6);
      context.fillRect(x + 62, y + 66, 18, 6);
      context.fillStyle = "rgba(0,0,0,0.1)";
    };

    const drawDistantWindow = (context: CanvasRenderingContext2D, x: number, y: number, accent: string) => {
      context.fillRect(x, y + 20, 68, 8);
      context.fillRect(x + 22, y, 20, 20);
      context.fillStyle = "rgba(0,0,0,0.12)";
      context.fillRect(x + 8, y + 28, 84, 58);
      context.fillStyle = accent;
      context.fillRect(x + 18, y + 40, 5, 5);
      context.fillRect(x + 48, y + 54, 5, 5);
      context.fillStyle = "rgba(255,255,255,0.08)";
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
        const y = 50 + ((i * 37 + tick.current * 5) % 360);
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + 5, y);
        context.lineTo(x - 4, y + 22);
        context.lineTo(x - 9, y + 22);
        context.closePath();
        context.fill();
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
      const image = artImages.current[terrainSpriteSheet];
      if (image?.complete && image.naturalWidth > 0) {
        const isGround = h >= 60;
        const motif = levelIndex < 0 ? 0 : levelIndex % tracks.length;
        const col = isGround ? (motif < 3 ? 0 : motif < 8 ? 3 : motif < 12 ? 2 : 1) : (motif === 7 ? 1 : motif >= 12 ? 2 : motif === 14 ? 3 : 0);
        const row = isGround ? 1 : 0;
        const visualY = isGround ? y - 10 : y - 18;
        const visualH = isGround ? h + 26 : 46;
        drawTerrainTile(context, image, col, row, x, visualY, w, visualH, isGround ? 210 : 150);
        return;
      }
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

    const drawObstacle = (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, accent: string) => {
      const image = artImages.current[terrainSpriteSheet];
      if (image?.complete && image.naturalWidth > 0) {
        const col = Math.abs(Math.floor(x / 40)) % 4;
        context.save();
        context.shadowColor = "rgba(0,0,0,0.35)";
        context.shadowBlur = 8;
        context.shadowOffsetY = 4;
        drawTerrainTile(context, image, col, 2, x - 14, y - 18, w + 28, h + 26, Math.max(70, w + 28));
        context.restore();
        return;
      }
      context.fillStyle = color;
      context.fillRect(x, y, w, h);
      context.fillStyle = "rgba(0,0,0,0.24)";
      context.fillRect(x + w - 6, y, 6, h);
      context.fillRect(x, y + h - 6, w, 6);
      context.fillStyle = "rgba(255,255,255,0.22)";
      context.fillRect(x, y, w, 5);
      context.fillRect(x + 4, y + 12, 5, 22);
      context.fillStyle = accent;
      context.fillRect(x + 9, y + 16, Math.max(8, w - 18), 5);
      for (let row = y + 36; row < y + h - 10; row += 22) {
        context.fillStyle = "rgba(0,0,0,0.18)";
        context.fillRect(x + 8, row, 5, 5);
        context.fillRect(x + w - 14, row + 8, 5, 5);
      }
    };

    const drawTerrainTile = (context: CanvasRenderingContext2D, image: HTMLImageElement, col: number, row: number, x: number, y: number, w: number, h: number, tileW: number) => {
      const columns = 4;
      const rows = 3;
      const sourceW = image.naturalWidth / columns;
      const sourceH = image.naturalHeight / rows;
      const sx = Math.max(0, Math.min(columns - 1, col)) * sourceW;
      const sy = Math.max(0, Math.min(rows - 1, row)) * sourceH;
      const repeatW = Math.max(24, Math.min(tileW, w));
      context.save();
      context.imageSmoothingEnabled = false;
      for (let dx = 0; dx < w; dx += repeatW) {
        const dw = Math.min(repeatW, w - dx);
        context.drawImage(image, sx, sy, sourceW, sourceH, Math.round(x + dx), Math.round(y), Math.ceil(dw), Math.round(h));
      }
      context.restore();
    };

    const drawCheckpoint = (context: CanvasRenderingContext2D, x: number, y: number, active: boolean, accent: string) => {
      context.fillStyle = "rgba(0,0,0,0.22)";
      context.fillRect(x - 8, y + 54, 46, 6);
      context.fillStyle = active ? "#73f0bd" : "#e9e2d0";
      context.fillRect(x + 10, y + 4, 5, 54);
      context.fillStyle = active ? accent : "#74c0fc";
      context.fillRect(x + 15, y + 6, 28, 10);
      context.fillStyle = "#fff";
      context.fillRect(x + 15, y + 16, 28, 10);
      context.fillStyle = active ? accent : "#74c0fc";
      context.fillRect(x + 15, y + 26, 28, 10);
      context.fillStyle = "#ffd43b";
      context.fillRect(x + 25, y + 18, 7, 6);
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
      const image = artImages.current[enemySpriteSheet];
      if (image?.complete && image.naturalWidth > 0) {
        const frame = pattern === "charge" ? 3 : pattern === "sine" ? 2 : pattern === "hop" ? 1 : kind % 4;
        const row = kind > 1 ? 1 : 0;
        const columns = 4;
        const rows = 2;
        const sourceW = image.naturalWidth / columns;
        const sourceH = image.naturalHeight / rows;
        const drawW = pattern === "charge" ? 52 : pattern === "sine" ? 46 : 42;
        const drawH = pattern === "sine" ? 50 : 44;
        const drawX = Math.round(x + w / 2 - drawW / 2);
        const drawY = Math.round(y + h - drawH + 4);
        context.save();
        context.imageSmoothingEnabled = false;
        context.fillStyle = "rgba(0,0,0,0.28)";
        context.fillRect(drawX + 7, y + h - 2, drawW - 14, 6);
        context.drawImage(image, frame * sourceW, row * sourceH, sourceW, sourceH, drawX, drawY, drawW, drawH);
        context.restore();
        return;
      }
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

    const drawMilo = (context: CanvasRenderingContext2D, x: number, y: number, blink: number, powered: number, transformed: boolean, facing: number, accent: string, mateGlow = 0, victory = false) => {
      if (blink > 0 && Math.floor(blink / 6) % 2 === 0) return;
      const walking = !victory && Math.abs(player.current.vx) > 0.45 && player.current.grounded;
      const celebrating = victory || mateGlow > 0;
      const frameName = blink > 0 ? "hit" : celebrating ? "idle" : !player.current.grounded ? "jump" : walking ? (Math.floor(tick.current / 8) % 2 === 0 ? "run1" : "run2") : "idle";
      const sheet = artImages.current[miloSpriteSheet];
      const frameIndex = blink > 0
        ? 6
        : celebrating
          ? 7
        : !player.current.grounded
          ? player.current.vy < 0 ? 4 : 5
          : walking
            ? 1 + (Math.floor(tick.current / 9) % 3)
            : 0;
      if (sheet?.complete && sheet.naturalWidth > 0) {
        if ((transformed && powered > 0) || mateGlow > 0 || victory) {
          context.fillStyle = victory ? "rgba(255,213,74,0.24)" : "rgba(115,240,189,0.26)";
          context.fillRect(x - 10, y - 16, 58, 84);
        }
        drawMiloFromSheet(context, sheet, frameIndex, transformed ? 1 : 0, x, y, facing);
        return;
      }
      const spriteSet = transformed ? miloSprites.actual : miloSprites.chico;
      const frame = spriteSet[frameName];
      if ((transformed && powered > 0) || mateGlow > 0 || victory) {
        context.fillStyle = victory ? "rgba(255,213,74,0.24)" : "rgba(115,240,189,0.26)";
        context.fillRect(x - 6, y - 8, 48, 72);
      }
      drawSpriteFrame(context, frame, x, transformed ? y - 8 : y, facing, accent);
    };

    const drawMiloFromSheet = (context: CanvasRenderingContext2D, sheet: HTMLImageElement, frameIndex: number, row: number, x: number, y: number, facing: number) => {
      const columns = 8;
      const rows = 2;
      const sourceW = sheet.naturalWidth / columns;
      const sourceH = sheet.naturalHeight / rows;
      const trim = miloSpriteTrims[row]?.[Math.max(0, Math.min(columns - 1, frameIndex))] ?? { x: 0, y: 0, w: sourceW, h: sourceH };
      const drawH = row === 1 ? 68 : 64;
      const drawW = Math.max(30, Math.min(54, drawH * (trim.w / trim.h)));
      const center = x + (row === 1 ? 18 : 17);
      const drawX = Math.round(center - drawW / 2);
      const drawY = Math.round(y + player.current.h - drawH + 1);
      const sourceX = Math.max(0, Math.min(columns - 1, frameIndex)) * sourceW + trim.x;
      const sourceY = Math.max(0, Math.min(rows - 1, row)) * sourceH + trim.y;
      context.save();
      context.imageSmoothingEnabled = false;
      if (facing < 0) {
        context.translate(drawX + drawW, drawY);
        context.scale(-1, 1);
        context.drawImage(sheet, sourceX, sourceY, trim.w, trim.h, 0, 0, drawW, drawH);
      } else {
        context.drawImage(sheet, sourceX, sourceY, trim.w, trim.h, drawX, drawY, drawW, drawH);
      }
      context.restore();
    };

    const drawSpriteFrame = (context: CanvasRenderingContext2D, frame: SpriteFrame, x: number, y: number, facing: number, accent: string) => {
      context.save();
      if (facing < 0) {
        context.translate(x + 39, y);
        context.scale(-1, 1);
      } else {
        context.translate(x, y);
      }
      for (const [px, py, w, h, colorKey] of frame) {
        context.fillStyle = colorKey === "accent" ? accent : miloPalette[colorKey as keyof typeof miloPalette] ?? colorKey;
        context.fillRect(px, py, w, h);
      }
      context.fillStyle = accent;
      context.fillRect(13, 35, 11, 4);
      context.restore();
    };

    loop.current = requestAnimationFrame(step);
    return () => {
      if (loop.current) cancelAnimationFrame(loop.current);
    };
  }, [level, lives, score, unlocked, won, gameOver, debugMode, showIntro, isTutorial, playMode]);

  const press = (key: string, value: boolean) => {
    keys.current[key] = value;
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isTutorial) {
      audio.pause();
      setStatus("El tutorial no usa musica: es practica antes del album.");
      return;
    }
    if (musicEnabled) {
      audio.pause();
      setMusicEnabled(false);
      persistProgress({ ...progress, musicEnabled: false });
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
        persistProgress({ ...progress, musicEnabled: true });
        setStatus(`Sonando: ${tracks[level].title}`);
      })
      .catch(() => {
        setMusicEnabled(false);
        setStatus(`Falta public/audio/${tracks[level].audio}`);
      });
  };

  return (
    <main className="game-shell">
      {showGlobalIntro && (
        <div className="global-start">
          <div className="global-stars" aria-hidden="true" />
          <div className="global-card">
            <div className="global-scene" aria-hidden="true" />
            <span className="kicker">La Vida Era Mas Corta</span>
            <h1>Super Milo J</h1>
            <p>De Milo chico al Milo de ahora: 15 canciones, barrio, memoria, mates raros y una carrera hasta el Obelisco.</p>
            <div className="global-badges" aria-label="Resumen del juego">
              <span>15 canciones</span>
              <span>Mate power</span>
              <span>Obelisco final</span>
            </div>
            <div className="global-actions">
              <button type="button" onClick={() => { setPlayMode("album"); setShowGlobalIntro(false); }}>
                Empezar album
              </button>
              <button type="button" onClick={() => { setPlayMode("tutorial"); setShowGlobalIntro(false); }}>
                Tutorial
              </button>
              <button type="button" onClick={toggleMusic}>
                {musicEnabled ? "Musica ON" : "Musica"}
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="stage-panel" aria-label="Juego Milo J Pixel Run">
        <div className="topbar">
          <div>
            <span className="kicker">Super Milo J v22</span>
            <h1>Super Milo J</h1>
          </div>
          <div className="level-readout">
            <strong>{levelLabel}</strong>
            <span>{currentTrack.theme}</span>
          </div>
        </div>

        <div className="canvas-wrap">
          <canvas ref={canvasRef} width={width} height={height} aria-label="Escenario del juego" />
          {showIntro && (
            <div className="start-screen">
              <span>{levelLabel}</span>
              <h2>{currentTrack.title}</h2>
              <p>{currentTrack.theme}</p>
              <button type="button" onClick={() => setShowIntro(false)}>
                Jugar
              </button>
            </div>
          )}
        </div>

        <div className="hud">
          <div className="hud-status">
            <p>{status}</p>
            <div className="route-progress" aria-label="Progreso del nivel">
              <span style={{ width: `${routeProgress}%` }} />
            </div>
          </div>
          <div className="actions">
            <button type="button" onClick={() => setLevel((value) => Math.max(0, value - 1))} disabled={isTutorial || level === 0}>
              Anterior
            </button>
            <button type="button" onClick={() => resetLevel(level)}>
              Reiniciar
            </button>
            <button type="button" onClick={toggleMusic}>
              {musicEnabled ? "Pausar musica" : "Musica"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (isTutorial) {
                  setPlayMode("album");
                  setLevel(0);
                } else {
                  setLevel((value) => Math.min(unlocked - 1, value + 1));
                }
              }}
              disabled={!isTutorial && level >= unlocked - 1}
            >
              {isTutorial ? "Ir al album" : "Siguiente"}
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
        <button
          type="button"
          className={isTutorial ? "active" : ""}
          onClick={() => setPlayMode("tutorial")}
        >
          <span>00</span>
          <strong>Tutorial</strong>
          <small>Practica sin cancion ni progreso del album</small>
        </button>
        {tracks.map((track, index) => (
          <button
            type="button"
            key={track.title}
            className={!isTutorial && index === level ? "active" : ""}
            disabled={index >= unlocked}
            onClick={() => { setPlayMode("album"); setLevel(index); }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{track.title}</strong>
            <small>
              {index < unlocked
                ? `${track.theme} | best ${progress.bestScores[index] ?? 0} | notas ${progress.notesCollected[index] ?? 0}`
                : "bloqueado"}
            </small>
          </button>
        ))}
      </aside>
    </main>
  );
}
