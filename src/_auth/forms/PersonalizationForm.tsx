import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PresonalizeProfileValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";

import {
  useGetCurrentUser,
  useUpdateProflie,
} from "@/lib/reat-query/queriesAndMutation";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/ui/shared/FileUploader";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/shared/Loader";
import { useUserContext } from "@/context/AuthContext";

const PersonalizationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  //revalidate user data for clinet comp
  const { checkAuthUser } = useUserContext();

  //get currentuser Data
  const { data: user } = useGetCurrentUser();

  //update profile image and bio
  const { mutateAsync: updateProfile, isPending: isUpdatedConfirmed } =
    useUpdateProflie();

  const form = useForm<z.infer<typeof PresonalizeProfileValidation>>({
    resolver: zodResolver(PresonalizeProfileValidation),
    defaultValues: {
      bio: "",
      file: [],
    },
  });

  if (!user)
    return (
      <>
        <Loader width={30} height={30} />
      </>
    );
  //we create form with useform hook and set input validation with zod library

  // Handler
  const handleSubmit = async (
    value: z.infer<typeof PresonalizeProfileValidation>
  ) => {
    const statusCode = await updateProfile({
      user: user,
      avatarFile: value.file,
      bio: value.bio,
    });

    if (!statusCode) {
      toast({
        title: ` update Profile Failed. Please try again.`,
      });
    }

    //revalidate our user data before navigate to home page
    checkAuthUser();

    if(statusCode){navigate("/");}
    
  };

  return (
    <>
      <div
        className={`w-full h-full flex absolute z-50 bg-black/60 ${
          !isUpdatedConfirmed && " hidden"
        }`}
      >
        <div className=" m-auto">
          <Loader width={50} height={50} /> Loading...
        </div>
      </div>
      <div className="overflow-auto w-full p-10">
        <h1 className="mx-10 font-extrabold m-5 flex flex-row gap-2 mb-10">
          <img
            src="/assets/icons/profile-icone.svg"
            width={40}
            height={40}
            alt=""
          />
          <p className="my-auto">Personalize your Profile</p>
        </h1>
        <div>
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex lg:flex-row  flex-col justify-between gap-9  md:px-40 "
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Profile Avatar
                  </FormLabel>
                  <FormControl>
                    <FileUploader
                      fieldChange={field.onChange}
                      mediaUrl={""}
                      usage="personalize"
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="w-full">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="shad-textarea custom-scrollbar min-w-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate("/")}
                disabled={isUpdatedConfirmed}
              >
                {isUpdatedConfirmed && <Loader width={18} height={18} />}
                Skip
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isUpdatedConfirmed}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
        </div>
      </div>
    </>
  );
};

export default PersonalizationForm;
