import BaseScene from "./BaseScene";

class PreloadScene extends BaseScene {
    constructor(config: object) {
        super('PreloadScene', config);
    }

    preload(): void {
        this.load.spritesheet('poke', 'pokeballs.png',{ frameWidth: 54, frameHeight: 54, margin: 5, spacing: 10 });
    }

    create(): void {
         this.scene.start('DebugScene');
    }
}

export default PreloadScene;