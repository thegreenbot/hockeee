import BaseScene from './BaseScene';

export default class DebugMenuScene extends BaseScene {

  menu: object;

  constructor(config: object) {
    super('DebugMenuScene', config);
    this.menu = [
      { scene: 'BallAnimationScene', text: 'Ball Animations' },
      { scene: 'BallDamageScene', text: 'Ball Damage'},
      { scene: 'CollisionDebugScene', text: 'Collisions'},
      { scene: 'ScoreDebugScene', text: 'Tally Score'},
      { scene: 'SlingScene', text: 'Sling'},
      { scene: 'ParallaxScene', text: 'Parallax'},
      { scene: 'TypesDebugScene', text: 'Types'},
      { scene: 'MenuScene', text: 'Back' }
    ]
  }

  preload() { }

  create(): void {
    super.create();
    this.createMenu(this.menu, (menuItem: object) => this.setupMenuEvents(menuItem));
  }

  setupMenuEvents(menuItem: object) {
    const textObject = menuItem.textObject;
    textObject.setInteractive();

    textObject.on('pointerover', () => {
      textObject.setStyle({ fill: '#ff0' });
    })

    textObject.on('pointerout', () => {
      textObject.setStyle({ fill: '#fff' });
    })

    textObject.on('pointerup', () => {
      menuItem.scene && this.scene.start(menuItem.scene);
    })
  }
}