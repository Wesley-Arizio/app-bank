const BaseRepository = require("./base/baseRepository");

class Person extends BaseRepository {
  constructor({ id, name, accountBalance, tier }) {
    super({ id, name });
    this.accountBalance = accountBalance;
    this.tier = tier;
  }
}

module.exports = Person;
