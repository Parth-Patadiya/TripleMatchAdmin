export interface PurchaseHistory {
  name: string;
  email: string;
  mobile: string;
  _id: string;
  userId: string;
  purchaseId: string;
  title: string;
  amount: string;
  validTill: string;
  purchaseDate: string;
  status: string;
}

export interface PurchaseByUser {
  _id: string;
  purchaseId: string;
  title: string;
  amount: string;
  validTill: string;
  purchaseDate: string;
  status: string;
}

export interface User {
  name: string;
  email: string;
  mobile: string;
}
