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


const SingupForm = () => {

  //this work like pop up message 
  const { toast } = useToast();

  //check if user is on our database
  const { checkAuthUser } = useUserContext();

  const navigate = useNavigate();

  //create account and save it on database
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccountMutation();

  //and after account created next user must be sign in   
  const { mutateAsync: signInAccount } =
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

    const newUser = await createUserAccount(values);

    if (!newUser) {
      
      return toast({
        title: "title: Sign up failed. Please try again.",
      });
    }

    //user will sign in
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      console.log(session)
      return toast({ title: "title: Sign in failed. Please try again." })

    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      return toast({ title: "title: Sign up failed. Please try again." });
    }
  }

  return (
    <div className="z-10 w-full ">
      <div className="absolute bg-gradient-to-t  from-primary-500/20 w-full h-[20%] bottom-0"></div>
      <Form {...form}>
        <div className=" relative  max-sm:w-[300px] sm:w-420 flex-center mx-auto  flex-col p-5 rounded-sm ">
          <img src="/assets/images/logo.svg" alt="" />

          <h2 className="font-bold max-sm:text-xl sm:text-xl pt-5 sm:pt-12">
            Create a new account
          </h2>
          <p className=" text-purple-300 text-xs md:text-base   mt-2">
            To use Snapgram, please enter your details
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
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                      type="password"
                      className="bg-zinc-700/40 focus:border-none  border-2 border-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary mt-5">
              {isCreatingAccount ? (
                <>
                  <Loader /> Loading...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            <p className=" font-thin text-[14px] opacity-90 text-center mt-2">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-primary-500 text-small-semibold ml-1"
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
