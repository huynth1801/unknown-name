"use client"

import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"
import { LoginResponse } from "./(types)"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import ResourceURL from "@/constants/ResourceURL"

const formSchema = z.object({
  username: z.string().min(1, "Email or usename is required"),
  password: z.string().min(1, "Password is required"),
})

const SignInPage = () => {
  // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const response = await fetch(`${ResourceURL.LOGIN}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        const data: LoginResponse = await response.json()

        if (response.ok) {
          localStorage.setItem("accessToken", data.result.token)
          toast({
            title: "Sign in successfully !",
            variant: "success",
            duration: 2000,
          })
          router.push("/")
        } else {
          setError("An error occurred during sign in")
        }
      } catch (error) {
        console.error("Error when signing in", error)
      }
    })
  }

  return (
    <div className="w-full max-w-md dark:bg-black dark:text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-lg rounded-lg border border-gray-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold">
                Sign in to our platform
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email or username"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        required
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) =>
                      setRememberMe(checked)
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm text-center">
                  <Link
                    href="/forgot-password"
                    className="text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

export default SignInPage
