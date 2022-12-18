import prisma from '../lib/prisma';
import { omit } from 'lodash';
import { UserInput } from '../types/user.schema';
import bcrypt from 'bcrypt';

export async function createUser(input: UserInput) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, salt);
    input.password = hashedPassword;
    const user = await prisma.user.create({
      data: input,
    });

    return omit(user, 'password');
  } catch (error: any) {
    throw new Error(error);
  }
}
