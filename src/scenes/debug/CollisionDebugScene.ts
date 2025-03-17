import Phaser from 'phaser';
import BaseScene from '../BaseScene';

export default class CollisionDebugScene extends BaseScene {


  constructor(config: object) {
    super('CollisionDebugScene', {...config, canGoBack: true});
  }

  preload() { }

  hasCollided(pair: MatterJS.Pair): void {
    const { bodyA, bodyB } = pair;
    if (bodyA.label === "Polygon Body" && bodyB.label !== "Polygon Body") {
      //  this.matter.setCollisionGroup([pair.bodyA], this.collidingGroup);
      console.log('bodya is a polygon');
      bodyA.collisionFilter = bodyB.collisionFilter;
      bodyA.ignorePointer = true;
      bodyA.label = "changed";
    }
    if (bodyB.label === "Polygon Body" && bodyA.label !== "Polygon Body") {
      // this.matter.setCollisionGroup([pair.bodyB], this.collidingGroup);
      console.log('bodyb is a polygon');
      bodyB.collisionFilter = bodyA.collisionFilter;
      bodyB.ignorePointer = true;
      bodyB.label = "changed";
    }
  }

  create(): void {
    super.create();

    const canCollide = function(filterA, filterB) {
      if (filterA.group === filterB.group && filterA.group !== 0)
        return filterA.group > 0;

      return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
    };

    this.collidingCategory = this.matter.world.nextCategory();
    this.noncollidingCategory = this.matter.world.nextCategory();
    this.collidingGroup = this.matter.world.nextGroup();
    this.nonCollidingGroup = this.matter.world.nextGroup(true);

    // put stuff on board
    let i;
    let last = 60
    for ( i = 8; i >= 1; i--) {
      this.matter.add.rectangle(last, 320, 50, 50, {isStatic: true, restitution: 1, collisionFilter: {group: this.nonCollidingGroup}, render: {fillColor: 0x000fff}, ignorePointer: true});
      this.matter.add.polygon(last, 150, 6, 30, {restitution: 1, collisionFilter: {group: this.nonCollidingGroup, category: this.noncollidingCategory}, render: {fillColor: 0xff0000}, onCollideCallback: this.hasCollided});
      this.matter.add.circle(last, 500, 20, { restitution: 1, collisionFilter: {group: this.collidingGroup}, render: {fillColor: 0x775544}, ignorePointer: true});

      last = last + 70;
    }

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

  }

  update() {

  }
}