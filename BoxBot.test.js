const path = require('path');

const freshRequire = (p) => {
  delete require.cache[require.resolve(p)];
  return require(p);
};

describe('BoxBot', () => {
  const modulePath = path.join(process.cwd(), 'BoxBot.js');

  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('isBulky: volume >= 1,000,000 should be bulky', () => {
    const BoxBot = freshRequire(modulePath);
    const bot = new BoxBot();
    const bulky = bot.isBulky({ width: 100, height: 100, length: 100, mass: 1 });
    expect(bulky).toBe(true);
  });

  test('isBulky: any dimension >= 150 should be bulky', () => {
    const BoxBot = freshRequire(modulePath);
    const bot = new BoxBot();
    const bulky = bot.isBulky({ width: 10, height: 160, length: 10, mass: 1 });
    expect(bulky).toBe(true);
  });

  test('isBulky: below thresholds should not be bulky', () => {
    const BoxBot = freshRequire(modulePath);
    const bot = new BoxBot();
    const bulky = bot.isBulky({ width: 10, height: 10, length: 10, mass: 1 });
    expect(bulky).toBe(false);
  });

  describe('boxStack (classification rules)', () => {
    test('both bulky and massive => REJECTED', () => {
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      expect(bot.boxStack(true, true)).toBe('REJECTED');
    });

    test('bulky only => SPECIAL', () => {
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      expect(bot.boxStack(true, false)).toBe('SPECIAL');
    });

    test('massive only => SPECIAL', () => {
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      expect(bot.boxStack(false, true)).toBe('SPECIAL');
    });

    test('neither bulky nor massive => STANDARD', () => {
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      expect(bot.boxStack(false, false)).toBe('STANDARD');
    });
  });

  describe('CLI behavior (process.argv + console.log)', () => {
    const saveArgv = process.argv;

    afterEach(() => {
      process.argv = saveArgv;
    });

    test('prints SPECIAL for bulky-only box', () => {
      process.argv = ['node', 'BoxBot.js', '151', '10', '10', '1'];
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      bot.sort();
      expect(console.log).toHaveBeenCalledWith('This box is in the SPECIAL stack');
    });

    test('prints SPECIAL for massive-only box', () => {
      process.argv = ['node', 'BoxBot.js', '10', '10', '10', '20'];
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      bot.sort();
      expect(console.log).toHaveBeenCalledWith('This box is in the SPECIAL stack');
    });

    test('prints REJECTED when both bulky and massive', () => {
      process.argv = ['node', 'BoxBot.js', '150', '10', '10', '25'];
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      bot.sort();
      expect(console.log).toHaveBeenCalledWith('This box is in the REJECTED stack');
    });

    test('prints STANDARD when neither', () => {
      process.argv = ['node', 'BoxBot.js', '10', '10', '10', '5'];
      const BoxBot = freshRequire(modulePath);
      const bot = new BoxBot();
      bot.sort();
      expect(console.log).toHaveBeenCalledWith('This box is in the STANDARD stack');
    });
  });
});
