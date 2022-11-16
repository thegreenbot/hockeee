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

  assembleAmmo(player: string) {
    console.log('assembling');
    const playConfig = this.getPlayConfig();
    const config = this.getConfig();
    let lastx = playConfig.players[player].start.x;
    let posy = playConfig.players[player].start.y;
    playConfig.players[player].ammo.forEach((ammo) => {
      ammo.x = lastx;
      ammo.posy;
      if (lastx <= config.width / 2) {
        lastx = lastx + 32;
      } else {
        lastx = lastx - 32;
      }
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
        this.assembleAmmo(player[0]);
      }
    });

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
    switch (playConfig.currentPlayer) {
      case "player1" || "player3":
        // create sling in position 1
        // move ball into place
        ball.x = posX;
        ball.y = config.height - 70;
        const startRect = this.matter.add.rectangle(
          posX,
          config.height - 70,
          5,
          5,
          { isStatic: true, collisionFilter: { group: this.nonCollidingGroup } }
        );
        const spr = this.matter.add.constraint(startRect, ball.body, 0, 0.4);
        this.sling = spr;
        break;
      case "player2" || "player4":
        // create sling in position 2
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

    this.matter.world.on("sleepstart", function (event: any, body: any) {
      console.log("sleeping", body);
    });
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
    const bg2 = this.matter.add.image(0, config.height / 2, "bg2");
    bg2.displayHeight = config.height / 2 - 100;
    bg2.setDepth(1);
    bg2.setOrigin(0, 0);
    bg2.setSensor(true);
    bg2.setStatic(true);

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
    this.matter.add.rectangle(0, 100, config.width/2, 100, {isStatic: true, collisionFilter: {group: this.nonCollidingGroup}})
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
        console.log(body.speed);
        stopped = false;
      }
    });
    return stopped;
  }

  cleanup(): void {
    console.log('cleanup');
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
            this.assembleAmmo("player4");
          }

          // is in p2 quadrant?
          if (body.gameObject.x > config.width / 2) {
            body.gameObject.setData("belongsTo", "player2");
            playConfig.players.player2.ammo.push(body.gameObject);
            this.assembleAmmo("player2");
          }
        }

        // if body in bottom area
        if (body.gameObject.y > config.height - 80) {
          // is in p3 quadrant
          if (body.gameObject.x > config.width/2) {
            body.gameObject.setData("belongsTo", "player3");
            playConfig.players.player3.ammo.push(body.gameObject);
            this.assembleAmmo("player3");
          }
          // is in p1 quadrant
          if (body.gameObject.x < config.width/2) {
            body.gameObject.setData("belongsTo", "player1");
            playConfig.players.player1.ammo.push(body.gameObject);
            this.assembleAmmo("player1");
          }
        }
      }

      this.setPlayConfig(playConfig);
    });
  }

  update(time: number, delta: number): void {
    if (this.turnStarted) {
      // fire off method to check speed of matter bodies.
      if (this.checkIfPucksHaveStopped()) {
        console.log("they stopped");
        this.turnStarted = false;
        this.cleanup();
        // run cleanup
        // tally score
        // start next turn
      }
    }
  }
}
