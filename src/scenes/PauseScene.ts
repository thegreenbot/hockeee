import BaseScene from './BaseScene';

export default class PauseScene extends BaseScene {

  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      {scene: 'PlayScene', text: 'Continue'},
      {scene: 'MenuScene', text: 'Exit'},
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textObject = menuItem.textObject;
    textObject.setInteractive();

    textObject.on('pointerover', () => {
        textObject.setStyle({fill: '#ff0'});
    })

    textObject.on('pointerout', () => {
        textObject.setStyle({fill: '#fff'});
    })

    textObject.on('pointerup', () => {
      if (menuItem.scene && menuItem.text === 'Continue') {
        // Shutting down the Pause Scene and resuming the Play Scene
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        // Shutting PlayScene, PauseScene and running Menu
        this.scene.stop('PlayScene');
        this.scene.start(menuItem.scene);
      }
    })
  }
}
