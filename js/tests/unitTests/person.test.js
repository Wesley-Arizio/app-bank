const PersonService = require("../../src/services/personService");

const { describe, it } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");

describe("Person Suit Test", () => {
  let sandBox = {};
  beforeEach(() => {
    sandBox = sinon.createSandbox();
  });

  afterEach(() => {
    sandBox.restore();
  });

  it("should format an accountBalance", () => {
    const person = new PersonService();
    const accountBalance = 5500;

    const accountBalanceFormatted = person.formatMoney(accountBalance);

    expect(accountBalanceFormatted).to.be.deep.equal("$5,500.00");
  });

  it("should get golden tier with an account balance $5,500.00", () => {
    const person = new PersonService();
    const accountBalance = 5500;

    sandBox.stub(person, "getTier").returns({ tier: "golden" });

    const { tier } = person.getTier(accountBalance);

    expect(tier).to.be.deep.equal("golden");
    expect(person.getTier.calledWithExactly(accountBalance)).to.be.true;
  });

  it("should generate Person instance with valid data", () => {
    const person = new PersonService("12", "wesley");

    const accountBalance = 4320;

    sinon.stub(person, "getAccountBalance").returns(accountBalance);

    sinon
      .stub(person, "formatMoney")
      .withArgs(accountBalance)
      .returns("US$ 4,320.00");

    sinon
      .stub(person, "getTier")
      .withArgs(accountBalance)
      .returns({ tier: "silver" });

    const generatedPersonInstance = person.generatePersonInstance();

    const expectedPersonInstance = {
      id: "12",
      name: "wesley",
      accountBalance: "US$ 4,320.00",
      tier: "silver",
    };

    expect(generatedPersonInstance).to.be.deep.equal(expectedPersonInstance);
    expect(person.formatMoney.calledWithExactly(accountBalance)).to.be.ok;
    expect(person.getTier.calledWithExactly(accountBalance)).to.be.ok;
  });

  it("should return a random account balance", () => {
    const person = new PersonService("01", "wesley");
    const { accountBalance } = person.generatePersonInstance();

    expect(accountBalance).to.be.ok;
  });

  it("given a out of the range account balance, should return silver as default tier", () => {
    const person = new PersonService("01", "wesley");

    const { tier } = person.getTier(30);

    expect(tier).to.be.deep.equal("silver");
  });
});
