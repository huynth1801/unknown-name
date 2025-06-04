"use client"

import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from "lucide-react"
import Link from "next/link"
import "./sign-in.css"
import ApplicationConstants from "@/constants/ApplicationConstants"
import ResourceURL from "@/constants/ResourceURL"
import { LoginResponse } from "./(types)"

const formSchema = z.object({
  username: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
})

const ModernLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(ResourceURL.LOGIN)
    startTransition(async () => {
      try {
        setError(null)
        const res = await fetch(ResourceURL.LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const data: LoginResponse = await res.json()
        if (res.ok && data.token) {
          localStorage.setItem(ApplicationConstants.REFRESH_TOKEN, data.token)
        } else {
          setError(data.message || "Invalid username or password")
        }
      } catch (error) {
        console.error("Error when signing in", error)
        setError("An error occurred during sign in")
      }
    })
  }

  return (
    <div
      className="w-full min-h-screen flex items-center 
                    justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 
                    p-4 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 
                      bg-purple-500/30 rounded-full mix-blend-multiply 
                      filter blur-xl opacity-70 animate-blob"
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 
                      bg-yellow-500/30 rounded-full mix-blend-multiply 
                      filter blur-xl opacity-70 animate-blob animation-delay-2000"
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 
                      bg-pink-500/30 rounded-full mix-blend-multiply 
                      filter blur-xl opacity-70 animate-blob animation-delay-4000"
        ></div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <Card
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl 
                            shadow-2xl border-0 rounded-3xl overflow-hidden"
        >
          <CardHeader className="space-y-4 pb-8 pt-8 px-8">
            {/* Logo/Avatar */}
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 
                              rounded-2xl flex items-center justify-center shadow-lg"
              >
                <User className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <CardTitle
                className="text-3xl font-bold bg-gradient-to-r 
                                  from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 
                                  bg-clip-text text-transparent"
              >
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Sign in to continue to your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-4">
            <Form {...form}>
              <div className="space-y-6">
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50 border-red-200"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Username or Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            placeholder="Enter your email or username"
                            className="pl-12 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-12 pr-12 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      className="rounded-md"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </Form>
          </CardContent>

          <CardFooter className="px-8 pb-8">
            <div className="w-full space-y-6">
              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                <div className="px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                  or continue with
                </div>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  <span className="font-medium">Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Github className="w-5 h-5 mr-2" />
                  <span className="font-medium">GitHub</span>
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href="/signup"
                  className="text-sm font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ModernLoginPage
