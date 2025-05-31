"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ApplicationConstants from "@/constants/ApplicationConstants"
import { RootState } from "@/redux/store"
import { Mail } from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"

// const CheckEmailPage = () => (
//   <div
//     className="w-full min-h-screen flex items-center justify-center
//               bg-gradient-to-br from-blue-50 to-purple-50
//               dark:from-gray-900 dark:to-indigo-900"
//   >
//     <Card className="max-w-md w-full shadow-lg bg-white/90 dark:bg-gray-800/90">
//       <CardHeader className="flex flex-col items-center">
//         <Mail className="w-12 h-12 text-blue-600 mb-4" />
//         <CardTitle className="text-2xl font-bold text-center">
//           Check your email
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="text-center text-gray-700 dark:text-gray-300">
//         We’ve sent a verification link to your email address.
//         <br />
//         Please check your inbox and follow the instructions to verify your
//         account.
//       </CardContent>
//     </Card>
//   </div>
// )

const VerifyTokenPage = () => {
  const [token, setToken] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const userId = useSelector((state: RootState) => state.auth.userId)

  const handleVerify = async () => {
    setIsPending(true)
    setMessage(null)
    try {
      const response = await fetch(
        `${ApplicationConstants.API_PATH}/auth/registration/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      )
      const data = await response.json()
      if (response.ok) {
        setMessage("Your account has been verified successfully!")
      } else {
        setMessage(data.message || "Invalid or expired token.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
      throw error
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      <Card className="max-w-md w-full shadow-lg bg-white/90 dark:bg-gray-800/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Enter verification token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isPending}
            />
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={isPending || !token}
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>
            {message && (
              <div className="text-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                {message}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyTokenPage
