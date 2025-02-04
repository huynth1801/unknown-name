import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

// List of protected route
const protectedRoutes: string[] = ["/profile", "/orders"]

const publicRoutes: string[] = ["/sign-in", "/sign-up"]

export function middleware(request: NextRequest) {
  // Check if the current route is protected or public
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // Get token
  const token = request.cookies.get("refreshToken")?.value
  console.log("token in middleware", token)

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl))
  }

  // Redirect to dashboard if the user is authenticated
  if (
    isPublicRoute &&
    token &&
    !request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
