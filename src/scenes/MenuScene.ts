import BaseScene from './BaseScene';
class MenuScene extends BaseScene {

  constructor(config) {
    super('MenuScene', config);
    this.menu = [
      { scene: 'PlayScene', text: 'Play' },
      { scene: 'DebugMenuScene', text: 'Debug' },
      { scene: null, text: 'Fullscreen' },
      { scene: null, text: 'Exit' }
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem))
  }

  setupMenuEvents(menuItem) {
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
      if (menuItem.text === 'Exit') {
        this.game.destroy(true);
      }
      if (menuItem.text === 'Fullscreen') {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      }
    })
  }
}

export default MenuScene;
