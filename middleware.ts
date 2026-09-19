<<<<<<< HEAD
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
=======
import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Client-side routes are protected seamlessly by Firebase AuthContext
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
};
