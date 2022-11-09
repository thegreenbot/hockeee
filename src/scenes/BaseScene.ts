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
            players: 4,
            player1: {
                score: 0,
                ammo: 5
            },
            player2: {
                score: 0,
                ammo: 5
            },
            player3: {
                score: 0,
                ammo: 5
            },
            player4: {
                score: 0,
                ammo: 5
            }
        };
    }

    getConfig() {
        return this.config;
    }

    getPlayConfig() {
        return this.playConfig;
    }

    setPlayConfig(property: string, value: any) {
        this.playConfig[property] = value;
    }

    preload(): void { }
    create(): void { }
    update(time: number, delta: number): void { }

}

export default BaseScene;