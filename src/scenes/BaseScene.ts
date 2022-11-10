import { Vector } from 'matter';
import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

    private config: object;

    private playConfig: object;

    constructor(key: string, config: object) {
        super(key);
        this.config = config;

        this.playConfig = {
            currentPlayer: 'player1',
            currentSling: null,
            players: [
                {
                    name: 'player1',
                    score: 0,
                    ammo: [],
                    spriteFrame: 0,
                    start: {
                        x: 30,
                        y: config.height - 30
                    }
                },
                {
                    name: 'player2',
                    score: 0,
                    ammo: [],
                    spriteFrame: 12,
                    start: {
                        x: config.width - 30,
                        y: 30
                    }
                },
                {
                    name: 'player3',
                    score: 0,
                    ammo: [],
                    spriteFrame: 24,
                    start: {
                        x: config.width - 30,
                        y: config.height - 30
                    }
                },
                {
                    name: 'player4',
                    score: 0,
                    ammo: [],
                    spriteFrame: 36,
                    start: {
                        x: 30, 
                        y: 30
                    }
                }
            ]
        };
    }

    getConfig() {
        return this.config;
    }

    getPlayConfig() {
        return this.playConfig;
    }

    setPlayConfig(config: object) {
        this.playConfig = config;
    }

    preload(): void { }
    create(): void { }
    update(time: number, delta: number): void { }

}

export default BaseScene;