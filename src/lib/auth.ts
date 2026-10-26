import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { sso } from '@better-auth/sso';

const baseURL = process.env.BETTER_AUTH_URL!;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  plugins: [
    sso({
      defaultSSO: [
          {
            providerId: "tamu-entra",
            domain: "tamu.edu",

            samlConfig: {
              issuer:
                `${baseURL}/api/auth/sso/saml2/sp/metadata`,

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
