import Phaser from "phaser";

export default class Ball extends Phaser.Physics.Matter.Sprite {
    constructor(
        scene: { matter: { world: Phaser.Physics.Matter.World; }; }, 
        x: number, 
        y: number, 
        texture: string | Phaser.Textures.Texture, 
        frame: string | number | undefined,

    ) {
        super(scene.matter.world, x, y, texture, frame);
    }

    
    
}