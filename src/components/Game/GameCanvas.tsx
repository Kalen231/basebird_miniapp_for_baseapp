"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sdk } from "@farcaster/miniapp-sdk";

// Game Constants
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 1500; // ms
const BIRD_SIZE = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_CAP_HEIGHT = 20;

type GameState = 'start' | 'playing' | 'gameover';

interface Pipe {
    x: number;
    topHeight: number;
    passed: boolean;
}

interface GameCanvasProps {
    fid?: number;
    initialHighScore?: number;
    activeSkin?: string;
}

export default function GameCanvas({ fid, initialHighScore = 0, activeSkin = 'default' }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(initialHighScore);

    // Image Refs
    const bgImg = useRef<HTMLImageElement | null>(null);
    const birdImg = useRef<HTMLImageElement | null>(null);
    const pipeBodyImg = useRef<HTMLImageElement | null>(null);
    const pipeCapImg = useRef<HTMLImageElement | null>(null);

    // Load Images
    useEffect(() => {
        if (typeof window !== "undefined") {
            const load = (src: string) => {
                const img = new Image();
                img.src = src;
                return img;
            };
            bgImg.current = load('/background.svg');
            birdImg.current = load('/bird.svg'); // Could support small_bird.svg if needed
            pipeBodyImg.current = load('/pipe_body.svg');
            pipeCapImg.current = load('/pipe_cap.svg');
        }
    }, []);

    // Sync high score from props (e.g. after API load)
    useEffect(() => {
        if (initialHighScore > highScore) {
            setHighScore(initialHighScore);
        }
    }, [initialHighScore]);

    // Handle Game Over and Score Saving
    useEffect(() => {
        if (gameState === 'gameover') {
            const finalScore = scoreRef.current;
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
        }
    }, [gameState, fid]);

    const handleShare = useCallback(() => {
        const text = `My record ${score} in BaseBird! Can you beat it?`;
        // Use NEXT_PUBLIC_URL from env, or fallback to window.location.origin
        const baseUrl = process.env.NEXT_PUBLIC_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
        const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${baseUrl}`;

        sdk.actions.openUrl(url);
    }, [score]);

    // Game Mutable State (Refs for performance in game loop)
    const birdY = useRef(300);
    const birdVelocity = useRef(0);
    const pipes = useRef<Pipe[]>([]);
    const lastPipeTime = useRef(0);
    const requestRef = useRef<number>();
    const scoreRef = useRef(0); // sync with state for loop access

    const spawnPipe = useCallback((canvasWidth: number, canvasHeight: number) => {
        const minPipeHeight = 50;
        const maxPipeHeight = canvasHeight - PIPE_GAP - minPipeHeight;
        const randomHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;

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
        setGameState('start');
        lastPipeTime.current = performance.now();
    };

    const startGame = () => {
        resetGame();
        setGameState('playing');
        lastPipeTime.current = performance.now();
    };

    const jump = () => {
        if (gameState === 'playing') {
            birdVelocity.current = JUMP_STRENGTH;
        } else if (gameState === 'start') {
            startGame();
        }
    };

    const gameOver = () => {
        setGameState('gameover');
    };

    const checkCollision = (canvasHeight: number) => {
        // Floor/Ceiling collision
        if (birdY.current + BIRD_SIZE >= canvasHeight || birdY.current <= 0) {
            return true;
        }

        // Hitbox Logic (Pay-to-Win)
        const hitboxScale = activeSkin === 'small_bird' ? 0.7 : 1.0;
        const effectiveSize = BIRD_SIZE * hitboxScale;
        const offset = (BIRD_SIZE - effectiveSize) / 2;

        const birdLeft = 50 + offset;
        const birdRight = 50 + BIRD_SIZE - offset;
        const birdTop = birdY.current + offset;
        const birdBottom = birdY.current + BIRD_SIZE - offset;

        for (const pipe of pipes.current) {
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;

            // Check if bird is within pipe's horizontal area
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                // Check if bird hits top pipe OR bottom pipe
                // Top pipe: y from 0 to topHeight
                // Bottom pipe: y from topHeight + GAP to canvasHeight
                if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
                    return true;
                }
            }
        }

        return false;
    };

    const update = (time: number, ctx: CanvasRenderingContext2D, width: number, height: number) => {
        if (gameState !== 'playing') return;

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

        // Remove off-screen pipes
        if (pipes.current.length > 0 && pipes.current[0].x + PIPE_WIDTH < 0) {
            pipes.current.shift();
        }

        // Score counting
        pipes.current.forEach(pipe => {
            if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) { // 50 is bird X
                pipe.passed = true;
                scoreRef.current += 1;
                setScore(scoreRef.current);
            }
        });

        // Collision
        if (checkCollision(height)) {
            gameOver();
            return; // Stop updating
        }
    };

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Clear
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
                // Draw Body
                ctx.drawImage(pipeBodyImg.current, pipe.x, 0, PIPE_WIDTH, pipe.topHeight - PIPE_CAP_HEIGHT);
                // Draw Cap
                ctx.drawImage(pipeCapImg.current, pipe.x, pipe.topHeight - PIPE_CAP_HEIGHT, PIPE_WIDTH, PIPE_CAP_HEIGHT);

                // Bottom Pipe
                const bottomPipeY = pipe.topHeight + PIPE_GAP;
                const bottomPipeHeight = height - bottomPipeY;
                // Draw Cap
                ctx.drawImage(pipeCapImg.current, pipe.x, bottomPipeY, PIPE_WIDTH, PIPE_CAP_HEIGHT);
                // Draw Body
                ctx.drawImage(pipeBodyImg.current, pipe.x, bottomPipeY + PIPE_CAP_HEIGHT, PIPE_WIDTH, bottomPipeHeight - PIPE_CAP_HEIGHT);

            } else {
                // Fallback to rects
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
                ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, height - (pipe.topHeight + PIPE_GAP));
            }
        });

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

        if (gameState === 'playing') {
            update(time, ctx, canvas.width, canvas.height);
        }

        // Always draw
        draw(ctx, canvas.width, canvas.height);

        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(loop);
        }
    };

    // Effect for the Game Loop
    useEffect(() => {
        requestRef.current = requestAnimationFrame(loop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState]); // Restart loop when gameState changes to playing

    // Handle Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

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

            {/* UI Overlays */}
            {gameState === 'start' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white z-10 pointer-events-none">
                    <h1 className="text-4xl font-bold mb-4 font-mono">Flappy Frame</h1>
                    <p className="text-xl animate-pulse font-mono">Tap or Space to Start</p>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10" onClick={(e) => {
                    // Prevent restart if clicking buttons
                    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
                    startGame();
                }}>
                    <h2 className="text-3xl font-bold mb-2 text-red-500 font-mono">Game Over</h2>
                    <p className="text-2xl mb-2 font-mono">Score: {score}</p>
                    <p className="text-xl mb-6 text-yellow-400 font-mono">High Score: {highScore}</p>

                    <div className="flex gap-4 mb-4">
                        <button
                            className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 font-mono"
                            onClick={startGame}
                        >
                            Try Again
                        </button>
                        <button
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 font-mono"
                            onClick={handleShare}
                        >
                            Share
                        </button>
                    </div>

                    <p className="mt-4 text-sm text-gray-300 font-mono">Tap anywhere to restart</p>
                </div>
            )}

            {/* Score HUD */}
            <div className="absolute top-10 w-full text-center pointer-events-none">
                <span className="text-5xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] font-mono">{score}</span>
            </div>
        </div>
    );
}
