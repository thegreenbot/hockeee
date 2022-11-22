import Phaser from 'phaser';
import BaseScene from '../BaseScene';

export default class CollisionDebugScene extends BaseScene {

  constructor(config: object) {
    super('CollisionDebugScene', config);
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

    const canCollide = function(filterA, filterB) {
      if (filterA.group === filterB.group && filterA.group !== 0)
        return filterA.group > 0;

      return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
    };


    const collidingCat = this.matter.world.nextCategory();
    const nonCollidingCat = this.matter.world.nextCategory();
    const collidingGroup = this.matter.world.nextGroup();
    const nonCollidingGroup = this.matter.world.nextGroup(true);

    let i;
    let total = 50;

    const gen = new Phaser.Math.RandomDataGenerator();
    // for (i = total; i >= 1; i--) {
    //   const xpos = Math.random() * (40 - 560) + 560;
    //   const ypos = Math.random() * (20 - 760) + 760;
    //   const ball = this.matter.add.circle(xpos, ypos, 10, { restitution: 0.8, ignorePointer: true, collisionFilter: {group: nonCollidingGroup}});
    // }

    const rect = this.matter.add.rectangle(320, 320, 20, 20, {isStatic: true, collisionFilter: {group: nonCollidingGroup}});
    const hex = this.matter.add.polygon(300, 300, 6, 30, {collisionFilter: {group: nonCollidingGroup, category: nonCollidingCat}});

    const circ = this.matter.add.circle(500, 500, 20, {collisionFilter: {group: collidingGroup}})
    // this.matter.add.spring(hex, rect, 0, 0.2);

    // this.input.on('dragend', function(gameobject, pointer) {
    //   console.log('end');
    // });
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    console.log('rect vs hex', canCollide(rect.collisionFilter, hex.collisionFilter));
    console.log('rect vs circ', canCollide(rect.collisionFilter, circ.collisionFilter));
    console.log('hex vs circ', canCollide(hex.collisionFilter, circ.collisionFilter));

  }

  update() {

  }
}