import Phaser from 'phaser';
import { createSling } from '../gameObjects/sling';
import BaseScene from './BaseScene';

export default class DebugScene extends BaseScene {

  constructor(config: object) {
    super('DebugScene', config);
  }

  preload() { }

  create(): void {


    // CHECK create 2 bars
    // create spring
    // CHECK lace many balls in scene
    // CHECK balls are able to collide with each other & bars
    // spring ball is able to collide with balls but NOT bar
    // ball passes through bar
    // 

    var canCollide = function(filterA, filterB) {
      if (filterA.group === filterB.group && filterA.group !== 0)
        return filterA.group > 0;

      return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
    };


    const collidingCat = this.matter.world.nextCategory();
    const collidingGroup = this.matter.world.nextGroup();
    const nonCollidingGroup = this.matter.world.nextGroup(true);


    let i;
    let total = 50;

    const gen = new Phaser.Math.RandomDataGenerator();
    for (i = total; i >= 1; i--) {
      const xpos = Math.random() * (40 - 560) + 560;
      const ypos = Math.random() * (20 - 260) + 260;
      this.matter.add.circle(xpos, ypos, 10, { restitution: 0.8 });
    }

    this.matter.add.rectangle(300, 20, 600, 5, { isStatic: true });
    this.matter.add.rectangle(300, 300, 600, 5, { isStatic: true });

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

  }

  update() {

  }
}