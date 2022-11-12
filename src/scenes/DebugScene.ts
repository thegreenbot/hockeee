import Phaser from 'phaser';
import { createSling } from '../gameObjects/sling';
import BaseScene from './BaseScene';

export default class DebugScene extends BaseScene {

  private sling1: MatterJS.Constraint | null;
  private sling2: MatterJS.Constraint | null;
  public inactiveCategory: number;
  public activeCategory: number;
  public player1Text: string;
  public player2Text: string;
  public player3Text: string;
  public player4Text: string;

  constructor(config: object) {
    super('DebugScene', config);
    this.sling1 = null;
    this.sling2 = null;
    this.inactiveCategory = 0;
    this.activeCategory = 0;
    this.player1Text = 'Player 1: 0';
    this.player2Text = 'Player 2: 0';
    this.player3Text = 'Player 3: 0';
    this.player4Text = 'Player 4: 0';
  }

  createBall(x: number, y: number, frame: number, player: string, index: number) {
    const ball = this.matter.add.sprite(x, y, 'poke', frame);
    ball.setBounce(0.8)
    ball.setCircle(26);
    ball.setAlpha(0.2);
    ball.setScale(0.5);
    ball.name = `${player}Ball-${index}`;
    return ball;
  }

  createBalls() {
    const playConfig = this.getPlayConfig();

    const ammoCount = 5;

    Object.entries(playConfig.players).forEach((player) => {
      let lastx = playConfig.players[player[0]].start.x;
      for (let index = 0; index < ammoCount; index++) {
        const { start, spriteFrame, name } = playConfig.players[player[0]];
        if (lastx <= 200) {
          lastx = lastx + 40;
        } else {
          lastx = lastx - 40;
        }
        const ball = this.createBall(lastx, start.y, spriteFrame, name, index + 1);
        playConfig.players[player[0]].ammo.push(ball);
      }
    });

    this.setPlayConfig(playConfig);
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

  createSling() {

    const config = this.getConfig();
    const playConfig = this.getPlayConfig();
    // get next ball from player
    // create container for sling
    // create sling, bind ball to it
    // set this.currentSling to the created sling
    const CurrentPlayer = playConfig.players[playConfig.currentPlayer];

    const rectangle = this.add.rectangle(config.width / 2, config.height, 300, 400, 0x00aaaa, 1);

    const ballA = this.matter.add.sprite(config.width / 2, 80, 'poke', 5, { restitution: 1, mass: 10, label: 'ballstart1' }).setCircle(26);
    const ballB = this.matter.add.sprite(config.width / 2, config.height - 80, 'poke', 3, { restitution: 0.4, mass: 10, label: 'ballstart1' }).setCircle(26);
    this.sling1 = createSling({
      pointA: { x: config.width / 2, y: 80 },
      bodyB: ballA.body
    });
    this.sling2 = createSling({
      pointA: { x: config.width / 2, y: config.height - 80 },
      bodyB: ballB.body
    });
  }

  preload() { }

  getNextBall() {
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
        const posY = config.height - 200;
        const ball = this.getNextBall();
        ball.play(playConfig.currentPlayer);
        ball.x = posX;
        ball.y = posY;
        const sling = createSling({
          pointA: { x: posX, y: posY },
          bodyB: ball.body
        });
        this.matter.world.add(sling);
        break;
      case 'player2' || 'player4':
        // create sling in position 2
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
    this.input.on('dragend', function(pointer, gameObject) {
      setTimeout(() => {
        const ref = this.sling1.bodyB;
        this.sling1.bodyB = null;
      }, 50);
    }, this);
  }

  createGameGrid() {
    const config = this.getConfig();

    // background 1
    const bg1 = this.add.image(0, 100, 'bg1');
    bg1.flipY;
    bg1.displayHeight = config.height / 2 - 100;
    bg1.setOrigin(0, 0);

    // background 2
    const bg2 = this.add.image(0, config.height / 2, 'bg2');
    bg2.displayHeight = config.height / 2 - 100;
    bg2.setOrigin(0, 0);

    const centerLine = this.add.line(config.width / 2, config.height / 2, 0, 0, config.width, 0, 0x6666ff);
    centerLine.setLineWidth(5, 5);

    // top
    this.add.line(0, 30, 0, 30, 200, 30, 0x6666ff).setOrigin(0, 0);
    this.add.line(150, 30, 150, 30, config.width, 30, 0x6666ff).setOrigin(0, 0);
    
    // bottom
    this.add.line(0, config.height- 30, 0, config.height -30, 200, config.height -30, 0x6666ff).setOrigin(0, 0).setDepth(100);
    this.add.line(150, config.height - 30, 150, config.height -30, config.width, config.height - 30, 0x6666ff).setOrigin(0, 0).setDepth(100);

    // rectangles 
    this.add.rectangle(config.width / 2 - 50, 0, 100, 100, 0x6666ff).setOrigin(.5, 0);
    this.add.rectangle(config.width / 2 - 50, config.height - 100, 100, 100, 0x6666ff).setOrigin(.5, 0);

    // Player text
    const p1t = this.add.text(195, 80, this.player1Text);
    p1t.rotation = Math.PI;

    const p2t = this.add.text(config.width - 105, 80, this.player2Text);
    p2t.rotation = Math.PI;
  }

  create(): void {
    this.createCollisionCategories();
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