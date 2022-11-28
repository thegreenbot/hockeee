import Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class PlayScene extends BaseScene {
  private sling: MatterJS.Constraint | null;

  public player1Text: string;
  public player2Text: string;
  public player3Text: string;
  public player4Text: string;
  public topBar: any;
  public bottomBar: any;
  public turnStarted: boolean;

  constructor(config: object) {
    super("PlayScene", config);
    this.sling = null;

    this.turnStarted = false;
    this.player1Text = "player 1: 0";
    this.player2Text = "player 2: 0";
    this.player3Text = "player 3: 0";
    this.player4Text = "player 4: 0";
    this.topBar;
    this.bottomBar;
  }

  assembleAmmo() {
    let playConfig = this.getPlayConfig();
    const config = this.getConfig();

    Object.entries(playConfig.players).forEach((player) => {
      const {ammo, start} = player[1];
      let lastX = start.x;
      ammo.forEach((ammoItem) => {
        ammoItem.setCollisionGroup(this.nonCollidingGroup);
        ammoItem.setAlpha(0.5);
        ammoItem.setScale(0.5);
        ammoItem.x = lastX;
        if (lastX <= config.width /2) {
          lastX = lastX + 32;
        } else {
          lastX = lastX -32;
        }
      });
    });
  }

  createBalls() {
    const playConfig = this.getPlayConfig();
    const ammoCount = 5;

    Object.entries(playConfig.players).forEach((player) => {
      for (let index = 0; index < ammoCount; index++) {
        const { start, spriteFrame, name } = playConfig.players[player[0]];
        const ball = this.createBall(
          start.x,
          start.y,
          spriteFrame,
          name,
          index + 1
        );
        ball.setData("belongsTo", name);
        ball.setCollisionGroup(this.nonCollidingGroup);
        playConfig.players[player[0]].ammo.push(ball);
      }
    });

    this.assembleAmmo();
    this.setPlayConfig(playConfig);
  }

  createAnims() {
    const animConf = [
      { key: "player1", start: 0, end: 11 },
      { key: "player2", start: 12, end: 23 },
      { key: "player3", start: 24, end: 35 },
      { key: "player4", start: 36, end: 47 },
    ];
    animConf.forEach((anim) => {
      this.createAnim(anim.key, anim.start, anim.end);
    });
  }

  hasAmmo(player: object) {
    return player.ammo.length();
  }

  setNextPlayer(player: string = '') {
    const playConfig = this.getPlayConfig();
    // who is current player
    const currentPlayer = (player != '') ? player : playConfig.currentPlayer;

    switch(currentPlayer) {
      case 'player1':
        if (player) {
          if (playConfig.players.player1.ammo.length() > 0) {
            playConfig.currentPlayer = 'player1';
          } 
        } else {
          this.setNextPlayer('player2');
        }
        break;
      case 'player2':
        if (player) {
          if (playConfig.players.player2.ammo.length() > 0) {
            playConfig.currentPlayer = 'player2';
          } else {
            this.setNextPlayer('player3');
          }
        }
        break;
      case 'player3':
        if (player) {
          if (playConfig.players.player3.ammo.length() > 0) {
            playConfig.currentPlayer = 'player3';
          } else {
            this.setNextPlayer('player4');
          }
        }
        break;
      case 'player4':
        if (player) {
          if (playConfig.players.player4.ammo.length() > 0) {
            playConfig.currentPlayer = 'player4';
          } else {
            this.setNextPlayer('player1');
          }
        }
        break;
    }
    this.setPlayConfig(playConfig);
    // who is next in line index-wise, who still has ammo
    // that result should be set to this.currentPlayer.
    // if no ammo, tabulate score & display score with menu to restart
  }

  calculateScore() {
    // should look at zones & balls
    // match score to player
  }

  preload() {}

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
    const config = this.getConfig();
    const playConfig = this.getPlayConfig();
    let posX = config.width / 2;
    let posY = 0;
    let ball = this.getNextBall();
    ball.setScale(1).setAlpha(1).setDepth(10);
    ball.setInteractive();
    ball.setCollisionGroup(this.nonCollidingGroup);
    this.input.setDraggable(ball);
    const startRect = this.matter.add.rectangle(posX, posY, 5, 5, {isStatic: true, collisionFilter: {group: this.nonCollidingGroup}});
    switch (playConfig.currentPlayer) {
      case "player1" || "player3":
        // create sling in position 1
        // move ball into place
        ball.x = posX;
        ball.y = config.height - 70;
        startRect.position = {x: config.width/2, y: config.height - 70};
        this.sling = this.matter.add.constraint(startRect, ball.body, 0, 0.1);
        break;
      case "player2" || "player4":
        // create sling in position 2
        ball.x = posX;
        ball.y = 70;
        startRect.position = {x: config.width/2, y: 70};
        this.sling = this.matter.add.constraint(startRect, ball.body, 0, 0.1);
        break;
      default:
        break;
    }
  }

  createCollisionGroups() {
    this.nonCollidingGroup = this.matter.world.nextGroup(true);
    this.collidingGroup = this.matter.world.nextGroup();
    this.collidingCategory = this.matter.world.nextCategory();
  }

  createInputs() {
    this.input.on(
      "dragend",
      function (pointer: any, gameObject: { disableInteractive: () => void }) {
        this.turnStarted = true;
        console.log(gameObject);
        setTimeout(() => {
          const ref: Phaser.Physics.Matter.Sprite = this.sling.bodyB;
          this.sling.bodyB = null;
          this.matter.world.remove(this.sling.bodyA);
          this.input.setDraggable(gameObject, false);
          gameObject.disableInteractive();
          this.matter.world.remove(this.sling);
        }, 20);
      },
      this
    );

    // collision start when pokeBalls hit
    // decriment ball health/density

    this.matter.world.on('collisionstart', function(event){
     var pairs = event.pairs;
     console.log("Pair no visible: ", pairs)
     console.log("Pair visible: ", pairs[0]);
     console.log("colision between " + pairs[0].bodyA.label + " - " + pairs[0].bodyB.label);
    })
  }

  createGameGrid() {
    const config = this.getConfig();

    // background 1
    const bg1 = this.matter.add.image(0, 100, "bg1");
    bg1.flipY = true;
    bg1.displayHeight = config.height / 2 - 100;
    bg1.setDepth(1);
    bg1.setOrigin(0, 0);
    bg1.setSensor(true);
    bg1.setStatic(true);

    // background 2
    const bg2 = this.matter.add.image(0, config.height / 2, "bg2", undefined, {isSensor: true, isStatic: true});
    bg2.displayHeight = config.height / 2 - 100;
    bg2.setDepth(1);
    bg2.setOrigin(0, 0);

    const centerLine = this.add.line(
      config.width / 2,
      config.height / 2,
      0,
      0,
      config.width,
      0,
      0x6666ff
    );
    centerLine.setLineWidth(2, 2);
    centerLine.setDepth(2);

    // Player text
    const p1t = this.add.text(5, config.height - 80, this.player1Text);
    const p2t = this.add.text(config.width - 5, 80, this.player2Text);
    p2t.rotation = Math.PI;
    const p3t = this.add
      .text(config.width - 5, config.height - 80, this.player3Text)
      .setOrigin(1, 0);
    const p4t = this.add.text(5, 80, this.player4Text).setOrigin(1, 0);
    p4t.rotation = Math.PI;


    // player zones
    // @TODO: this may not work as planned. it may be better to just detect puck position on playEnd. 
    
    const p4zone = this.add.zone(0, 0, config.width/2, 100).setRectangleDropZone(config.width/2, 100).setName('p4zone').setOrigin(0, 0);
    const p3zone = this.add.zone(config.width/2, config.height-100, config.width/2, 100).setRectangleDropZone(config.width/2, 100).setName('p3zone').setOrigin(0, 0);
    const p2zone = this.add.zone(config.width/2, 0, config.width/2, 100).setRectangleDropZone(config.width/2, 100).setName('p2zone').setOrigin(0, 0);
    const p1zone = this.add.zone(0, config.height - 100, config.width/2, 100).setRectangleDropZone(config.width/2, 100).setName('p1zone').setOrigin(0, 0);

    const topZone = this.add.zone(0, 100, config.width, config.height/2 -200).setRectangleDropZone(config.width, config.height/2 -200).setName('topZone').setOrigin(0, 0);
    const bottomZone = this.add.zone(0, config.height/2, config.width, config.height/2 - 200).setRectangleDropZone(config.width, config.height/2 -200).setName('bottomZone').setOrigin(0, 0);
  
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

  checkIfPucksHaveStopped(): boolean {
    // for some reason this isn't detecting body speed. not sure why...
    let stopped = true;
    const all = this.matter.world.getAllBodies();
    let shouldSkip = false;
    all.forEach((body) => {
      if (!stopped) {
        return;
      }
      if (body.speed != 0 ) {
        stopped = false;
      }
    });
    return stopped;
  }

  cleanup(): void {
    const all = this.matter.world.getAllBodies();
    const config = this.getConfig();
    const playConfig = this.getPlayConfig();

    all.forEach((body) => {
      if (body.gameObject) {
        // if body in top area
        if (body.gameObject.y < 80) {
          // is in p4 quadrant?
          if (body.gameObject.x < config.width / 2) {
            body.gameObject.setData("belongsTo", "player4");
            playConfig.players.player4.ammo.push(body.gameObject);
          }

          // is in p2 quadrant?
          if (body.gameObject.x > config.width / 2) {
            body.gameObject.setData("belongsTo", "player2");
            playConfig.players.player2.ammo.push(body.gameObject);
          }
        }

        // if body in bottom area
        if (body.gameObject.y > config.height - 80) {
          // is in p3 quadrant
          if (body.gameObject.x > config.width/2) {
            body.gameObject.setData("belongsTo", "player3");
            playConfig.players.player3.ammo.push(body.gameObject);
          }
          // is in p1 quadrant
          if (body.gameObject.x < config.width/2) {
            body.gameObject.setData("belongsTo", "player1");
            playConfig.players.player1.ammo.push(body.gameObject);
          }
        }
      }

      this.setPlayConfig(playConfig);
    });

    this.assembleAmmo();
    
    this.startTurn();
  }

  update(time: number, delta: number): void {
    if (this.turnStarted) {
      // fire off method to check speed of matter bodies.
      if (this.checkIfPucksHaveStopped()) {
        this.turnStarted = false;
        this.cleanup();
        // run cleanup
        // tally score
        // start next turn
      }
    }
  }
}
