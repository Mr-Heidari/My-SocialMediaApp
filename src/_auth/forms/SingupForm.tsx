import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SingupValidation } from "@/lib/validation";
import Loader from "@/components/ui/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateUserAccountMutation,
  useSignInAccount,
} from "@/lib/reat-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";

const SingupForm = () => {
  const [showPassword, setShowpassword] = useState(false);

  //this work like pop up message
  const { toast } = useToast();

  //check if user is on our database
  const { checkAuthUser, isLoading: isLoggedIn } = useUserContext();

  const navigate = useNavigate();

  //create account and save it on database
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccountMutation();

  //and after account created next user must be sign in
  const { mutateAsync: signInAccount, isPending: singinLoaded } =
    useSignInAccount();

  //1. Define form with zod Validation library
  const form = useForm<z.infer<typeof SingupValidation>>({
    resolver: zodResolver(SingupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SingupValidation>) {
    //first create account on DB
    const newUser = await createUserAccount(values);

    //if creation failed
    if (!newUser) {
      return toast({
        title: "title: Sign up failed. Please try again.",
      });
    }

    //save browser and ip address and device on DB with user email and passwrod
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    //if saved failed
    if (!session) {
      console.log(session);
      return toast({ title: "title: Sign in failed. Please try again." });
    }

    //we need this cuz wanna all of our entire app know user is logged in or not on DB
    const isLoggedIn = await checkAuthUser();

    //if user was on DB as logged in user next go to home page
    if (isLoggedIn) {
      form.reset();

      navigate("/pesonalizeProfile/");
    } else {
      return toast({ title: "title: Sign up failed. Please try again." });
    }
  }

  return (
    <div className="z-10 w-full ">
      <Form {...form}>
        <div className=" relative  border-2 border-white/60 bg-white/20 backdrop-blur-3xl drop-shadow-2xl shadow-black  max-sm:w-[300px] sm:w-420 flex-center mx-auto  flex-col p-5 rounded-md ">
          <div className="flex flex-row gap-2">
            <img
              src="/assets/images/logo.svg"
              width={40}
              height={40}
              alt=""
              className="bg-white object-cover  rounded-2xl"
            />
            <p className="my-auto">my-socialmedia-app</p>
          </div>
          <h2 className="font-bold max-sm:text-xl pt-5 sm:text-xl sm:pt-6">
            Create a new account
          </h2>
          <p className=" text-neutral-400  md:text-base max-sm:text-xs mt-2">
            To use this app, please enter your details
          </p>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50 ring-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-gray-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50 ring-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-gray-300 " />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50 ring-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-gray-300 " />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50 ring-transparent"
                      {...field}
                    />
                  </FormControl>
                  <img
                    src={
                      showPassword
                        ? "/assets/icons/show-icone.svg"
                        : "/assets/icons/hide-icone.svg"
                    }
                    alt=""
                    className="absolute right-2 top-8 cursor-pointer"
                    onClick={() => setShowpassword((prev) => !prev)}
                  />
                  <FormMessage className="text-gray-300 t" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-neutral-800 mt-5"
              disabled={isLoggedIn || isCreatingAccount || singinLoaded}
            >
              {isCreatingAccount || singinLoaded ? (
                <>
                  <Loader width={18} height={18} /> Loading...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            <p className=" font-thin text-[14px] opacity-90 text-center mt-2">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-gray-200 bg-neutral-700 p-2 rounded-md text-small-semibold ml-1"
              >
                Log in
              </Link>{" "}
            </p>
          </form>
        </div>
      </Form>
    </div>
  );
};
export default SingupForm;
