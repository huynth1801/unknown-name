"use client"

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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ResourceURL from "@/constants/ResourceURL"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
})

const ForgotPasswordPage = () => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // Define the mutation for the forgot password API
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(ResourceURL.RESET_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to send reset email")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: `Password reset email sent to ${form.getValues().email}!`,
        description: "Check your inbox for further instructions.",
        variant: "success",
        duration: 2500,
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
        duration: 2500,
      })
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values.email)
  }

  return (
    <Card className="w-full max-w-md shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </CardContent>
          <div className="p-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded hover:opacity-80 disabled:bg-gray-400"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

export default ForgotPasswordPage
