const Bank = require("../entities/bank");
const PersonService = require("./personService");
const Transaction = require("./transaction");

const formatAccountBalance = Symbol("formatAccountBalance");
const calculateAccountBalance = Symbol("calculateAccountBalance");

class BankService extends Bank {
  constructor(id, name) {
    super({ id, name });
  }

  [formatAccountBalance](accountBalance) {
    const [_, value] = accountBalance.split("$");

    return value.replace(",", "");
  }

  [calculateAccountBalance](type, accountBalance, value) {
    const calculateAccountBalanceType = {
      sender: () => {
        return parseFloat(accountBalance) - parseFloat(value);
      },
      receiver: () => {
        return parseFloat(accountBalance) + parseFloat(value);
      },
    };

    return calculateAccountBalanceType[type]();
  }

  formatAccountbalance(accountBalance) {
    return this[formatAccountBalance](accountBalance);
  }

  calculateAccountBalance(type, accountBalance, value) {
    return this[calculateAccountBalance](type, accountBalance, value);
  }

  generateTransaction(sender, receiver, value) {
    const accountBalanceFrom = this.formatAccountbalance(sender.accountBalance);
    const accountBalanceTo = this.formatAccountbalance(receiver.accountBalance);

    if (accountBalanceFrom < value) {
      return {
        error: "Invalid account balance",
      };
    }

    const currentSenderAccountBalance = this.calculateAccountBalance(
      "sender",
      accountBalanceFrom,
      value
    );

    const currentReceiverAccountBalance = this.calculateAccountBalance(
      "receiver",
      accountBalanceTo,
      value
    );

    const personService = new PersonService();

    const { tier: currentSenderTier } = personService.getTier(
      currentSenderAccountBalance
    );
    const { tier: currentReceiverTier } = personService.getTier(
      currentReceiverAccountBalance
    );

    const currentSenderAccountBalanceFormatted = personService.formatMoney(
      currentSenderAccountBalance
    );
    const currentReceiverAccountBalanceFormatted = personService.formatMoney(
      currentReceiverAccountBalance
    );

    const formattedValue = personService.formatMoney(value);

    const newSenderData = {
      ...sender,
      accountBalance: currentSenderAccountBalanceFormatted,
      tier: currentSenderTier,
    };

    const newReceiverData = {
      ...receiver,
      accountBalance: currentReceiverAccountBalanceFormatted,
      tier: currentReceiverTier,
    };

    return new Transaction(
      this.id,
      this.name,
      newSenderData,
      newReceiverData,
      sender.accountBalance,
      receiver.accountBalance,
      formattedValue
    );
  }
}

module.exports = BankService;
