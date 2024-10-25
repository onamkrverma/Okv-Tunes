import NextAuth, {
  AuthError,
  CredentialsSignin,
  NextAuthConfig,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./utils/db";
import Users from "./models/users";
import { compare } from "bcrypt";
import Google from "next-auth/providers/google";

class InvalidLoginError extends CredentialsSignin {
  message = "Invalid Credentials";
  code = "401";
}

const config: NextAuthConfig = {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        await connectDB();
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        if (!email || !password) {
          throw new InvalidLoginError();
        }

        const user = await Users.findOne({ email }).select("+password");
        if (!user || !user.password) {
          throw new InvalidLoginError();
        }

        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new InvalidLoginError();
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;
          await connectDB();
          const userInfo = await Users.findOne({ email });
          if (!userInfo) {
            await Users.create({
              name,
              email,
              image,
            });
          } else if (!userInfo.image) {
            await Users.findOneAndUpdate({ email }, { $set: { image } });
          }
          return true;
        } catch (error) {
          throw new AuthError("An error occurred while creating your account.");
        }
      }
      if (account?.provider === "credentials") return true;
      return false;
    },

    session: async ({ session, user, token }) => {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ token, user, account }) => {
      if (token.email) {
        await connectDB();
        const dbUser = (await Users.findOne(
          { email: token.email },
          { _id: 1 }
        ).lean()) as { _id: string } | null;
        if (dbUser) {
          token.sub = dbUser._id;
        }
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
