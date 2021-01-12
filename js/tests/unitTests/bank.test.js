const PersonService = require("../../src/services/personService");
const BankService = require("../../src/services/bankService");

const { describe, it } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const Person = require("../../src/entities/person");

describe("Suit Bank Service", () => {
  let sandBox = {};
  beforeEach(() => {
    sandBox = sinon.createSandbox();
  });

  afterEach(() => {
    sandBox.restore();
  });

  it("should format both account balance", () => {
    const senderAccountBalance = "$564,795.31";
    const receiverAccountBalance = "$787,819.29";

    const bankService = new BankService("260", "Nubank");

    sandBox
      .stub(bankService, "formatAccountbalance")
      .withArgs(senderAccountBalance)
      .returns("564795.31")
      .withArgs(receiverAccountBalance)
      .returns("787819.29");

    const senderAccountBalanceFormated = bankService.formatAccountbalance(
      senderAccountBalance
    );
    const receiverAccountBalanceFormatted = bankService.formatAccountbalance(
      receiverAccountBalance
    );

    expect(senderAccountBalanceFormated).to.be.deep.equal("564795.31");
    expect(receiverAccountBalanceFormatted).to.be.deep.equal("787819.29");

    expect(
      bankService.formatAccountbalance.calledWithExactly(senderAccountBalance)
    ).to.be.true;
    expect(
      bankService.formatAccountbalance.calledWithExactly(receiverAccountBalance)
    ).to.be.true;
  });

  it("should return error when value to be transfer is greatest than the account balance", () => {
    const sender = {
      id: "01",
      name: "wesley",
      accountBalance: "$100.00",
      tier: "silver",
    };

    const receiver = {
      ...sender,
      id: "02",
      name: "allan",
    };

    const bankService = new BankService("260", "Nubank");
    const transference = bankService.generateTransaction(
      sender,
      receiver,
      2000
    );

    expect(transference).to.be.deep.equal({ error: "Invalid account balance" });
  });

  it("should calculate the current account balance based on his type (sender or receiver) and the trasnferred value", () => {
    const accountBalance = {
      sender: 4520,
      receiver: 2189,
    };
    const value = 376;

    const bankService = new BankService("260", "Nubank");

    const calcAccountBalanceSender = bankService.calculateAccountBalance(
      "sender",
      accountBalance.sender,
      value
    );
    const calcAccountBalanceReceiver = bankService.calculateAccountBalance(
      "receiver",
      accountBalance.receiver,
      value
    );

    const expected = {
      sender: accountBalance.sender - value,
      receiver: accountBalance.receiver + value,
    };

    expect(expected.sender).to.be.deep.equal(calcAccountBalanceSender);
    expect(expected.receiver).to.be.deep.equal(calcAccountBalanceReceiver);
  });

  it("should generate a new transaction", () => {
    const sender = new PersonService("01", "Wesley");
    const receiver = new PersonService("02", "Allan");

    sandBox.stub(sender, "getAccountBalance").returns(9000);
    sandBox.stub(receiver, "getAccountBalance").returns(2470);

    const now = new Date(2020, 10, 4);
    sandBox.useFakeTimers(now.getTime());
    const senderInstance = sender.generatePersonInstance();
    const receiverInstance = receiver.generatePersonInstance();

    const bank = new BankService("260", "Nubank");

    const value = 2450;

    const transference = bank.generateTransaction(
      senderInstance,
      receiverInstance,
      value
    );

    const expectedTransferenceReceipt = {
      bankId: "260",
      bankName: "Nubank",
      sender: {
        id: "01",
        name: "Wesley",
        accountBalance: "$6,550.00",
        tier: "golden",
      },
      receiver: {
        id: "02",
        name: "Allan",
        accountBalance: "$4,920.00",
        tier: "silver",
      },
      oldSenderAccountBalance: "old sender account balance = $9,000.00",
      oldReceiverAccountBalance: "old receiver account balance = $2,470.00",
      value: "$2,450.00",
      date: "11/4/2020",
    };

    expect(transference).to.be.deep.equal(expectedTransferenceReceipt);
  });
});
