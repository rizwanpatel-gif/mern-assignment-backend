import { Injectable, BadRequestException } from '@nestjs/common';

type Wallet = {
  userId: string;
  balance: number;
};

const wallets: Record<string, Wallet> = {
  u1: { userId: 'u1', balance: 100 },
};

const locks: Record<string, Promise<void>> = {};

function withLock<T>(userId: string, fn: () => T): Promise<T> {
  const prev = locks[userId] ?? Promise.resolve();
  let resolve: () => void;
  locks[userId] = new Promise<void>((r) => (resolve = r));
  return prev.then(fn).finally(() => resolve!());
}

@Injectable()
export class WalletService {
  getBalance(userId: string) {
    return wallets[userId]?.balance ?? 0;
  }

  credit(userId: string, amount: number) {
    return withLock(userId, () => {
      if (!wallets[userId]) {
        wallets[userId] = { userId, balance: 0 };
      }
      wallets[userId].balance += amount;
      return wallets[userId].balance;
    });
  }

  debit(userId: string, amount: number) {
    return withLock(userId, () => {
      const wallet = wallets[userId];

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      if (wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      wallet.balance -= amount;
      return wallet;
    });
  }
}
