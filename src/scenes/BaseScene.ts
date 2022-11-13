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
            numPlayers: 4,
            players: {
                player1: {
                    name: 'player1',
                    score: 0,
                    ammo: [],
                    spriteFrame: 0,
                    start: {
                        x: 0,
                        y: config.height - 30
                    }
                },
                player2: {
                    name: 'player2',
                    score: 0,
                    ammo: [],
                    spriteFrame: 12,
                    start: {
                        x: config.width,
                        y: 30
                    }
                },
                player3: {
                    name: 'player3',
                    score: 0,
                    ammo: [],
                    spriteFrame: 24,
                    start: {
                        x: config.width,
                        y: config.height - 30
                    }
                },
                player4: {
                    name: 'player4',
                    score: 0,
                    ammo: [],
                    spriteFrame: 36,
                    start: {
                        x: 0, 
                        y: 30
                    }
                }
            }
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