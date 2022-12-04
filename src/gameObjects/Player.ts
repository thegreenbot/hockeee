import { Vector } from "matter";
import Ball from "./Ball";

export default class Player {

    private config: object; 
    private score: number = 0;
    private ammo: Array<Ball> = [];
    public name: string = '';
    private playerIndex: number;
    private emitterColors = ['red', 'blue', 'yellow', 'green'];
    private startVectors: Array<Vector>;
    private text: Phaser.GameObjects.Text|null = null;
    
    private baseSpriteFrames = [0, 12, 24, 36];
    
    constructor(config: object, name: string, playerIndex: number) {
        this.name = name;
        this.playerIndex = playerIndex;
        this.config = config;
        this.startVectors = [
            {x: 20, y: config.height - 20},
            {x: config.width - 20, y: 20},
            {x: config.width - 20, y: config.height - 20},
            {x: 20, y: 20}
        ];
    }

    setTextObject(textObject: Phaser.GameObjects.Text): void {
        this.text = textObject;
    }

    getTextObject(): Phaser.GameObjects.Text|null {
        return this.text;
    }

    getScore(): number {
        return this.score;
    }

    setScore(newScore: number): void {
        this.score = newScore;
    }

    hasAmmo(): boolean {
        return (this.ammo.length > 0);
    }

    addAmmo(ball: Ball): void {
        this.ammo.push(ball);
    }

    getAmmo(): Ball|undefined {
        return this.ammo.pop();
    }

    getAllAmmo(): Array<Ball> {
        return this.ammo;
    }

    getAmmoCount(): number {
        return this.ammo.length
    }

    getName(): string {
        return this.name;
    }

    getStartVector(): Vector {
        return this.startVectors[this.playerIndex];
    }
    
    getEmittercolor(): string {
        return this.emitterColors[this.playerIndex];
    }

    getSpriteFrame(): number {
        return this.baseSpriteFrames[this.playerIndex];
    }
}