import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// TEMPORARY FIX for v4: Remove this fix when updating to a stable NextAuth v5 version
// Fix for TypeError: Function.prototype.apply was called on object
// See: https://github.com/nextauthjs/next-auth/issues/9493
function fixProvider(provider: any) {
  return {
    id: provider.id,
    name: provider.name,
    type: provider.type,
    signinUrl: provider.signinUrl,
    callbackUrl: provider.callbackUrl,
    ...provider,
  };
}

// SECURITY WARNING: DO NOT USE IN PRODUCTION
// In a real app, you would store users in a database with hashed passwords
// This is a simple in-memory store for demo purposes only
const users = [
  {
    id: "1",
    name: "Test User",
    email: "user@example.com",
    password: "password123", // NEVER store plain text passwords in production
  }
];

export const config = {
  providers: [
    fixProvider(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      })
    ),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // SECURITY WARNING: For production implementation
        // 1. Query a real database instead of using in-memory storage
        // 2. Use a secure password hashing algorithm (bcrypt, Argon2) to store and compare passwords
        // 3. Implement rate limiting to prevent brute force attacks
        const user = users.find(user => user.email === credentials.email);
        
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        
        return null;
      }
    }),
  ],
  // IMPORTANT: Ensure NEXTAUTH_SECRET is set in your environment variables
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/accedi",
    error: "/api/auth/error",
  },
};

// In NextAuth v5, we export the auth function directly
export const { auth, handlers, signIn, signOut } = NextAuth(config); 