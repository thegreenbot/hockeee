import BaseScene from "./BaseScene";

class PreloadScene extends BaseScene {
  constructor(config: object) {
    super('PreloadScene', config);
  }

  preload(): void {
    this.load.spritesheet('poke', 'pokeballs.png', { frameWidth: 54, frameHeight: 54, margin: 5, spacing: 10 });
    this.load.atlas('flares', 'flares.png', 'flares.json');
    this.load.image('bg1rocks_1', 'bg1/rocks_1.png');
    this.load.image('bg1rocks_2', 'bg1/rocks_2.png');
    this.load.image('bg1_sky', 'bg1/sky.png');
    this.load.image('bg1_clouds_1', 'bg1/clouds_1.png');
    this.load.image('bg1_clouds_2', 'bg1/clouds_2.png');
    this.load.image('bg1_clouds_3', 'bg1/clouds_3.png');
    this.load.image('bg1_clouds_4', 'bg1/clouds_4.png');

    this.load.image('bg4_sky', 'bg4/sky.png');
    this.load.image('bg4_clouds1', 'bg4/clouds_1.png');
    this.load.image('bg4_clouds2', 'bg4/clouds_2.png');
    this.load.image('bg4_ground', 'bg4/ground.png');
    this.load.image('bg4_rocks', 'bg4/rocks.png');
    this.load.image('pause', 'pause.png');
    this.load.image('back', 'back.png');
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}

export default PreloadScene;