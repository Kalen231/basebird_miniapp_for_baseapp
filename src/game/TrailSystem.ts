// Trail Particle System for Bird Skins
// Each skin has a unique trail style

export type TrailStyle = 'blocks' | 'scanlines' | 'sparks' | 'frame' | 'noise' | 'rays' | 'shards' | 'confetti';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    alpha: number;
    rotation?: number;
    shape?: 'square' | 'line' | 'circle' | 'triangle';
}

// Color palettes for each trail style
const TRAIL_COLORS: Record<TrailStyle, string[]> = {
    blocks: ['#0052FF', '#3070FF', '#1E4AE9'],      // Base blue
    scanlines: ['#9945FF', '#14F195', '#00D1FF'],   // Solana gradient
    sparks: ['#FFD700', '#FFA500', '#FF6B00', '#CCCCCC'], // Metal sparks
    frame: ['#4A90D9', '#7AB8F5', '#A8D4FF'],       // Translucent blue layers
    noise: ['#00FF00', '#FF00FF', '#00FFFF', '#FFFFFF'], // Glitch colors
    rays: ['#FFD700', '#FFF8DC', '#FFFACD'],        // Golden finality rays
    shards: ['#FF6B9D', '#C44AFF', '#6B9DFF', '#9DFFB3', '#FFD700'], // Rainbow iridescent
    confetti: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'] // Festive minimal
};

export class TrailSystem {
    private particles: Particle[] = [];
    private style: TrailStyle = 'blocks';
    private frameCount: number = 0;
    private comboActive: boolean = false;

    setStyle(style: TrailStyle) {
        this.style = style;
    }

    setCombo(active: boolean) {
        this.comboActive = active;
    }

    spawn(x: number, y: number, birdSize: number) {
        this.frameCount++;

        // Different spawn rates per style
        const spawnRate = this.getSpawnRate();
        if (this.frameCount % spawnRate !== 0) return;

        const colors = TRAIL_COLORS[this.style];
        const baseX = x;
        const baseY = y + birdSize / 2;

        switch (this.style) {
            case 'blocks':
                this.spawnBlocks(baseX, baseY, colors);
                break;
            case 'scanlines':
                this.spawnScanlines(baseX, baseY, colors);
                break;
            case 'sparks':
                this.spawnSparks(baseX, baseY, colors);
                break;
            case 'frame':
                this.spawnFrame(baseX, baseY - birdSize / 2, birdSize, colors);
                break;
            case 'noise':
                this.spawnNoise(baseX, baseY, colors);
                break;
            case 'rays':
                this.spawnRays(baseX + birdSize / 2, baseY - birdSize / 2, colors);
                break;
            case 'shards':
                this.spawnShards(baseX, baseY, colors);
                break;
            case 'confetti':
                this.spawnConfetti(baseX, baseY, colors);
                break;
        }
    }

    private getSpawnRate(): number {
        switch (this.style) {
            case 'blocks': return 3;
            case 'scanlines': return 2;
            case 'sparks': return 2;
            case 'frame': return 4;
            case 'noise': return 2;
            case 'rays': return this.comboActive ? 2 : 6;
            case 'shards': return 3;
            case 'confetti': return 8; // Very minimal
            default: return 3;
        }
    }

    private spawnBlocks(x: number, y: number, colors: string[]) {
        // Square geometric blocks - Base Blue Jay
        for (let i = 0; i < 2; i++) {
            this.particles.push({
                x: x + 20 - Math.random() * 10, // Emanate from bird body
                y: y + (Math.random() - 0.5) * 20,
                vx: -2 - Math.random() * 2,
                vy: (Math.random() - 0.5) * 1,
                life: 20 + Math.random() * 10,
                maxLife: 30,
                size: 4 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.8,
                shape: 'square'
            });
        }
    }

    private spawnScanlines(x: number, y: number, colors: string[]) {
        // Fast scanning horizontal lines - Solana Neon Swallow
        this.particles.push({
            x: x - 5,
            y: y + (Math.random() - 0.5) * 30,
            vx: -6 - Math.random() * 3,
            vy: 0,
            life: 12 + Math.random() * 8,
            maxLife: 20,
            size: 15 + Math.random() * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.7,
            shape: 'line'
        });
    }

    private spawnSparks(x: number, y: number, colors: string[]) {
        // Metal dust and sparks - Clanker Chrome Crow
        for (let i = 0; i < 3; i++) {
            const angle = Math.PI + (Math.random() - 0.5) * 1.2;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x: x - 5,
                y: y + (Math.random() - 0.5) * 15,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed + Math.random() * 2,
                life: 15 + Math.random() * 15,
                maxLife: 30,
                size: 2 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                shape: 'circle'
            });
        }
    }

    private spawnFrame(x: number, y: number, size: number, colors: string[]) {
        // Rectangular batch frame - Rollup Robin
        // Creates corners of a rectangle that trails behind
        const frameWidth = size * 1.5;
        const frameHeight = size * 1.2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Only spawn full frame occasionally
        if (this.frameCount % 8 === 0) {
            // Top line
            this.particles.push({
                x: x - 10,
                y: y - 5,
                vx: -3,
                vy: 0,
                life: 25,
                maxLife: 25,
                size: frameWidth,
                color: color,
                alpha: 0.4,
                shape: 'line'
            });
            // Bottom line
            this.particles.push({
                x: x - 10,
                y: y + frameHeight,
                vx: -3,
                vy: 0,
                life: 25,
                maxLife: 25,
                size: frameWidth,
                color: color,
                alpha: 0.4,
                shape: 'line'
            });
        }
    }

    private spawnNoise(x: number, y: number, colors: string[]) {
        // Chaotic glitch dots - Mempool Finch
        const count = Math.random() > 0.7 ? 5 : 2; // Sometimes burst
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x - Math.random() * 15,
                y: y + (Math.random() - 0.5) * 30,
                vx: -2 - Math.random() * 2 + (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 4,
                life: 8 + Math.random() * 12,
                maxLife: 20,
                size: 2 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.9,
                shape: Math.random() > 0.5 ? 'square' : 'circle'
            });
        }
    }

    private spawnRays(x: number, y: number, colors: string[]) {
        // Finality crown rays - Validator Owl
        // Enhanced during combo
        const rayCount = this.comboActive ? 8 : 3;
        const baseAlpha = this.comboActive ? 0.8 : 0.3;

        for (let i = 0; i < rayCount; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
            this.particles.push({
                x: x,
                y: y - 10,
                vx: Math.cos(angle) * 0.5,
                vy: Math.sin(angle) * 2 - 1,
                life: 15 + Math.random() * 10,
                maxLife: 25,
                size: 8 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: baseAlpha,
                rotation: angle,
                shape: 'line'
            });
        }
    }

    private spawnShards(x: number, y: number, colors: string[]) {
        // Reflective glass shards - MEV Magpie
        for (let i = 0; i < 2; i++) {
            const angle = Math.PI + (Math.random() - 0.5) * 0.8;
            this.particles.push({
                x: x - 5,
                y: y + (Math.random() - 0.5) * 20,
                vx: -3 - Math.random() * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 20 + Math.random() * 10,
                maxLife: 30,
                size: 5 + Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.6,
                rotation: Math.random() * Math.PI,
                shape: 'triangle'
            });
        }
    }

    private spawnConfetti(x: number, y: number, colors: string[]) {
        // Minimal dust confetti - Airdrop Canary
        // Very rare, very subtle
        if (Math.random() > 0.5) return;

        this.particles.push({
            x: x - 5,
            y: y + (Math.random() - 0.5) * 15,
            vx: -1 - Math.random() * 2,
            vy: (Math.random() - 0.5) * 1 + 0.5,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            size: 3 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.5,
            rotation: Math.random() * Math.PI,
            shape: 'square'
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.alpha = (p.life / p.maxLife) * 0.8;

            // Gravity for sparks
            if (this.style === 'sparks') {
                p.vy += 0.1;
            }

            // Rotation for shards and confetti
            if (p.rotation !== undefined && (this.style === 'shards' || this.style === 'confetti')) {
                p.rotation += 0.1;
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.strokeStyle = p.color;

            switch (p.shape) {
                case 'square':
                    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                    break;

                case 'circle':
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case 'line':
                    ctx.lineWidth = 2;
                    if (p.rotation !== undefined) {
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation);
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(p.size, 0);
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p.x + p.size, p.y);
                        ctx.stroke();
                    }
                    break;

                case 'triangle':
                    ctx.translate(p.x, p.y);
                    if (p.rotation) ctx.rotate(p.rotation);
                    ctx.beginPath();
                    ctx.moveTo(0, -p.size / 2);
                    ctx.lineTo(p.size / 2, p.size / 2);
                    ctx.lineTo(-p.size / 2, p.size / 2);
                    ctx.closePath();
                    ctx.fill();
                    break;

                default:
                    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            }

            ctx.restore();
        }
    }

    clear() {
        this.particles = [];
    }
}
