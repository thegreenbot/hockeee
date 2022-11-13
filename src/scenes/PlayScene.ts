import Phaser from 'phaser';
import { createSling } from '../gameObjects/sling';
import BaseScene from './BaseScene';

export default class PlayScene extends BaseScene {

  private sling: MatterJS.Constraint | null;
  public inactiveGroup: number;
  public activeGroup: number;
  public activeCategory: number;
  public player1Text: string;
  public player2Text: string;
  public player3Text: string;
  public player4Text: string;
  public topBar: any;
  public bottomBar: any;

  constructor(config: object) {
    super('PlayScene', config);
    this.sling = null;
    this.inactiveGroup= 0;
    this.activeGroup= 0;
    this.activeCategory=0;
    this.player1Text = 'Player 1: 0';
    this.player2Text = 'Player 2: 0';
    this.player3Text = 'Player 3: 0';
    this.player4Text = 'Player 4: 0';
    this.topBar;
    this.bottomBar;
  }

  createBalls() {
    const playConfig = this.getPlayConfig();
    // sean's comment
    const ammoCount = 5;

    Object.entries(playConfig.players).forEach((player) => {
      let lastx = playConfig.players[player[0]].start.x;
      for (let index = 0; index < ammoCount; index++) {
        const { start, spriteFrame, name } = playConfig.players[player[0]];
        const ball = this.createBall(lastx, start.y, spriteFrame, name, index + 1);
        if (lastx <= 200) {
          lastx = lastx + 30;
        } else {
          lastx = lastx - 30;
        }
        ball.setCollisionGroup(this.inactiveGroup);
        playConfig.players[player[0]].ammo.push(ball);
      }
    });

    this.setPlayConfig(playConfig);
  }

  createAnims() {
    const animConf = [
      { key: 'player1', start: 0, end: 11 },
      { key: 'player2', start: 12, end: 23 },
      { key: 'player3', start: 24, end: 35 },
      { key: 'player4', start: 36, end: 47 }
    ];
    animConf.forEach(anim => {
      this.createAnim(anim.key, anim.start, anim.end)
    });
  }

  setNextPlayer() {
    const playConfig = this.getPlayConfig();
    // who is current player
    // who is next in line index-wise, who still has ammo
    // that result should be set to this.currentPlayer.
    // if no ammo, tabulate score & display score with menu to restart
  }

  calculateScore() {
    // should look at zones & balls
    // match score to player
  }

  preload() { }

  getNextBall(): Phaser.Physics.Matter.Sprite {
    const playConfig = this.getPlayConfig();
    const ball = playConfig.players[playConfig.currentPlayer].ammo.pop();
    this.setPlayConfig(playConfig);
    return ball;
  }

  startTurn() {
    // called immediately on game start
    // also called once balls stop moving
    // should call setNextPlayer();
    // should call createSling();
    const config = this.getConfig();
    const playConfig = this.getPlayConfig();
    switch (playConfig.currentPlayer) {
      case 'player1' || 'player3':
        // create sling in position 1
        const posX = config.width / 2;
        const posY = config.height - 70;
        const ball = this.getNextBall();
        ball.setScale(1);
        ball.setAlpha(1);
        ball.setDepth(5);
        ball.x = posX;
        ball.y = posY;
        ball.setInteractive();
        ball.setCollisionGroup(this.activeGroup);
        this.input.setDraggable(ball);
        const spr = this.matter.add.spring(
          this.bottomBar, 
          ball.body, 
          0, 
          0.3, 
          );
        this.sling = spr;
        break;
      case 'player2' || 'player4':
        // create sling in position 2
        break;
      default:
        break;
    }
  }

  createCollisionGroups() {
    this.inactiveGroup= this.matter.world.nextGroup(true);
    this.activeGroup= this.matter.world.nextGroup();
    this.activeCategory = this.matter.world.nextCategory();
  }

  createInputs() {
    this.input.on('dragend', function(pointer, gameObject) {
      setTimeout(() => {
        const ref = this.sling.bodyB;
        this.sling.bodyB = null;
      }, 10);
    this.matter.world.remove(this.sling);
    }, this);
  }

  createGameGrid() {
    const config = this.getConfig();

    // background 1
    const bg1 = this.add.image(0, 100, 'bg1');
    bg1.flipY;
    bg1.displayHeight = config.height / 2 - 100;
    bg1.setDepth(1);
    bg1.setOrigin(0, 0);

    // background 2
    const bg2 = this.add.image(0, config.height / 2, 'bg2');
    bg2.displayHeight = config.height / 2 - 100;
    bg2.setDepth(1);
    bg2.setOrigin(0, 0);

    const centerLine = this.add.line(config.width / 2, config.height / 2, 0, 0, config.width, 0, 0x6666ff);
    centerLine.setLineWidth(5, 5);
    centerLine.setDepth(2);

    const startContainer = this.add.container();
    startContainer.add([
      this.add.line(0, 0, 0, 60, config.width/2 - 100, 60, 0xff0000).setOrigin(0, 0),
      this.add.line(0, 0, config.width/2 + 100, 60, config.width, 60, 0xff0000).setOrigin(0, 0),
      this.add.line(0, 0, 200, 0, 200, 60, 0xff0000).setOrigin(0, 0),
      this.add.line(0, 0, 400, 0, 400, 60, 0xff0000).setOrigin(0, 0),
      this.add.line(0, 0, 0, config.height - 60, config.width/2 - 100, config.height -60, 0xff0000).setOrigin(0, 0),
      this.add.line(0, 0, config.width/2 + 100, config.height - 60, config.width, config.height - 60, 0xff0000).setOrigin(0, 0),
      this.add.line(0, 0, config.width/ 2 - 100, config.height -60, config.width/2 -100, config.height, 0xff0000).setOrigin(0, 0),
      this.add.line(0, 0, config.width/2 +100, config.height - 60, config.width/2 +100, config.height, 0xff0000).setOrigin(0, 0)
    ]);

    this.matter.add.rectangle(config.width/2 - 100, 50, 5, 100, {isStatic: true});
    this.matter.add.rectangle(config.width/2 + 100, 50, 5, 100, {isStatic: true});
    this.topBar = this.matter.add.rectangle(config.width/2, 100, 5, config.width, {angle: Math.PI/2, isStatic: true, isSensor: true});
    this.matter.add.rectangle(config.width/2 - 100, config.height -50, 5, 100, {isStatic: true});
    this.matter.add.rectangle(config.width/2 + 100, config.height - 50, 5, 100, {isStatic: true});
    this.bottomBar = this.matter.add.rectangle(config.width/2, config.height - 100, 5, config.width, {angle: Math.PI/2, isStatic: true, });

    // rectangles 
    this.add.rectangle(config.width / 2, 50, 200, 100, 0x6666ff).setDepth(-1);
    this.add.rectangle(config.width / 2, config.height - 50, 200, 100, 0x6666ff).setDepth(-1);

    // Player text
    const p1t = this.add.text(5, config.height - 80, this.player1Text);
    const p2t = this.add.text(config.width - 5, 80, this.player2Text);
    p2t.rotation = Math.PI;
    const p3t = this.add.text(405, config.height - 80, this.player3Text);
    const p4t = this.add.text(195, 80, this.player4Text);
    p4t.rotation = Math.PI;
  }

  create(): void {
    this.createCollisionGroups();
    this.createGameGrid();
    this.createAnims();
    this.createBalls();
    this.createInputs();
    this.startTurn();

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

  }

  update() {

  }
}