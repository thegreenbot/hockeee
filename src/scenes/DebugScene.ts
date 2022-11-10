import Phaser from 'phaser';
import { createSling } from '../gameObjects/sling';
import BaseScene from './BaseScene';

export default class DebugScene extends BaseScene {

  private sling1: MatterJS.Constraint | null;
  private sling2: MatterJS.Constraint | null;
  public inactiveCategory: number;
  public activeCategory: number;

  constructor(config: object) {
    super('DebugScene', config);
    this.sling1 = null;
    this.sling2 = null;
    this.inactiveCategory= 0;
    this.activeCategory= 0;
  }

  createBall(x: number, y: number, frame: number, player: string, index: number) {
    const ball = this.matter.add.sprite(x, y, 'poke', frame);
    ball.setBounce(0.8)
    ball.setCircle(26);
    ball.setAlpha(0.2);
    ball.name = `${player}Ball-${index}`;
    return ball;
  }

  createBalls() {
    const { players } = this.getPlayConfig();

    const ammoCount = 5;
    
    players.forEach(player => {
      let lastx = player.start.x;
      for (let index = 0; index < ammoCount; index++) {
        const { start, spriteFrame, name} = player;
        if (lastx <=200) {
         lastx = lastx +40; 
        } else {
          lastx = lastx -40;
        }
        const ball = this.createBall(lastx, start.y, spriteFrame, name, index+1)
        player.ammo.push(ball);
      }
    })
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

  createSling() {

    const config = this.getConfig();
    const playConfig = this.getPlayConfig();
    // get next ball from player
    // create container for sling
    // create sling, bind ball to it
    // set this.currentSling to the created sling

    const ballA = this.matter.add.sprite(config.width / 2, 80, 'poke', 5, { restitution: 1, mass: 10, label: 'ballstart1' }).setCircle(26);
    const ballB = this.matter.add.sprite(config.width / 2, config.height - 80, 'poke', 3, { restitution: 0.4, mass: 10, label: 'ballstart1' }).setCircle(26);
    this.sling1 = createSling({
      pointA: { x: config.width / 2, y: 80},
      bodyB: ballA.body
    });
    this.sling2 = createSling({
      pointA: { x: config.width / 2, y: config.height - 80},
      bodyB: ballB.body
    });
  }

  preload() { }

  startTurn() {
    // called immediately on game start
    // also called once balls stop moving
    // should call setNextPlayer();
    // should call createSling();
    const playConfig = this.getPlayConfig();
    switch (playConfig.currentPlayer) {
      case 'player1' || 'player3':
        // create sling

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

  createCollisionCategories() {
    this.inactiveCategory = this.matter.world.nextCategory();
    this.activeCategory = this.matter.world.nextCategory();
  }

  createInputs() {
    this.input.on('dragend', function (pointer, gameObject) {
      setTimeout(() => {
        const ref = this.sling1.bodyB;
        this.sling1.bodyB = null;
      }, 50);
    }, this);
  }

  create(): void {
    this.createCollisionCategories();
    this.createSling();
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