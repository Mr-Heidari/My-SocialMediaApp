import { z } from "zod";

export const SingupValidation = z.object({
  name: z.string().min(2, { message: "Too Short" }),
  username: z.string().min(2, { message: "Too Short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters ." }),
});

export const SinginValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters ." }),
});

export const PostValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});

export const PresonalizeProfileValidation=z.object({
  bio: z.string().min(5).max(100),
  file: z.custom<File[]>(),
});

export const EditProfileValidation = z.object({
  bio: z.string().min(5).max(100),
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Too Short" }),
  username: z.string().min(2, { message: "Too Short" }),
  email: z.string().email(),
});