"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, User, Mail, Phone, MapPin, UserCheck } from "lucide-react"
import { getAllDistricts, getAllProvince } from "@/lib/api/province"
import { IDistrict, IProvince } from "@/types/province-type"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useDistricts, useProvinces, useWards } from "@/hooks/use-province"
import LoadingSelect from "@/components/loading/loading-select"
import ApplicationConstants from "@/constants/ApplicationConstants"
import { useDispatch } from "react-redux"
import { setUserId } from "@/redux/slices/authSlice"

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["M", "F", "O"]).refine((value) => !!value, {
    message: "Gender is required",
  }),
  address: z.object({
    line: z.string().min(1, "Address line is required"),
    provinceId: z.number().min(1, "Province is required"),
    districtId: z.number().min(1, "District is required"),
    wardId: z.number().min(1, "Ward is required"),
  }),
  avatar: z.string().nullable(),
})

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const dispatch = useDispatch()

  const stepCreateAcc = [
    { num: 1, label: "Account Info" },
    { num: 2, label: "Personal Info" },
    { num: 3, label: "Address" },
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      fullname: "",
      email: "",
      phone: "",
      gender: "M",
      address: {
        line: "",
        provinceId: 0,
        districtId: 0,
        wardId: 0,
      },
      avatar: null,
    },
  })

  const watchedProvinceId = useWatch({
    control: form.control,
    name: "address.provinceId",
  })

  const watchedDistrictId = useWatch({
    control: form.control,
    name: "address.districtId",
  })

  // React Query hooks
  const {
    data: provinces = [],
    isLoading: provincesLoading,
    error: provincesError,
  } = useProvinces()

  const {
    data: districts = [],
    isLoading: districtsLoading,
    error: districtsError,
  } = useDistricts(watchedProvinceId || null)

  const {
    data: wards = [],
    isLoading: wardsLoading,
    error: wardsError,
  } = useWards(watchedDistrictId || null)

  // Handle province change - reset district và ward
  const handleProvinceChange = (provinceId: string) => {
    const id = parseInt(provinceId)
    form.setValue("address.provinceId", id)
    form.setValue("address.districtId", 0) // Reset district
    form.setValue("address.wardId", 0) // Reset ward
  }

  // Handle district change - reset ward
  const handleDistrictChange = (districtId: string) => {
    const id = parseInt(districtId)
    form.setValue("address.districtId", id)
    form.setValue("address.wardId", 0)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    console.log("Form values", values)
    startTransition(async () => {
      try {
        const response = await fetch(`${ApplicationConstants}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data?.message || "An error occurred during sign up")
          return
        }

        dispatch(setUserId(data.userId))
        router.push("/confirm-token")
      } catch (error) {
        setError("An error occurred during sign up")
        console.error("Error when signing up", error)
      }
    })
  }

  const nextStep = async () => {
    const fieldsToValidate: (keyof z.infer<typeof formSchema>)[] =
      step === 1
        ? ["username", "password", "fullname", "email"]
        : ["phone", "gender"]

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {stepCreateAcc.map((item, index) => (
              <div key={item.num} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      step >= item.num
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {item.num}
                  </div>
                  <span
                    className={`text-sm transition-all duration-300 ${
                      step >= item.num
                        ? "text-blue-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-1 mx-4 transition-all duration-300 ${
                      step > item.num
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <div onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Join our platform and start your journey
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 px-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Step 1: Account Information */}
                {step === 1 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              Username
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Enter username"
                                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Enter full name"
                                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="email"
                                placeholder="Enter email address"
                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                {...field}
                              />
                            </div>
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
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className="pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {step === 2 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Enter phone number"
                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Gender
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200">
                                <SelectValue placeholder="Select your gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="M">Male</SelectItem>
                                  <SelectItem value="F">Female</SelectItem>
                                  <SelectItem value="O">Other</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Address Information */}
                {step === 3 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <FormField
                      control={form.control}
                      name="address.line"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Address Line
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Enter your address"
                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="address.provinceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              Province
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value?.toString() || ""}
                                onValueChange={handleProvinceChange}
                                disabled={provincesLoading}
                              >
                                {provincesLoading ? (
                                  <LoadingSelect placeholder="Loading provinces..." />
                                ) : (
                                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200">
                                    <SelectValue placeholder="Select Province" />
                                  </SelectTrigger>
                                )}
                                <SelectContent>
                                  <SelectGroup>
                                    {provinces?.map((province) => (
                                      <SelectItem
                                        key={province.province_id}
                                        value={province.province_id.toString()}
                                      >
                                        {province.province_name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.districtId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              District
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value?.toString() || ""}
                                onValueChange={handleDistrictChange}
                                disabled={
                                  districtsLoading || !watchedProvinceId
                                }
                              >
                                {districtsLoading ? (
                                  <LoadingSelect placeholder="Loading districts..." />
                                ) : (
                                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200">
                                    <SelectValue
                                      placeholder={
                                        !watchedProvinceId
                                          ? "Select province first"
                                          : "Select District"
                                      }
                                    />
                                  </SelectTrigger>
                                )}
                                <SelectContent>
                                  <SelectGroup>
                                    {districts?.map((district) => (
                                      <SelectItem
                                        key={district.district_id}
                                        value={district.district_id.toString()}
                                      >
                                        {district.district_name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.wardId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              Ward
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value?.toString() || ""}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                                disabled={wardsLoading || !watchedDistrictId}
                              >
                                {wardsLoading ? (
                                  <LoadingSelect placeholder="Loading wards..." />
                                ) : (
                                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200">
                                    <SelectValue
                                      placeholder={
                                        !watchedDistrictId
                                          ? "Select district first"
                                          : "Select Ward"
                                      }
                                    />
                                  </SelectTrigger>
                                )}
                                <SelectContent>
                                  <SelectGroup>
                                    {wards?.map((ward) => (
                                      <SelectItem
                                        key={ward.ward_id}
                                        value={ward.ward_id.toString()}
                                      >
                                        {ward.ward_name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between px-8 pb-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="px-8 py-3 h-12"
                  >
                    Previous
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => form.handleSubmit(onSubmit)()}
                    disabled={isPending}
                    className="ml-auto px-8 py-3 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </Form>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
