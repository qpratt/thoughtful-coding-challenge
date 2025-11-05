class BoxBot {
  static MAX_VOLUME = 1_000_000;
  static MAX_DIMENSION = 150;
  static MAX_WEIGHT = 20;
  static MEASUREMENT_UNIT = 'cm';
  static WEIGHT_UNIT = 'kg';

  constructor() {
    const args = process.argv;
    this.box = {
      width: Number(args[2]),
      height: Number(args[3]),
      length: Number(args[4]),
      mass: Number(args[5]),
    };
  }

  sort() {
    const isMassive = this.box.mass >= BoxBot.MAX_WEIGHT;
    const isBulky = this.isBulky(this.box);
    console.log(`This box is in the ${this.boxStack(isBulky, isMassive)} stack`);
  }

  boxStack(isBulky, isMassive) {
    switch (true) {
      case (isBulky && isMassive):
        return 'REJECTED';
      case (isBulky || isMassive):
        return 'SPECIAL';
      default:
        return 'STANDARD';
    }
  }

  isBulky(box) {
    const exceedsMaxVolume = (box.width * box.height * box.length) >= BoxBot.MAX_VOLUME;
    const topDimension = Math.max(box.width, box.height, box.length);
    const exceedsMaxDimensions = topDimension >= BoxBot.MAX_DIMENSION;
    return exceedsMaxVolume || exceedsMaxDimensions;
  }
}

module.exports = BoxBot;

if (require.main === module) {
  const bot = new BoxBot();
  bot.sort();
}
