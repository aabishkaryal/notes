import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { compare } from "bcrypt";

import { Deta } from "deta";
import { fetchAll } from "@app/db";
import { User } from "@app/types";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base("User");

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize({ email, password }) {
                const users = await fetchAll<User>(db, { email });
                if (users.length !== 1) throw new Error("Invalid Credentials.");
                const match = await compare(password, users[0].passwordHash);
                if (match) return users[0];
                throw new Error("Invalid Credentials.");
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    session: {
        jwt: true,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        signingKey: JSON.stringify({
            kty: "oct",
            kid: process.env.SIGN_KEY_ID,
            alg: "HS512",
            k: process.env.SIGN_KEY,
        }),
        encryption: true,
        encryptionKey: JSON.stringify({
            kty: "oct",
            kid: process.env.ENCRYPT_KEY_ID,
            use: "enc",
            alg: "A256GCM",
            k: process.env.ENCRYPT_KEY,
        }),
        verificationOptions: {
            algorithms: ["HS512"],
        },
    },
    debug: process.env.NODE_ENV !== "production",
    pages: {
        signIn: "/",
        signOut: "/signOut",
    },
});
