import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { sso } from '@better-auth/sso';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  plugins: [
    sso({
      saml: {
        enableInResponseToValidation: true,
        allowIdpInitiated: false,
      },
    }),
  ],
});
