import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SKINS } from '../../config/skins';
import { TrailSystem, TrailStyle } from '../../game/TrailSystem';
import { GAME_CONFIG } from '../../config/gameConfig';
import { GameCanvasProps, Pipe } from '../../types/game';

// Destructure config for easier usage
const {
    GRAVITY,
    JUMP_STRENGTH,
    PIPE_SPEED,
    PIPE_SPAWN_RATE,
    BIRD_SIZE,
    PIPE_WIDTH,
    PIPE_GAP,
    PIPE_CAP_HEIGHT,
    MIN_PIPE_HEIGHT,
    HITBOX_NORMAL,
    HITBOX_SMALL
} = GAME_CONFIG;

export default function GameCanvas({
    fid,
    initialHighScore = 0,
    activeSkin = 'base_blue_jay',
    onGameOver,
    isPlaying = true
}: GameCanvasProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(initialHighScore);
    const [gameActive, setGameActive] = useState(false);

    // Image Refs
    const bgImg = useRef<HTMLImageElement | null>(null);
    const birdImg = useRef<HTMLImageElement | null>(null);
    const pipeBodyImg = useRef<HTMLImageElement | null>(null);
    const pipeCapImg = useRef<HTMLImageElement | null>(null);

    // Trail System
    const trailSystem = useRef<TrailSystem>(new TrailSystem());
    const currentTrailStyle = useRef<TrailStyle>('blocks');

    // Load Images
    useEffect(() => {
        if (typeof window !== "undefined") {
            const load = (src: string) => {
                const img = new Image();
                img.src = src;
                return img;
            };

            // Static assets
            bgImg.current = load('/background.svg');
            pipeBodyImg.current = load('/pipe_body.svg');
            pipeCapImg.current = load('/pipe_cap.svg');
        }
    }, []);

    // Chroma Key Processing for Accessibility
    const processSprite = useCallback((img: HTMLImageElement): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            // Create offscreen canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(img);
                return;
            }

            // Draw image to canvas
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Target color: Magenta #FF00FF (255, 0, 255)
            // We use a small tolerance to handle compression artifacts if any
            const targetR = 255;
            const targetG = 0;
            const targetB = 255;
            const tolerance = 50; // Increased tolerance for reliability

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (
                    Math.abs(r - targetR) < tolerance &&
                    Math.abs(g - targetG) < tolerance &&
                    Math.abs(b - targetB) < tolerance
                ) {
                    data[i + 3] = 0; // Set alpha to 0 (transparent)
                }
            }

            // Put modified data back
            ctx.putImageData(imageData, 0, 0);

            // Create new image from processed canvas
            const newImg = new Image();
            newImg.src = canvas.toDataURL();
            newImg.onload = () => resolve(newImg);
        });
    }, []);

    // Load Bird Skin and Trail Style
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Dynamic asset
            const skin = SKINS.find(s => s.id === activeSkin) || SKINS[0];
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Required for canvas manipulation if served from external
            img.src = skin.assetPath;

            img.onload = async () => {
                const processedImg = await processSprite(img);
                birdImg.current = processedImg;
            };

            // Set trail style from skin
            currentTrailStyle.current = skin.trailStyle as TrailStyle;
            trailSystem.current.setStyle(currentTrailStyle.current);
        }
    }, [activeSkin, processSprite]);

    // Sync high score from props
    useEffect(() => {
        if (initialHighScore > highScore) {
            setHighScore(initialHighScore);
        }
    }, [initialHighScore]);

    // Start game when isPlaying becomes true
    useEffect(() => {
        if (isPlaying && !gameActive) {
            startGame();
        }
    }, [isPlaying]);

    // Game Mutable State
    const birdY = useRef(300);
    const birdVelocity = useRef(0);
    const pipes = useRef<Pipe[]>([]);
    const lastPipeTime = useRef(0);
    const requestRef = useRef<number>();
    const scoreRef = useRef(0);
    const gameActiveRef = useRef(false);

    const spawnPipe = useCallback((canvasWidth: number, canvasHeight: number) => {
        const maxPipeHeight = canvasHeight - PIPE_GAP - MIN_PIPE_HEIGHT;
        const randomHeight = Math.floor(Math.random() * (maxPipeHeight - MIN_PIPE_HEIGHT + 1)) + MIN_PIPE_HEIGHT;

        pipes.current.push({
            x: canvasWidth,
            topHeight: randomHeight,
            passed: false
        });
    }, []);

    const resetGame = () => {
        birdY.current = 300;
        birdVelocity.current = 0;
        pipes.current = [];
        scoreRef.current = 0;
        setScore(0);
        trailSystem.current.clear();
    };

    const startGame = () => {
        resetGame();
        gameActiveRef.current = true;
        setGameActive(true);
        lastPipeTime.current = performance.now();
    };

    const jump = () => {
        if (gameActiveRef.current) {
            birdVelocity.current = JUMP_STRENGTH;
        }
    };

    const gameOver = () => {
        gameActiveRef.current = false;
        setGameActive(false);

        const finalScore = scoreRef.current;

        // Save high score
        if (finalScore > highScore) {
            setHighScore(finalScore);
            if (fid) {
                fetch('/api/user/score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fid, score: finalScore })
                }).catch(console.error);
            }
        }

        // Notify parent
        if (onGameOver) {
            onGameOver(finalScore);
        }
    };

    const checkCollision = (canvasHeight: number) => {
        // Floor/Ceiling collision
        if (birdY.current + BIRD_SIZE >= canvasHeight || birdY.current <= 0) {
            return true;
        }

        // Hitbox Logic (Pay-to-Win)
        const hitboxScale = activeSkin === 'small_bird' ? HITBOX_SMALL : HITBOX_NORMAL;
        const effectiveSize = BIRD_SIZE * hitboxScale;
        const offset = (BIRD_SIZE - effectiveSize) / 2;

        const birdLeft = 50 + offset;
        const birdRight = 50 + BIRD_SIZE - offset;
        const birdTop = birdY.current + offset;
        const birdBottom = birdY.current + BIRD_SIZE - offset;

        for (const pipe of pipes.current) {
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;

            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
                    return true;
                }
            }
        }

        return false;
    };

    const update = (time: number, ctx: CanvasRenderingContext2D, width: number, height: number) => {
        if (!gameActiveRef.current) return;

        // Physics
        birdVelocity.current += GRAVITY;
        birdY.current += birdVelocity.current;

        // Pipe Spawning
        if (time - lastPipeTime.current > PIPE_SPAWN_RATE) {
            spawnPipe(width, height);
            lastPipeTime.current = time;
        }

        // Pipe Movement & Cleanup
        pipes.current.forEach(pipe => {
            pipe.x -= PIPE_SPEED;
        });

        if (pipes.current.length > 0 && pipes.current[0].x + PIPE_WIDTH < 0) {
            pipes.current.shift();
        }

        // Score counting
        pipes.current.forEach(pipe => {
            if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
                pipe.passed = true;
                scoreRef.current += 1;
                setScore(scoreRef.current);
            }
        });

        // Collision
        if (checkCollision(height)) {
            gameOver();
            return;
        }

        // Trail particles
        trailSystem.current.spawn(50, birdY.current, BIRD_SIZE);
        trailSystem.current.update();

        // Set combo mode for Validator Owl special effect
        trailSystem.current.setCombo(scoreRef.current >= 5 && scoreRef.current % 5 === 0);
    };

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);

        // Background
        if (bgImg.current && bgImg.current.complete && bgImg.current.naturalWidth > 0) {
            ctx.drawImage(bgImg.current, 0, 0, width, height);
        } else {
            ctx.fillStyle = '#70c5ce';
            ctx.fillRect(0, 0, width, height);
        }

        // Pipes
        pipes.current.forEach(pipe => {
            if (pipeBodyImg.current && pipeCapImg.current && pipeBodyImg.current.complete && pipeCapImg.current.complete) {
                // Top Pipe
                ctx.drawImage(pipeBodyImg.current, pipe.x, 0, PIPE_WIDTH, pipe.topHeight - PIPE_CAP_HEIGHT);
                ctx.drawImage(pipeCapImg.current, pipe.x, pipe.topHeight - PIPE_CAP_HEIGHT, PIPE_WIDTH, PIPE_CAP_HEIGHT);

                // Bottom Pipe
                const bottomPipeY = pipe.topHeight + PIPE_GAP;
                const bottomPipeHeight = height - bottomPipeY;
                ctx.drawImage(pipeCapImg.current, pipe.x, bottomPipeY, PIPE_WIDTH, PIPE_CAP_HEIGHT);
                ctx.drawImage(pipeBodyImg.current, pipe.x, bottomPipeY + PIPE_CAP_HEIGHT, PIPE_WIDTH, bottomPipeHeight - PIPE_CAP_HEIGHT);
            } else {
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
                ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, height - (pipe.topHeight + PIPE_GAP));
            }
        });

        // Trail particles (draw behind bird)
        trailSystem.current.draw(ctx);

        // Bird
        if (birdImg.current && birdImg.current.complete) {
            ctx.drawImage(birdImg.current, 50, birdY.current, BIRD_SIZE, BIRD_SIZE);
        } else {
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(50, birdY.current, BIRD_SIZE, BIRD_SIZE);
        }
    };

    const loop = (time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (gameActiveRef.current) {
            update(time, ctx, canvas.width, canvas.height);
        }

        draw(ctx, canvas.width, canvas.height);

        requestRef.current = requestAnimationFrame(loop);
    };

    // Game Loop Effect
    useEffect(() => {
        requestRef.current = requestAnimationFrame(loop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Handle Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative w-full max-w-[430px] mx-auto h-[600px] overflow-hidden border-4 border-black bg-sky-200">
            <canvas
                ref={canvasRef}
                width={430}
                height={600}
                className="block w-full h-full cursor-pointer touch-none"
                onPointerDown={(e) => {
                    e.preventDefault();
                    jump();
                }}
            />

            {/* Score HUD */}
            <div className="absolute top-10 w-full text-center pointer-events-none">
                <span className="text-5xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] font-mono">{score}</span>
            </div>
        </div>
    );
}
