import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { sso } from '@better-auth/sso';

const baseURL = process.env.BETTER_AUTH_URL;

const idpMetadata = process.env.TAMU_IDP_METADATA_XML;
if (!idpMetadata?.trim()) {
  throw new Error('TAMU_IDP_METADATA_XML is required');
}

export const auth = betterAuth({
  baseURL,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  plugins: [
    sso({
      providersLimit: 0,
      defaultSSO: [
        {
          providerId: 'tamu-entra',
          domain: 'tamu.edu',

          samlConfig: {
            issuer: `${baseURL}/api/auth/sso/saml2/sp/metadata`,

            entryPoint: process.env.TAMU_IDP_SSO_URL!,

            idpMetadata: {
              metadata: idpMetadata,
            },

            mapping: {
              email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
              firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
              lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
              name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
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
    nextCookies(),
  ],
});
