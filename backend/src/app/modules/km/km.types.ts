export type EncKeyResult = { key_ID: string; key: string }; // key is base64

export type KmStatus = {
  km_id: string;
  total_keys: number;
  available_keys: number;
  consumed_keys: number;
  key_size_bytes: number;
};

export class KmError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
