/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { Session, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { CREATE_USER, GET_USER_BY_EMAIL } from "./lib/database/queries/user"
import { v4 } from "uuid"
import bcrypt from "bcrypt"
import { DefaultJWT } from "@auth/core/jwt"
import { AdapterUser } from "@auth/core/adapters"
import { EmailService } from "./lib/email/EmailService"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/entrar",
    signOut: "/salir",
    error: "/entrar",
  },
  trustHost: true,
  logger: {
    error(error: Error) {

      if ((error as any).type === "CredentialsSignin") {
        return;
      }
      console.error(error);
    },
    warn(message: string) {
      console.warn(message);
    },
    debug(message: string) {
      console.debug(message);
    },
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
        captcha: { label: "captcha", type: "text" }
      },


      authorize: async function (credentials, req) {

        const { email, password, captcha } = credentials

        const dbUser = await GET_USER_BY_EMAIL(email as string)

        if (!dbUser) return null

        if (!await bcrypt.compare(password as string, dbUser.password).catch(err => {
          if (err) return false
        })) return null;

        const userWithoutPassword = { ...dbUser, password: undefined }
        delete userWithoutPassword.password;

        return userWithoutPassword

      }

    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {

    async signIn({ account, user }) {

      const existingUser = await GET_USER_BY_EMAIL(user.email!);

      if (!existingUser) {
        const dbUser = await CREATE_USER({
          email: user.email as string,
          uuid: v4(),
          password: v4(),
          role: "user",
          first_name: user.name?.split(' ')[0] || '',
          last_name: user.name?.split(' ').slice(1).join(' ') || ''
        });

        if (!dbUser) return false;

        try {
          await EmailService.sendWelcomeEmail({
            to: dbUser.email,
            userName: user.name || dbUser.email,
            userEmail: dbUser.email
          });
        } catch (emailError) {
          console.error("Error sending welcome email for OAuth user:", emailError);
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await GET_USER_BY_EMAIL(user.email!);

        if (dbUser) {
          token.uuid = dbUser.uuid;
          token.role = dbUser.role;
        }
      }
      return token as ExtendedJWT;
    },

    async session({ session, token }) {
      if (token) {
        const modifiedSessionUser = session.user as ExtendedUser
        modifiedSessionUser.uuid = token.uuid as string;
        modifiedSessionUser.role = token.role as string;
        session.user = modifiedSessionUser
      }
      return session;
    },
  },
});

export interface ExtendedUser extends AdapterUser {
  id: string;
  uuid?: string;
  email: string;
  role?: string;
  name?: string;
  emailVerified: Date | null;
}

export interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export interface ExtendedJWT extends Record<string, unknown>, DefaultJWT {
  uuid: string;
  email: string;
  role: string;
  name?: string;
}
