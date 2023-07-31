import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './lib/mongodb'
import User from '@/models/User';
import bcrypt from 'bcrypt';
import db from '../../../utils/db'
db.connectDb();
export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const email = credentials.email
                const password = credentials.password;
                const user = await User.findOne({ email });

                if (user) {
                    return SignInUser({ password, user });
                } else if (!user.emailVerified) {
                    throw new Error("Please confirm your email to login.")
                } else {
                    throw new Error("Account of this email doesn't exist.")
                }

            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            let user = await User.findById(token.sub);
            session.user.id = token.sub || user._id.toString();
            session.user.role = user.role || "user";
            token.role = user.role || "user";
            session.user.emailVerified = user.emailVerified;
            return session;
        },
    },
    pages: {
        signIn: "/signin",

    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.JWT_SECRET,
});

const SignInUser = async ({ password, user }) => {
    if (!user.password) {
        throw new Error("Please enter your password.");
    }
    const testPassword = await bcrypt.compare(password, user.password);
    if(user.emailVerified === false) {
        throw new Error("Your email is not verified. Check your mail to verification.")
    }
    if (!testPassword) {
        throw new Error("Incorrect email or password")
    }
    return user
};
