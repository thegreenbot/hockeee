import Phaser from "phaser";
import Ball from "../gameObjects/Ball";
import BottomGoal from "../gameObjects/BottomGoal";
import Player from "../gameObjects/Player";
import TopGoal from "../gameObjects/TopGoal";
import { createCollisionEvents } from "../utils/collisionEvents";
import BaseScene from "./BaseScene";

export default class PlayScene extends BaseScene {
  public sling: MatterJS.ConstraintType | null = null;
  public topBar: any;
  public bottomBar: any;
  public turnStarted: boolean = false;
  public isPaused: boolean = false;
  private players: Array<Player> = [];
  public ammo: Array<Ball> = [];
  public currentPlayer: number = 0;
  public activeTween: Phaser.Tweens.Tween | null = null;
  public topGoal: TopGoal | null = null;
  public bottomGoal: BottomGoal | null = null;

  constructor(config: object) {
    super("PlayScene", config);
  }

  createPause() {
    this.isPaused = true;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setOrigin(1)
      .setScale(3)
      .setInteractive();

    pauseButton.on("pointerdown", () => {
      console.log("pause");
      this.matter.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  arrangeAmmo() {
    this.players.map((player, index) => {
      let { x, y } = player.getStartVector();
      const ammo = player.getAllAmmo();
      ammo.map((item) => {
        this.tweens.add({
          targets: item,
          x: x,
          y: y,
          duration: 250,
          ease: "Sine.easeOut",
          yoyo: false,
          repeat: 0,
        });

        if (index === 0 || index === 3) {
          x = x + 30;
        } else {
          x = x - 30;
        }
      });
    });
  }

  createAmmo(ammoCount: number = 2) {
    const particlesManager = this.add.particles("flares");

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
      }
    });
    this.arrangeAmmo();
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

  createPlayers() {
    for (let i = 0; i < 4; i++) {
      const config = this.getConfig();
      const text = this.add.text(0, 0, `player${i + 1}: 0`);
      const player = new Player(config, `player${i + 1}`, i);
      player.setTextObject(text);
      this.players.push(player);
    }
  }

  setCurrentPlayer(index: number) {
    const current = this.currentPlayer;
    if (index) {
      if (this.players[index].hasAmmo()) {
        this.currentPlayer = index;
      } else if(current < 3) {
        this.setCurrentPlayer(current + 1);
      } else {
        this.setCurrentPlayer(0);
      }
    }

    this.currentPlayer < 3 ? this.currentPlayer++ : (this.currentPlayer = 0);
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
      console.log("game over");
    }
  }

  createSling() {
    const config = this.getConfig();
    const posX = config.width / 2;
    let posY = 70;
    if (this.currentPlayer === 0 || this.currentPlayer === 2) {
      posY = config.height - 70;
      this.topGoal?.play();
      this.bottomGoal?.stop();
    } else {
      posY = 70;
      this.topGoal?.stop();
      this.bottomGoal?.play();
    }
    const startRect = this.matter.add.rectangle(posX, posY, 5, 5, {
      isStatic: true,
      collisionFilter: { group: this.nonCollidingGroup },
    });
    const ball = this.players[this.currentPlayer].getAmmo();
    this.makeAmmoPlayable(ball);
    console.log(ball);
    this.tweens.add({
      targets: ball,
      x: posX,
      y: posY,
      yoyo: false,
      repeat: 0,
      ease: 'Sine.easeInOut',
      duration: 500,
      delay: 0
    });
    setTimeout(() => {
    this.sling = this.matter.add.constraint(startRect, ball?.body, 0, 0.1);
    }, 500);
    this.activeTween = this.tweens.add({
      targets: ball,
      scale: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 1000,
      delay: 100,
    });
  }

  makeAmmoPlayable(ammo: Ball | undefined) {
    if (ammo) {
      ammo.setScale(1);
      ammo.setDepth(1);
      ammo.setInteractive();
      ammo.setStatic(false);
      this.input.setDraggable(ammo);
      ammo.body.ignorePointer = false;
    }
  }

  createCollisionGroups() {
    this.nonCollidingGroup = this.matter.world.nextGroup(true);
    this.collidingGroup = this.matter.world.nextGroup();
    this.collidingCategory = this.matter.world.nextCategory();
  }

  createInputs() {
    this.input.on("dragend", (pointer, ball) => {
      setTimeout(() => {
        this.input.setDraggable(ball.body.gameObject, false);
        this.sling.bodyB = null;
        this.matter.world.remove(this.sling.bodyA);
        ball.setCollisionGroup(this.collidingGroup);
        ball.body.gameObject.disableInteractive();
        ball.body.ignorePointer = true;
        this.matter.world.remove(this.sling);
        this.tweens.remove(this.activeTween);
        this.turnStarted = true;
      }, 20);
    });
  }

  createGameGrid() {
    const config = this.getConfig();
    const rect = this.add.line(
      config.width / 2,
      0,
      0,
      config.height / 2,
      config.width,
      config.height / 2,
      0xff0000
    );
    rect.setDepth(10);

    this.topGoal = new TopGoal(this, config);
    this.bottomGoal = new BottomGoal(this, config);

    // Player text
    const p1t = this.players[0].getTextObject();
    p1t.setX(5);
    p1t.setY(config.height - 80);
    const p2t = this.players[1].getTextObject();
    p2t.setX(config.width - 5);
    p2t.setY(80);
    p2t.rotation = Math.PI;
    const p3t = this.players[2].getTextObject();
    p3t.setOrigin(1, 0);
    p3t.setX(config.width - 5);
    p3t.setY(config.height - 80);
    const p4t = this.players[3].getTextObject();
    p4t?.setOrigin(1, 0);
    p4t.setX(5);
    p4t.setY(80);
    p4t.rotation = Math.PI;
  }

  checkIfBallsHaveStopped(): boolean {
    let stopped = true;
    this.ammo.map((ball) => {
      if (!stopped) {
        return;
      }
      if (ball.body.speed >= 0.05) {
        stopped = false;
      }
    });
    return stopped;
  }

  create(): void {
    this.createCollisionGroups();
    this.createPlayers();
    this.createGameGrid();
    this.lights.enable();
    this.lights.setAmbientColor(0x808080);
    this.lights.addLight(0, 0, 10);
    this.createPause();
    this.createAnimations();
    this.createAmmo(5);
    this.createInputs();
    const topgoal = this.topGoal?.getSensor();
    const bottomgoal = this.bottomGoal?.getSensor();
    createCollisionEvents([topgoal, bottomgoal], this.ammo, this);
    setTimeout(() => {
      this.startTurn(0);
    }, 400);

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  possessAmmo(player: string, ammo: Ball) {
    let frame = 0;
    let targetPlayer = null;
    switch (player) {
      case "player1":
        frame = 0;
        targetPlayer = this.players[0];
        break;
      case "player2":
        frame = 12;
        targetPlayer = this.players[1];
        break;
      case "player3":
        frame = 24;
        targetPlayer = this.players[2];
        break;
      case "player4":
        frame = 36;
        targetPlayer = this.players[3];
        break;
    }
    targetPlayer?.addAmmo(ammo);
    ammo.setFrame(frame);
    ammo.setAnimationName(player);
    ammo.body.gameObject.setData("belongsTo", player);
    ammo.setCollisionGroup(this.nonCollidingGroup);
    ammo.setScale(0.5);
    ammo.disableInteractive();
    ammo.setStatic(true);
    this.input.setDraggable(ammo.body.gameObject, false);
  }

  cleanup(): void {
    const config = this.getConfig();

    this.ammo.forEach((ammo) => {
      if (ammo.body && !ammo.body.isStatic) {
        const { position } = ammo.body;
        // if body in top area
        if (position.y < 100) {
          // is in p4 quadrant?
          if (position.x < config.width / 2) {
            this.possessAmmo("player4", ammo);
          }

          // is in p2 quadrant?
          if (position.x > config.width / 2) {
            this.possessAmmo("player2", ammo);
          }
        }

        // if body in bottom area
        if (position.y > config.height - 100) {
          // is in p3 quadrant
          if (position.x > config.width / 2) {
            this.possessAmmo("player3", ammo);
          }
          // is in p1 quadrant
          if (position.x < config.width / 2) {
            this.possessAmmo("player1", ammo);
          }
        }
      }
    });

    this.arrangeAmmo();
  }

  playGoalScenes() {
    const goals = [this.topGoal, this.bottomGoal];
    goals.forEach(zone => {
      if (zone?.playing) {
        zone?.goal?.each(item => {
          const scrollSpeed = item.data.get("scrollspeed");
          item.tilePositionX += scrollSpeed * 2;
        });
      }
    })
  }

  update(time: number, delta: number): void {
    this.ammo.forEach((ball: Ball) => {
      ball.updateAnimation();
      ball.setSpotlightPosition();
    });

    this.playGoalScenes();

    if (this.turnStarted) {
      // fire off method to check speed of matter bodies.
      if (this.checkIfBallsHaveStopped()) {
        this.turnStarted = false;
        this.cleanup();

        setTimeout(() => {
          this.startTurn();
        }, 200);
      }
    }

    this.players.map((player, index) => {
      const text = player.getTextObject();
      const score = player.getScore();
      text?.setText(`Player${index + 1}: ${score}`);
    });
  }
}
