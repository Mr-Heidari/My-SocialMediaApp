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
import { SinginValidation} from "@/lib/validation";
import Loader from "@/components/ui/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
  useSignInAccount,
} from "@/lib/reat-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";


const SinginForm = () => {

  //this work like pop up message 
  const { toast } = useToast();

   //check if user is on our database
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const navigate = useNavigate();

  const { mutateAsync: signInAccount} =
    useSignInAccount();

  //1. Define your form
  const form = useForm<z.infer<typeof SinginValidation>>({
    resolver: zodResolver(SinginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SinginValidation>) {
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
            Log in to your account
          </h2>
          <p className=" text-purple-300 text-xs md:text-base   mt-2">
            Welcome back, please enter your details
          </p>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full mt-4"
          >
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
              {isUserLoading ? (
                <>
                  <Loader width={18} height={18}/> Loading...
                </>
              ) : (
                "Log in"
              )}
            </Button>
            <p className=" font-thin text-[14px] opacity-90 text-center mt-2">
              Don't have an account?
              <Link
                to="/sign-up"
                className="text-primary-500 text-small-semibold ml-1"
              >
                Sign up
              </Link>{" "}
            </p>
          </form>
        </div>
      </Form>
    </div>
  );
};
export default SinginForm;
