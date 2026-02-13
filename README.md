# Wallet Service – Backend Assignment

This repository contains a simple wallet service built with NestJS.

Users have a balance which can be credited or debited via API calls.

---

## Duration
**45–60 minutes max**
---

## What's provided
- A minimal NestJS application
- In-memory wallet storage
- APIs to credit and debit balance

Initial wallet balance for user `u1` is `100`.

---

## APIs

### POST /wallet/credit
Credit amount to a user's wallet.

**Request Body:**
```json
{
  "userId": "u1",
  "amount": 50
}
```

**Response:**
```json
{
  "balance": 150
}
```

### POST /wallet/debit
Debit amount from a user's wallet.

**Request Body:**
```json
{
  "userId": "u1",
  "amount": 30
}
```

**Response:**
```json
{
  "balance": 70
}
```

**Error Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Insufficient balance"
}
```

### GET /wallet/balance
Get the current balance for a user.

**Query Parameters:**
- `userId` (required): The user ID (e.g., "u1")

**Response:**
```json
{
  "balance": 100
}
```

---

## Task (mandatory)

1. Review the implementation.
2. Identify any potential issues and modify the implementation to address them.
3. Explain your approach and any assumptions or trade-offs.

You may refactor the service if needed, but minimal changes are preferred.

**Note:** Please ensure your code is well-documented with clear comments explaining your approach and any complex logic.

---

## Notes

- The storage is intentionally in-memory.
- There is no single "correct" solution.
- You may update this README if required to document your changes.

---

## Changes Made

### 1. Race condition in debit
If two debit requests hit at the same time, both could pass the balance check before either one actually subtracts. That means the balance can go negative. I added a simple per-user lock so operations run one at a time per user. Same lock applied to credit too just to be safe. In a real app with a DB you'd handle this with transactions.

### 2. credit() crashes for unknown users
The original code didn't check if the wallet exists before doing `wallet.balance += amount`. If the userId doesn't exist it throws a null reference error. Fixed it by creating a new wallet automatically.

### 3. No input validation
There was zero validation on the request body. You could send negative amounts, empty userId, or random garbage and the server would just accept it. Added class-validator on the DTO and enabled ValidationPipe globally.

### 4. CORS
Added `app.enableCors()` so the frontend doesn't get blocked.

---

## Submission

- Fork this repository and share the link on email.
