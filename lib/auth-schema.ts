import { z } from "zod";

// Bank Registration Schema
export const bankRegisterSchema = z.object({
  bankName: z
    .string()
    .min(3, { message: "Bank name must be at least 3 characters" })
    .max(100, { message: "Bank name too long" }),

  bankCode: z
    .string()
    .min(3, { message: "Bank code required" })
    .max(20, { message: "Bank code too long" })
    .regex(/^[A-Z0-9]+$/, {
      message: "Bank code must be uppercase letters/numbers",
    }),

  licenseNumber: z
    .string()
    .min(3, { message: "License number is required" })
    .max(50, { message: "License number too long" }),

  tin: z
    .string()
    .min(5, { message: "TIN must be at least 5 characters" })
    .max(20, { message: "TIN too long" }),

  headquartersAddress: z
    .string()
    .min(6, { message: "Address must be at least 6 characters" })
    .max(120, { message: "Address too long" }),

  adminName: z
    .string()
    .min(3, { message: "Admin name must be at least 3 chars" })
    .max(60, { message: "Admin name too long" }),

 

  adminPhone: z
    .string()
    .regex(/^(09|07|9|7)\d{8}$/, { message: "Enter correct phone number" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 chars" })
    .max(40, { message: "Password too long" }),
});

// Bank Login Schema
export const bankSigninSchema = z.object({
  bankCode: z
    .string()
    .min(3, { message: "Bank code is required" })
    .max(20, { message: "Bank code too long" }),

  password: z.string().min(8, { message: "Password must be at least 8 chars" }),
});
