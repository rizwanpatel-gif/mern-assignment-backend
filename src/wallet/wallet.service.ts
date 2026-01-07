import { Injectable, BadRequestException } from '@nestjs/common';

type Wallet = {
  userId: string;
  balance: number;
};

const wallets: Record<string, Wallet> = {
  u1: { userId: 'u1', balance: 100 },
};

@Injectable()
export class WalletService {
  getBalance(userId: string) {
    return wallets[userId]?.balance ?? 0;
  }

  credit(userId: string, amount: number) {
    const wallet = wallets[userId];
    wallet.balance += amount;
    return wallet.balance;
  }

  async debit(userId: string, amount: number) {
    const wallet = wallets[userId];

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (wallet.balance >= amount) {
      
      wallet.balance -= amount;

      return wallet;
    }

    throw new BadRequestException('Insufficient balance');
  }
}
