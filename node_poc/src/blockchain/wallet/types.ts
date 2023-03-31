export type AddressType = string;
export type BalanceType = {
  [key: AddressType]: number;
};

export type KeyPairType = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};
