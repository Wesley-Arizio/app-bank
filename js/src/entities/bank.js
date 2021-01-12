const BaseRepository = require("./base/baseRepository");

class Bank extends BaseRepository {
  constructor({ id, name }) {
    super({ id, name });
  }
}

module.exports = Bank;
