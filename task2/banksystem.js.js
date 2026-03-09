
function createAccount(owner, startingBalance) {
  let balance = startingBalance; 
  const account = {
    owner,

    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      console.log(`[${owner}] Deposited $${amount}. Balance: $${balance}`);
    },

    withdraw(amount) {
      if (amount <= 0) throw new Error("Withdraw must be positive");
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      console.log(`[${owner}] Withdrew $${amount}. Balance: $${balance}`);

      if (balance < 100 && account.onLowBalance) {
        account.onLowBalance(balance);
      }
    },

    transfer(amount, targetAccount) {
      this.withdraw(amount);          
      targetAccount.deposit(amount);   
    },

    getBalance() {
      return balance; 
    },
    onLowBalance: null,
  };

  return account;
}

function createSavingsAccount(owner, startingBalance) {

  const account = createAccount(owner, startingBalance);

  account.type = "Savings";
  account.interestRate = 0.05; 

  account.addInterest = function () {
    const interest = this.getBalance() * this.interestRate;
    this.deposit(interest);
    console.log(`[${owner}] Interest added: $${interest.toFixed(2)}`);
  };

  return account;
}

function createCheckingAccount(owner, startingBalance) {
  const account = createAccount(owner, startingBalance);

  account.type = "Checking";
  account.overdraftLimit = 50; 

  account.withdraw = function (amount) {
    if (amount <= 0) throw new Error("Withdraw must be positive");
    if (amount > account.getBalance() + account.overdraftLimit) {
      throw new Error("Exceeds overdraft limit");
    }
    console.log(`[${owner}] Withdrew $${amount} (checking). Balance: $${account.getBalance() - amount}`);
  };

  return account;
}
function feeCalculator(rate) {      
  return function (amount) {         
  };
}

const internationalFee = feeCalculator(0.03);  
const expressFee       = feeCalculator(0.05);  
function showAccountInfo() {
  console.log(`Owner: ${this.owner} | Type: ${this.type || "Basic"} | Balance: $${this.getBalance()}`);
}

function createBankAccount(type, owner, balance) {
  if (type === "savings")  return createSavingsAccount(owner, balance);
  if (type === "checking") return createCheckingAccount(owner, balance);
  return createAccount(owner, balance);
}

module.exports = { createBankAccount };


console.log("========== BANK SIMULATOR ==========\n");

const alice = createSavingsAccount("Alice", 500);
const bob   = createCheckingAccount("Bob", 200);

alice.onLowBalance = function (bal) {
  console.log(`⚠️  Alert: Alice's balance is low! ($${bal})`);
};

alice.deposit(100);
alice.withdraw(50);
alice.addInterest();

console.log("\n-- Transfer --");
alice.transfer(300, bob);

console.log("\n-- Trigger low balance --");
alice.withdraw(200);

console.log("\n-- call / apply / bind --");

showAccountInfo.call(alice);
showAccountInfo.apply(bob);

const showAlice = showAccountInfo.bind(alice);
showAlice(); 

console.log("\n-- Fee Calculator (Currying) --");
const transfer500 = 500;
console.log(`International fee on $${transfer500}: $${internationalFee(transfer500)}`);
console.log(`Express fee on $${transfer500}:       $${expressFee(transfer500)}`);

console.log("\n-- Error Handling --");
try {
  alice.withdraw(99999);
} catch (err) {
  console.log("Caught:", err.message);
}

console.log("\n========== DONE ==========");
