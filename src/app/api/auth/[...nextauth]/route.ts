// import NextAuth from "next-auth";

// const handler = NextAuth({
  
// });

// export { handler as GET, handler as POST };

import { handlers } from '@/auth';
export const { GET, POST } = handlers;
