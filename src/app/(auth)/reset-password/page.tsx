"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { ClientNewPasswordRequest } from "@/types"
import ResourceURL from "@/constants/ResourceURL"
import { useSearchParams, useRouter } from "next/navigation"

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const ResetPasswordPage = () => {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: ClientNewPasswordRequest) => {
      const response = await fetch(ResourceURL.CONFIRM_NEW_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reset password")
      }
    },
    onSuccess: () => {
      toast({
        title: "Password reset successfully!",
        description: "You can now log in with your new password.",
        variant: "success",
        duration: 1000,
      })
      router.push("/sign-in")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid or missing token. Please try again.",
        variant: "destructive",
      })
      return
    }

    mutation.mutate({ token, newPassword: values.password })
  }

  return (
    <Card className="w-full max-w-md shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password to reset your account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <div className="p-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

export default ResetPasswordPage
