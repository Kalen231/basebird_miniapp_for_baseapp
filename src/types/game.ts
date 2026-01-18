export interface Pipe {
    x: number;
    topHeight: number;
    passed: boolean;
}

export interface GameCanvasProps {
    fid?: number;
    initialHighScore?: number;
    activeSkin?: string;
    onGameOver?: (score: number) => void;
    isPlaying?: boolean;
}

export type GameScreen = 'menu' | 'playing' | 'gameover';
