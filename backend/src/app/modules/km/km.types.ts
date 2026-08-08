export type EncKeyResult = {
  key_ID: string;
  key: string;
  algorithm: string;
  senderEmail: string;
  recipientEmail: string;
  createdAt: Date | string;
};

export type KmStatus = {
  totalKeys: number;
  activeKeys: number;
  consumedKeys: number;
  totalLogs: number;
};

export class KmError extends Error {
  constructor(
    message: string,
    public status: number = 400,
  ) {
    super(message);
  }
}
