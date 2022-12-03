import Ball from "../../gameObjects/Ball";
import Player from "../../gameObjects/Player";
import BaseScene from "../BaseScene";

export default class SlingScene extends BaseScene {
  public ammo: Array<Ball> = [];
  public sling: MatterJS.ConstraintType | null = null;
  private players: Array<Player> = [];
  public turnStarted = false;

  private lastPlayer: number = 0;
  private currentPlayer: number = 0;

  constructor(config: object) {
    super("SlingScene", { ...config, canGoBack: false });
  }

  createAnimations() {
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

  createAmmo(ammoCount: number = 2) {
    const playConfig = this.getPlayConfig();
    var particlesManager = this.add.particles("flares");

    this.players.map((player, index) => {
      let { x, y } = player.getStartVector();
      for (let i = 0; i < ammoCount; i++) {
        const ball = new Ball(
          this,
          x,
          y,
          player.getSpriteFrame(),
          particlesManager,
          player.getEmittercolor(),
          player.getName()
        );
        ball.setScale(0.5);
        ball.setStatic(true);
        
        ball.setCollisionGroup(this.nonCollidingGroup);
        player.addAmmo(ball);
        this.ammo.push(ball);

        if (index === 0 || index === 3) {
          x = x + 30;
        } else {
          x = x - 30;
        }
      }
    });
  }

  createPlayers() {
    for (let i = 0; i < 4; i++) {
      const config = this.getConfig();
      const player = new Player(config, `player${i + 1}`, i);
      this.players.push(player);
    }
  }

  setCurrentPlayer() {
     this.currentPlayer < 3 
      ? this.currentPlayer++ 
      : this.currentPlayer = 0;
  }

  canPlay() {
    let canplay = false;
    this.players.map((player) => {
      if (canplay) {
        return;
      } else {
        canplay = player.hasAmmo();
      }
    });
    return canplay;
  }

  startTurn(player?: number) {
      if (this.canPlay()) {
        if (player || player === 0) {
          this.currentPlayer = player;
        } else {
          this.setCurrentPlayer();
        }
        this.createSling();
      } else {
        // game over!
      }
  }

  createSling() {
    const config = this.getConfig();
    const posX = config.width / 2;
    const posY = (this.currentPlayer === 0 || this.currentPlayer === 2) ? config.height - 70 : 70;
    const startRect = this.matter.add.rectangle(posX, posY, 5, 5, {
      isStatic: true,
      collisionFilter: { group: this.nonCollidingGroup },
    });
    const ball = this.players[this.currentPlayer].getAmmo();
    ball?.setX(posX);
    ball?.setY(posY);
    ball?.setScale(1);
    ball?.setInteractive();
    ball?.setStatic(false);
    this.input.setDraggable(ball);
    this.sling = this.matter.add.constraint(startRect, ball?.body, 0, 0.1);
  }

  createInputs() {
    this.input.on(
      "dragend",
      function(pointer, ball: Ball) {
        this.turnStarted = true;
        setTimeout(() => {
          this.input.setDraggable(ball.body.gameObject, false);
          this.sling.bodyB = null;
          this.matter.world.remove(this.sling.bodyA);
          ball.setCollisionGroup(this.collidingGroup);
          ball.body.gameObject.disableInteractive();
          ball.body.ignorePointer = true;
          this.matter.world.remove(this.sling);
        }, 20);
      }, this
    );
  }

  create() {
    super.create();
    this.createPlayers();
    this.createAnimations();
    this.createAmmo(5);
    this.createInputs();
    this.startTurn(0);
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  checkIfBallsHaveStopped(): boolean {
    let stopped = true;
    this.ammo.map((ball) => {
      if (!stopped) {
        return
      }
      if (ball.body.speed != 0) {
        stopped = false;
      }
    });
    return stopped;
  }

  update(time: number, delta: number): void {
    
    this.ammo.forEach((ball: Ball) => {
      ball.updateAnimation();
    });

    if (this.turnStarted) {
    if (this.checkIfBallsHaveStopped()) {
      this.turnStarted = false;
      this.startTurn();
    }
    }
  }
}
