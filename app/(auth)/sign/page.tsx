"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankRegisterSchema } from "@/lib/auth-schema"; // <-- use BANK schema
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

type SignupFormData = z.infer<typeof bankRegisterSchema>;

export default function BankSignup() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(bankRegisterSchema),
    defaultValues: {
      bankName: "",
      bankCode: "",
      licenseNumber: "",
      tin: "",
      headquartersAddress: "",

      adminName: "",
    
      adminPhone: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupFormData) {
    try {
      toast.info("Registering bank...", { duration: 4000 });
      const { error } = await authClient.signUp.email(
        {
          email: `${values.bankCode}@esx.com`,
          password: `${values.password}`,
          name: `${values.bankName} - ${values.adminName}` ,
          image: `${values.headquartersAddress} - ${values.licenseNumber}`,
        
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            toast.loading("Processing your request...");
          },
          onSuccess: () => {
            toast.success("Bank registered successfully!");
            window.location.href = "/sign-in";
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Registration failed, try again.");
          },
        }
      );
      if (error) {
        toast.error(error.message || "Signup failed, please try again.");
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
      console.error("Bank sign-up error →", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6">
      <title>Bank Registration | Securities Exchange</title>
      <Card className="w-full max-w-2xl bg-white rounded-xl shadow-sm border-0">
        <CardHeader className="text-center space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Register Bank
          </CardTitle>
          <CardDescription className="text-blue-500">
            Onboard your bank to the Securities Exchange
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Bank Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-700">Bank Name</Label>
                <Input
                  {...register("bankName")}
                  placeholder="Commercial Bank"
                />
                {errors.bankName && (
                  <p className="text-xs text-blue-600">
                    {errors.bankName.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-blue-700">Bank Code</Label>
                <Input {...register("bankCode")} placeholder="CBE001" />
                {errors.bankCode && (
                  <p className="text-xs text-blue-600">
                    {errors.bankCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-700">License Number</Label>
                <Input {...register("licenseNumber")} placeholder="NB12345" />
                {errors.licenseNumber && (
                  <p className="text-xs text-blue-600">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-blue-700">TIN</Label>
                <Input {...register("tin")} placeholder="123456789" />
                {errors.tin && (
                  <p className="text-xs text-blue-600">{errors.tin.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-blue-700">Headquarters Address</Label>
              <Input
                {...register("headquartersAddress")}
                placeholder="Bole, Addis Ababa"
              />
              {errors.headquartersAddress && (
                <p className="text-xs text-blue-600">
                  {errors.headquartersAddress.message}
                </p>
              )}
            </div>

            {/* Admin Info */}
            <div>
              <Label className="text-blue-700">Admin Name</Label>
              <Input {...register("adminName")} placeholder="John Doe" />
              {errors.adminName && (
                <p className="text-xs text-blue-600">
                  {errors.adminName.message}
                </p>
              )}
            </div>

      

            <div>
              <Label className="text-blue-700">Admin Phone</Label>
              <Input {...register("adminPhone")} placeholder="0912345678" />
              {errors.adminPhone && (
                <p className="text-xs text-blue-600">
                  {errors.adminPhone.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label className="text-blue-700">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs hover:text-blue-800 text-blue-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="text-xs text-blue-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering bank...
                </>
              ) : (
                "Register Bank"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4 text-center text-sm text-blue-600">
          <div>
            Already registered?{" "}
            <Link
              href="/sign-in"
              className="text-blue-700 font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
