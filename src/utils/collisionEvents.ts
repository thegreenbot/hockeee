import Phaser from "phaser";

export function createCollisionEvents(
  goals: Phaser.Physics.Matter.Image | Array<Phaser.Physics.Matter.Image[]>,
  ammo: Phaser.Physics.Matter.Image | Array<Phaser.Physics.Matter.Image[]>,
  scene: Phaser.Scene
) {
  scene.matterCollision.addOnCollideStart({
    objectA: goals,
    objectB: ammo,
    callback: (eventData) => {
      const { bodyA, bodyB, gameObjectB } = eventData;
      const gameObjectBData = gameObjectB.data
        ? gameObjectB.data.getAll()
        : false;
      if (gameObjectBData) {
        if (bodyA.label === "topgoal") {
          if (gameObjectBData["belongsto"] === "player1" && !gameObjectBData["ongoal"]) {
            const score = scene.players[0].getScore();
            scene.players[0].setScore(score + 1);
            gameObjectB.data.set("ongoal", true);
            gameObjectB.addSpotlight();
          }
          if (gameObjectBData["belongsto"] === "player3" && !gameObjectBData["ongoal"]) {
            const score = scene.players[2].getScore();
            scene.players[2].setScore(score + 1);
            gameObjectB.data.set("ongoal", true);
            gameObjectB.addSpotlight();
          }
        }
        if (bodyA.label === "bottomgoal") {
          if (gameObjectBData["belongsto"] === "player2" && !gameObjectBData["ongoal"]) {
            const score = scene.players[1].getScore();
            scene.players[1].setScore(score + 1);
            gameObjectB.data.set("ongoal", true);
            gameObjectB.addSpotlight();
          }
          if (gameObjectBData["belongsto"] === "player4" && !gameObjectBData["ongoal"]) {
            const score = scene.players[3].getScore();
            scene.players[3].setScore(score + 1);
            gameObjectB.data.set("ongoal", true);
            gameObjectB.addSpotlight();
          }
        }
      }
    },
  });

  scene.matterCollision.addOnCollideEnd({
    objectA: goals,
    objectB: ammo,
    callback: (eventData) => {
      const { bodyA, bodyB, gameObjectB } = eventData;
      if (bodyB.speed !== 0) {
        const gameObjectBData = gameObjectB.data
          ? gameObjectB.data.getAll()
          : false;
        if (gameObjectBData) {
          if (bodyA.label === "topgoal") {
            if (gameObjectBData["belongsto"] === "player1") {
              const score = scene.players[0].getScore();
              scene.players[0].setScore(score - 1);
              gameObjectB.data.set("ongoal", false);
              gameObjectB.destroySpotlight();
            }
            if (gameObjectBData["belongsto"] === "player3") {
              const score = scene.players[2].getScore();
              scene.players[2].setScore(score - 1);
              gameObjectB.data.set("ongoal", false);
              gameObjectB.destroySpotlight();
            }
          }
          if (bodyA.label === "bottomgoal") {
            if (gameObjectBData["belongsto"] === "player2") {
              const score = scene.players[1].getScore();
              scene.players[1].setScore(score - 1);
              gameObjectB.data.set("ongoal", false);
              gameObjectB.destroySpotlight();
            }
            if (gameObjectBData["belongsto"] === "player4") {
              const score = scene.players[3].getScore();
              scene.players[3].setScore(score - 1);
              gameObjectB.data.set("ongoal", false);
              gameObjectB.destroySpotlight();
            }
          }
        }
      }
    },
  });

  scene.matterCollision.addOnCollideStart({
    objectA: ammo,
    objectB: ammo,
    callback: (eventData) => {
      const { gameObjectA, gameObjectB } = eventData;
      const bodyAData = gameObjectA?.data ? gameObjectA.data.getAll() : false;
      const bodyBData = gameObjectB?.data ? gameObjectB.data.getAll() : false;

      if (gameObjectA.isStatic() || gameObjectB.isStatic()) {
        return;
      } else {
        if (bodyAData && bodyAData["lasthit"] != eventData.pair.timeCreated) {
          if (gameObjectA.data.get("health") == 1) {
            scene.ammo = scene.ammo.filter((ammo) => ammo !== gameObjectA);
          }
          gameObjectA.reduceHealth(eventData.pair.timeCreated);
        }

        if (bodyBData && bodyBData["lasthit"] != eventData.pair.timeCreated) {
          if (gameObjectB.data.get("health") == 1) {
            scene.ammo = scene.ammo.filter((ammo) => ammo !== gameObjectB);
          }
          gameObjectB.reduceHealth(eventData.pair.timeCreated);
        }
      }
    },
  });
}
