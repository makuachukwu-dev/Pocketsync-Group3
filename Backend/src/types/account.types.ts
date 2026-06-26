export type Institution = {
  id: string;
  name: string;
  logo: string; // Icon or Logo key/slug for front-end rendering
};

export type ConnectedAccount = {
  id: string;
  userId: string;
  institutionId: string;
  institutionName: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  lastUpdated: Date;
};

export type DashboardSummary = {
  totalBalance: number;
  accountsCount: number;
  accounts: ConnectedAccount[];
};
