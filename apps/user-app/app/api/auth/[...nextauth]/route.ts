import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextAuthOptions } from "next-auth";

const handler: NextAuthOptions = NextAuth(authOptions);

export { handler as GET, handler as POST}