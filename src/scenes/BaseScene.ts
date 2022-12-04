import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  private config: object;

  private playConfig: object;
  public collidingGroup: number;
  public nonCollidingGroup: number;
  public collidingCategory: number;
  public noncollidingCategory: number;
  public fontOptions: object;
  public menu: object;

  constructor(key: string, config: object) {
    super(key);
    this.config = config;
    this.collidingGroup=0;
    this.nonCollidingGroup=0;
    this.collidingCategory=0;
    this.noncollidingCategory=0;
    this.fontOptions = { fontSize: `32px`, fill: '#fff' };
    this.menu = {};

    this.playConfig = {
      currentPlayer: 0,
      numPlayers: 4,
    };
  }

  getConfig(): Phaser.Types.Core.GameConfig {
    return this.config;
  }

  getPlayConfig() {
    return this.playConfig;
  }

  setPlayConfig(config: object) {
    this.playConfig = config;
  }

  createMenu(menu, setupMenuEvents) {
    const {width, height}= this.getConfig();
    let lastMenuPosition = 0;
    menu.forEach(menuItem => {
      const menuPosition = [width/2, height/2 + lastMenuPosition];
      menuItem.textObject = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
      lastMenuPosition += 42;
      setupMenuEvents(menuItem);
    })
  }

  createBall(x: number, y: number, frame: number, player: string, index: number): Phaser.Physics.Matter.Sprite {
    const matterBodyConfig: Phaser.Types.Physics.Matter.MatterBodyConfig = {
      restitution: 1,
      circleRadius: 26,
      density: 10,
      frictionAir: 0.03
    }
    const ball = this.matter.add.sprite(x, y, 'poke', frame, matterBodyConfig);
    ball.name = `${player}Ball-${index}`;
    return ball;
  };
  
  createAnim(key: string, start: number, end: number) {
    this.anims.create({
      key: key,
      frames: this.anims.generateFrameNumbers('poke', {
        start: start,
        end: end
      },
      ),
      frameRate: 10,
      repeat: -1
    });
  };

  createCollisionGroups() {
    this.nonCollidingGroup = this.matter.world.nextGroup(true);
    this.collidingGroup = this.matter.world.nextGroup();
    this.collidingCategory = this.matter.world.nextCategory();
  }

  preload(): void { }
  create(): void {
    this.createCollisionGroups();
    if (this.config.canGoBack) {
      const backButton = this.add.image(this.config.width - 10, this.config.height - 10, 'back').setOrigin(1).setScale(2).setInteractive();
      backButton.on('pointerup', () => {
          this.scene.start('DebugMenuScene');
      });
  }
   }
  update(time: number, delta: number): void { }

}

export default BaseScene;