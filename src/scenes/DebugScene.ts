import Phaser from 'phaser';
import { createSling } from '../gameObjects/sling';
import BaseScene from './BaseScene';

export default class DebugScene extends BaseScene {

  private sling1: MatterJS.Constraint | null;
  private sling2: MatterJS.Constraint | null;
  private player1ball: Phaser.Physics.Matter.Sprite | null;
  private player2ball: Phaser.Physics.Matter.Sprite | null;
  private player3ball: Phaser.Physics.Matter.Sprite | null;
  private player4ball: Phaser.Physics.Matter.Sprite | null;

  constructor(config: object) {
    super('DebugScene', config);
    this.sling1 = null;
    this.sling2 = null;
    this.player1ball = null;
    this.player2ball = null;
    this.player3ball = null;
    this.player4ball = null;
  }

  createBall(x: number, y: number, frame: number, player: string) {
    const ball = this.matter.add.sprite(x, y, 'poke', frame);
    ball.setBounce(0.8)
    ball.setCircle(26);
    ball.setAlpha(0.2);
    ball.name = `${player}Ball`;
    return ball;
  }

  createBalls() {
    const config = this.getConfig();

    this.player1ball = this.createBall(30, config.height - 30, 0);
    this.player1ball.name = "player1ball";

    this.player2ball = this.createBall(config.width - 30, 30, 12);
    this.player2ball.name = "player2ball";

    this.player3ball = this.createBall(config.width - 30, config.height - 30, 24);
    this.player3ball.name = "player3ball";

    this.player4ball = this.createBall(30, 30, 36);
    this.player4ball.name = "player4ball";
  }

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

  createAnims() {
    const animConf = [
      {key: 'player1', start: 0, end: 11},
      {key: 'player2', start: 12, end: 23},
      {key: 'player3', start: 24, end: 35},
      {key: 'player4', start: 36, end: 47}
    ];
    animConf.forEach(anim => {
      this.createAnim(anim.key, anim.start, anim.end) 
    });
  }

  createSlings() {
    const config = this.getConfig();
    const ballA = this.matter.add.sprite(config.width / 2, 50, 'poke', 5, { restitution: 1, mass: 10, label: 'ballstart1' }).setCircle(26).setInteractive();
    const ballB = this.matter.add.sprite(config.width / 2, config.height - 50, 'poke', 3, { restitution: 0.4, mass: 10, label: 'ballstart1' }).setCircle(26).setInteractive();
    this.sling1 = createSling({
      pointA: { x: config.width / 2, y: 50 },
      bodyB: ballA.body
    });
    this.sling2 = createSling({
      pointA: { x: config.width / 2, y: 50 },
      bodyB: ballB.body
    });
  }

  preload() { }

  startTurn() {
    const playConfig = this.getPlayConfig();
    switch (playConfig.currentPlayer) {
      case 'player1' || 'player3':
        this.setPlayConfig('currentSling', this.sling1);
        this.matter.world.add(this.sling1);
        break;
      case 'player2' || 'player4':
        this.setPlayConfig('currentSling', this.sling2);
        this.matter.world.add(this.sling2);
        break;
      default:
        break;
    }
  }


  create(): void {

    this.createSlings();
    this.createAnims();
    this.createBalls();
    this.startTurn();

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    this.input.on('dragend', function (pointer, gameObject) {
      console.log('up', gameObject);
    }, this);

  }

  update() {

  }
}