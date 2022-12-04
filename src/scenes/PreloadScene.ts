import BaseScene from "./BaseScene";

class PreloadScene extends BaseScene {
    constructor(config: object) {
        super('PreloadScene', config);
    }

    preload(): void {
        this.load.spritesheet('poke', 'pokeballs.png',{ frameWidth: 54, frameHeight: 54, margin: 5, spacing: 10 });
        this.load.atlas('flares', 'flares.png', 'flares.json');
        this.load.image('bg1', 'bg1/sky.png');
        this.load.image('bg2', 'bg2/sky.png');
        this.load.image('bg3', 'bg3/sky.png');
        this.load.image('pause', 'pause.png');
        this.load.image('back', 'back.png');
    }

    create(): void {
         this.scene.start('PlayScene');
    }
}

export default PreloadScene;