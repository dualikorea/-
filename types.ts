
export enum ReceiptType {
  REPAIR = '수리',
  DEV = '개발'
}

export enum ReceiptStatus {
  RECEIVED = '접수',
  REPAIR_COMPLETED = '수리완료',
  REPAIR_FAILED = '수리불가',
  EXCHANGE = '교환',
  DEV_COMPLETED = '개발완료'
}

export interface ReceiptItem {
  id: string;
  type: ReceiptType;
  date: string;
  customer: string;
  issue: string;
  qty: number;
  etc: string;
  status: ReceiptStatus;
  doneDate: string;
  devPeriod?: string;
  devCost?: string;
  devDue?: string;
  createdAt: number;
}

export interface SummaryData {
  monthly: Record<string, { repair: number; dev: number }>;
  yearly: Record<string, { repair: number; dev: number }>;
  status: Record<string, number>;
}
