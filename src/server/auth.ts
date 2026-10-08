import { UserRole } from '@prisma/client';
import { compare } from 'bcryptjs';
import {
  getServerSession,
  type DefaultSession,
  type DefaultUser,
  type NextAuthOptions,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '~/env';
import { db } from '~/server/db';

/**
 * Module augmentation for auth types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

function isConfiguredSecret(value?: string) {
  return Boolean(value && value !== '~' && !value.includes('<') && value.length > 8);
}

const googleConfigured = isConfiguredSecret(env.GOOGLE_CLIENT_ID) && isConfiguredSecret(env.GOOGLE_CLIENT_SECRET);
const credentialsEnabled = env.NODE_ENV === 'development';

/**
 * Options for auth used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    // JWT is required for Credentials provider; Google still works with JWT sessions.
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider === 'credentials') {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        return token;
      }

      const email = (user?.email ?? token.email)?.trim().toLowerCase();
      if (!email) {
        return token;
      }

      const dbUser = await db.user.findUnique({
        where: { email },
        select: { id: true, role: true },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.email = email;
      }

      return token;
    },

    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
      },
    }),

    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return false;
      }

      const existingUser = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });

      return Boolean(existingUser);
    },
  },
  providers: [
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(credentialsEnabled
      ? [
          CredentialsProvider({
            name: 'credentials',
            credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
              const email = credentials?.email?.trim().toLowerCase();
              const password = credentials?.password;

              if (!email || !password) {
                return null;
              }

              const user = await db.user.findUnique({
                where: { email },
              });

              if (!user?.hashedPassword) {
                return null;
              }

              const isValid = await compare(password, user.hashedPassword);
              if (!isValid) {
                return null;
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
              };
            },
          }),
        ]
      : []),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = () => getServerSession(authOptions);
