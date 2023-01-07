import { Provider } from '@prisma/client';

export interface AccountInput {
  userId: number;
  type: string;
  provider: Provider;
}
