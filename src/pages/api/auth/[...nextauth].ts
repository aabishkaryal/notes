import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize() {
                return {};
            },
        }),
    ],
    callbacks: {
        async signIn(_, __, profile) {
            return (
                profile.username === process.env.ADMIN_USERNAME &&
                profile.password === process.env.ADMIN_PASSWORD
            );
        },
    },
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
    theme: "light",
    debug: process.env.NODE_ENV !== "production",
    pages: {
        signIn: "/admin",
    },
});
