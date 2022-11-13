import Phaser from 'phaser';

export function createSling(config: object): MatterJS.Constraint {
    const constraint = Phaser.Physics.Matter.Matter.Constraint.create({
        ...config,
        stiffness: 0.2
    });
    return constraint;
}