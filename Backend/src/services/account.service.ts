import { ConnectedAccount, Institution } from "../types/account.types";

const institutions: Institution[] = [
  { id: "gtbank", name: "GTBank", logo: "gtbank-logo" },
  { id: "access", name: "Access Bank", logo: "access-logo" },
  { id: "kuda", name: "Kuda", logo: "kuda-logo" },
  { id: "opay", name: "Opay", logo: "opay-logo" },
  { id: "moniepoint", name: "Moniepoint", logo: "moniepoint-logo" },
];

export const connectedAccounts = new Map<string, ConnectedAccount>();

export class AccountService {
  static getInstitutions(): Institution[] {
    return institutions;
  }

  static getAccounts(userId: string): ConnectedAccount[] {
    return Array.from(connectedAccounts.values()).filter(
      (acc) => acc.userId === userId
    );
  }

  static findById(accountId: string): ConnectedAccount | null {
    return connectedAccounts.get(accountId) ?? null;
  }

  static connect(
    userId: string,
    institutionId: string,
    username: string
  ): ConnectedAccount {
    const institution = institutions.find((inst) => inst.id === institutionId);
    if (!institution) {
      throw new Error("Unsupported financial institution");
    }

    // Check if user already linked this institution to avoid duplicate mocks
    const existing = Array.from(connectedAccounts.values()).find(
      (acc) => acc.userId === userId && acc.institutionId === institutionId
    );
    if (existing) {
      throw new Error(`You have already connected your ${institution.name} account.`);
    }

    // Generate random mock account number and balance
    const randomAccNum = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10 digits
    const baseNames = ["Main Savings Account", "Salary Current Account", "Business Wallet", "Personal Savings"];
    const accountName = baseNames[Math.floor(Math.random() * baseNames.length)];
    
    // Generates a mock balance between NGN 5,000 and NGN 1,500,000
    const balance = Math.round(5000 + Math.random() * 1495000); 

    const newAccount: ConnectedAccount = {
      id: `acc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      institutionId,
      institutionName: institution.name,
      accountNumber: randomAccNum,
      accountName,
      balance,
      lastUpdated: new Date(),
    };

    connectedAccounts.set(newAccount.id, newAccount);
    return newAccount;
  }

  static refreshAccount(accountId: string): ConnectedAccount | null {
    const account = connectedAccounts.get(accountId);
    if (!account) return null;

    // Simulate minor financial updates: random balance change (-3% to +6%)
    const pct = -0.03 + Math.random() * 0.09;
    const balanceDiff = Math.round(account.balance * pct);
    const newBalance = Math.max(0, account.balance + balanceDiff);

    const updatedAccount: ConnectedAccount = {
      ...account,
      balance: newBalance,
      lastUpdated: new Date(),
    };

    connectedAccounts.set(accountId, updatedAccount);
    return updatedAccount;
  }

  static disconnect(accountId: string): boolean {
    return connectedAccounts.delete(accountId);
  }
}
