"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankSigninSchema } from "@/lib/auth-schema"; // <-- your schema
import { authClient } from "@/lib/auth-client"; // <-- your auth client
import { toast } from "sonner";
import { useState } from "react";

type SigninFormData = z.infer<typeof bankSigninSchema>;

export default function BankSignin() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(bankSigninSchema),
    defaultValues: {
      bankCode: "",
      password: "",
    },
  });

  async function onSubmit(values: SigninFormData) {
    const { bankCode, password } = values;

    try {
      await authClient.signIn.email(
        {
          email: `${bankCode}@esx.com`, // using bankCode as email
          password,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            toast.info("Authenticating...", {
              description: "Please wait while we sign you in",
            });
          },
          onSuccess: () => {
            toast.success("Welcome!", {
              description: "You've been signed in successfully",
            });
            window.location.href = "/dashboard";
          },
          onError: (ctx) => {
            let description = "Please check your credentials and try again";

            if (ctx.error?.message) {
              description = ctx.error.message;
            }

            toast.error("Sign in failed", { description });

            if (process.env.NODE_ENV !== "production") {
              console.error("Auth error →", ctx.error);
            }
          },
        }
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred";

      toast.error("Unexpected error", {
        description: message,
      });

      if (process.env.NODE_ENV !== "production") {
        console.error("Unexpected sign-in error →", err);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6">
      <title>Bank Sign In | Securities Exchange</title>
      <Card className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-blue-200">
        <CardHeader className="text-center space-y-2 mb-4 sm:mb-6">
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-blue-700">
            Bank Login
          </CardTitle>
          <CardDescription className="text-blue-500 text-base sm:text-lg">
            Sign in to your bank account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Bank Code Input */}
            <div className="space-y-2">
              <Label
                htmlFor="bankCode"
                className="font-semibold text-blue-700 text-sm sm:text-base"
              >
                Bank Code
              </Label>
              <Input
                id="bankCode"
                {...register("bankCode")}
                placeholder="Enter your bank code"
                className="placeholder-blue-300 text-blue-700 focus:ring-2 focus:ring-blue-400"
              />
              {errors.bankCode && (
                <p className="text-xs sm:text-sm text-blue-600 mt-1">
                  {errors.bankCode.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="font-semibold text-blue-700 text-sm sm:text-base"
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className="placeholder-blue-300 text-blue-700 focus:ring-2 focus:ring-blue-400"
              />
              {errors.password && (
                <p className="text-xs sm:text-sm text-blue-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-semibold text-white rounded-lg shadow-sm active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Debug note for deployment */}
          {process.env.NODE_ENV !== "production" && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              Debug mode: check console for full error details
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
