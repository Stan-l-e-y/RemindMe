import prisma from '../lib/prisma';
import { AccountInput } from '../types/account';

export async function createAccount(input: AccountInput) {
  try {
    const account = await prisma.account.create({
      data: input,
    });
    return account;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findAndUpdateAccount(
  query: object,
  update: object,
  create: AccountInput
) {
  try {
    const account = await prisma.account.upsert({
      where: query,
      update: update,
      create: create,
    });
    return account;
  } catch (error: any) {
    throw new Error(error);
  }
}
