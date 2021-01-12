class Transaction {
  constructor(
    bankId,
    bankName,
    sender,
    receiver,
    oldSenderAccountBalance,
    oldReceiverAccountBalance,
    value
  ) {
    (this.bankId = bankId),
      (this.bankName = bankName),
      (this.sender = sender),
      (this.receiver = receiver),
      (this.oldSenderAccountBalance = `old sender account balance = ${oldSenderAccountBalance}`),
      (this.oldReceiverAccountBalance = `old receiver account balance = ${oldReceiverAccountBalance}`),
      (this.value = value);
    this.date = this.getFormattedCurrentDate();
  }

  getFormattedCurrentDate() {
    const today = new Date();
    return today.toLocaleDateString("pt-br", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
}

module.exports = Transaction;
