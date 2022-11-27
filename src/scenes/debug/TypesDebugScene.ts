import BaseScene from "../BaseScene";

export default class TypesDebugScene extends BaseScene{
  public textString: string;
  public numberPlaceholder: number;
  public objectPlaceholder: object;
  public arrayPlaceholder: Array<String>;
  public clickmetext: any | Phaser.GameObjects.Text;;

  constructor(config: object) {
    super("TypesDebugScene", config);
    this.textString = "";
    this.numberPlaceholder = 0;
    this.objectPlaceholder = {};
    this.arrayPlaceholder = [];
    this.clickmetext;
  }

  // *****************
  // getters and setters
  // *****************
  getTextString(): string {
    return this.textString;
  }

  setTextString(newString: string) {
    this.textString = newString;
  }

  getNumberPlaceholder(): number {
    return this.numberPlaceholder;
  }

  setNumberPlaceholder(newNumber: number) {
    this.numberPlaceholder = newNumber;
  }

  getObjectPlaceholder(): object {
    return this.objectPlaceholder;
  }

  setObjectPlaceHolder(newObject: object) {
    this.objectPlaceholder = newObject;
  }

  getArrayPlaceholder() {
    return this.arrayPlaceholder;
  }

  setArrayPlaceholder(newArray: Array<String>) {
    this.arrayPlaceholder = newArray;
  }

  preload(): void {
    this.setTextString("click me");
    this.setArrayPlaceholder(['red', 'orange', 'purple', 'pink', 'blue', 'green']);
  }

  create() {
    this.clickmetext = this.add
      .text(100, 100, this.getTextString(), {font: "50px Arial Black", fill: "#fff"})
      .setInteractive();

    this.input.on('gameobjectup', function(pointer, gameobject, event) {
      const currentNumber = this.getNumberPlaceholder();
      const arrayPlaceholder = this.getArrayPlaceholder();
      console.log(currentNumber, arrayPlaceholder.length);
      if (currentNumber >= arrayPlaceholder.length -1) {
        this.setNumberPlaceholder(0);
      } else {
        this.setNumberPlaceholder(currentNumber + 1);
      }
    }, this);

  }

  update(time: number, delta: number): void {
      const numberPlaceholder = this.getNumberPlaceholder();
      const arrayPlaceholder = this.getArrayPlaceholder();
      this.clickmetext.setText(`Click Me: ${numberPlaceholder}`);
      this.clickmetext.setColor(arrayPlaceholder[numberPlaceholder]);
  }
}
