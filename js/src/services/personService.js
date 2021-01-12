// vai gerar o saldo e pegar a tier e retornar uma instancia de person

const Person = require("../entities/person");
const Tier = require("../entities/tier");

const accountBalanceGenerator = Symbol("accountBalanceGenerator");
const setTier = Symbol("setTier");
const personArgs = Symbol("personArgs");
const formatMoney = Symbol("formatMoney");

class PersonService extends Person {
  constructor(...args) {
    super({
      id: args[0],
      name: args[1],
    });
    this[personArgs] = args;
  }

  [formatMoney](money) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
    }).format(money);
  }

  [accountBalanceGenerator]() {
    return Math.floor(Math.random() * 1000000) + 100;
  }

  [setTier](accountBalance) {
    const [tier] = Tier.tier().filter((item) => {
      return item.greatestThan < accountBalance &&
        item.lessThan >= accountBalance
        ? item
        : false;
    });

    if (!tier) return { tier: "silver" };

    return tier;
  }

  getAccountBalance() {
    return this[accountBalanceGenerator]();
  }

  formatMoney(money) {
    return this[formatMoney](money);
  }

  getTier(accountBalance) {
    return this[setTier](accountBalance);
  }

  generatePersonInstance() {
    const accountBalance = this.getAccountBalance();
    const { tier } = this.getTier(accountBalance);

    const [id, name] = this[personArgs];

    return new Person({
      id,
      name,
      accountBalance: this.formatMoney(accountBalance),
      tier,
    });
  }
}

module.exports = PersonService;
