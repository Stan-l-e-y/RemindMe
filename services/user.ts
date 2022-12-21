import prisma from '../lib/prisma';
import { omit } from 'lodash';
import { UserInput, UpdateUserInput } from '../types/user.schema';
import bcrypt from 'bcrypt';
import { SessionInput } from '../types/session.schema';

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

export async function updateUser(id: number, input: UpdateUserInput) {
  if (input.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, salt);
    input.password = hashedPassword;
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: input,
    });

    return omit(user, 'password');
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function validatePassword(input: SessionInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.body.email },
  });

  if (!user) {
    return false;
  }

  const validPassword = await bcrypt.compare(
    input.body.password,
    user.password
  );

  if (validPassword) {
    return omit(user, 'password');
  }

  return false;
}
