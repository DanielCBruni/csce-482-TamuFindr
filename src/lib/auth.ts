import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { sso } from '@better-auth/sso';

const baseURL = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
  baseURL,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    sso({
      defaultSSO: [
        {
          providerId: 'tamu-entra',
          domain: 'tamu.edu',

          samlConfig: {
            issuer: `${baseURL}/api/auth/sso/saml2/sp/metadata`,

            entryPoint: process.env.TAMU_IDP_SSO_URL!,

            idpMetadata: {
              metadata: process.env.TAMU_IDP_METADATA_XML!,
            },

            wantAssertionsSigned: true,
          },
        },
      ],

      saml: {
        enableInResponseToValidation: true,
        allowIdpInitiated: false,
      },
    }),
  ],
});
