class Tier {
  static tier() {
    return [
      { greatestThan: 1000, lessThan: 5000, tier: "silver" },
      { greatestThan: 5000, lessThan: 10000, tier: "golden" },
      { greatestThan: 10000, lessThan: 50000, tier: "diamond" },
      { greatestThan: 150000, lessThan: 1000000, tier: "master" },
    ];
  }
}

module.exports = Tier;
