import NextAuth from 'next-auth';

// Extend the built-in `Session` interface
declare module 'next-auth' {
  interface Session {
    user?: User
    expires: ISODateString
  }

  // Extend the built-in `User` interface
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}