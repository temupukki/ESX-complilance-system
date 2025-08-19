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
import { bankRegisterSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

// Create a modified schema without password field
const bankRegisterSchemaWithoutPassword = bankRegisterSchema.omit({ password: true });
type SignupFormData = z.infer<typeof bankRegisterSchemaWithoutPassword>;

export default function BankSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(bankRegisterSchemaWithoutPassword),
    defaultValues: {
      bankName: "",
      bankCode: "",
      licenseNumber: "",
      tin: "",
      headquartersAddress: "",
      adminName: "",
      adminPhone: "",
    },
  });

  async function onSubmit(values: SignupFormData) {
    try {
      toast.info("Registering bank...", { duration: 4000 });
      
      // Generate default password based on bank code
      const defaultPassword = `${values.bankCode}@12341234`;
      
      const { error } = await authClient.signUp.email(
        {
          email: `${values.bankCode}@esx.com`,
          password: defaultPassword, // Using default password
          name: `${values.bankName} - ${values.adminName}`,
          image: `${values.headquartersAddress} - ${values.licenseNumber}`,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            toast.loading("Processing your request...");
          },
          onSuccess: () => {
            toast.success("Bank registered successfully! Default password is your bank code followed by @1234");
            window.location.href = "/";
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
            Register Issuer
          </CardTitle>
          <CardDescription className="text-blue-500">
            Onboard your Issuer to the ESX
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

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                Default password will be automatically generated as: <strong>yourissuercode@12341234</strong>
                
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering Issuer...
                </>
              ) : (
                "Register Issuer"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}