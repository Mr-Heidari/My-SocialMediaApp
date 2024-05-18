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
import { EditProfileValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";

import {
  useDeleteProfileImage,
  useGetCurrentUser,
  useUpdateProflie,
} from "@/lib/reat-query/queriesAndMutation";
import FileUploader from "@/components/ui/shared/FileUploader";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // revalidate user data for clinet comp
  const { checkAuthUser, user: userStats } = useUserContext();

  //get user data
  const { data: user } = useGetCurrentUser();

  //send new attribute to DB for each user
  const { mutateAsync: updateProfile, isPending: isUpdatedConfirmed } =
    useUpdateProflie();
    
  const { mutate: deleteProfileImage ,isPending:isDeleting , isSuccess} = useDeleteProfileImage();

  const form = useForm<z.infer<typeof EditProfileValidation>>({
    resolver: zodResolver(EditProfileValidation),
    values: {
      bio: userStats ? userStats.bio : "",
      name: userStats ? userStats.name : "",
      username: userStats ? userStats.username : "",
      email: userStats ? userStats.email : "",
      file: [],
    },
  });

  if (!user)
    return (
      <div className="flex-center w-full h-full max-md:pt-20">
        <Loader width={40} height={40} />
      </div>
    );
  //we create form with useform hook and set input validation with zod library

  const handleDeleteProfileImage = () => {
    deleteProfileImage({ user });
  };

  // Handler
  const handleSubmit = async (value: z.infer<typeof EditProfileValidation>) => {
    let statusCode;
    if (value.file.length > 0) {
      statusCode = await updateProfile({
        user: user,
        avatarFile: value.file,
        bio: value.bio,
        newName: value.name,
        newUsername: value.username,
      });
    } else {
      statusCode = await updateProfile({
        user: user,
        bio: value.bio,
        newName: value.name,
        newUsername: value.username,
      });
    }

    if (!statusCode) {
      toast({
        title: ` update Profile Failed. Please try again.`,
      });
    }

    checkAuthUser();

    navigate(-1);
  };

  return (
    <>
      <div className="overflow-auto max-md:px-5  max-md:py-24 max-md:pb-40  max-h-screen custom-scrollbar w-full p-10">
        <h1 className="mx-10 font-extrabold m-5 flex flex-row gap-2 mb-10">
          <img
            src="/assets/icons/profile-icone.svg"
            width={40}
            height={40}
            alt=""
          />
          <p className="my-auto h3-bold md:h2-bold w-full">Edit Profile</p>
        </h1>
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex  flex-col justify-between gap-5  "
            >
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="w-full h-40 bg-neutral-600  relative overflow-hidden rounded-md max-w-[300px] mx-auto">
                    <img
                      src={user.imageUrl}
                      alt=""
                      className="w-full h-full  absolute object-cover"
                    />
                    <div className="w-full h-full  absolute  bg-black/80 backdrop-blur-sm -top-2">
                      {!isDeleting ? 
                      <img
                        src="/assets/icons/delete-icone.svg"
                        alt=""
                        className={` bg-neutral-600 p-1 rounded-full absolute right-2 top-2 cursor-pointer ${!user.imageId && " hidden" }`}
                        onClick={handleDeleteProfileImage}
                      /> : <div className="absolute right-2 top-2"><Loader width={30} height={30} /></div>}
                    </div>
                    <FormLabel className="shad-form_label"></FormLabel>
                    <FormControl>
                      <FileUploader
                        fieldChange={field.onChange}
                        mediaUrl={user.imageUrl}
                        usage="personalize"
                        isDeleteSuccess={isSuccess}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <div className="w-full flex gap-5 flex-col">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">bio</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-neutral-700  min-w-[300px] border-none outline-none ring-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className=" text-red relative -translate-y-4" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-neutral-700  min-w-[300px] border-none outline-none ring-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className=" text-red relative -translate-y-4" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">
                        username
                      </FormLabel>
                      <FormControl className="relative">
                        <Input
                          className="bg-neutral-700  min-w-[300px] border-none outline-none ring-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className=" text-red relative -translate-y-4" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">email</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-neutral-700  min-w-[300px] border-none outline-none ring-transparent cursor-none"
                          {...field}
                          readOnly
                          disabled
                        />
                      </FormControl>
                      <FormMessage className="text-red relative -translate-y-4" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 items-center justify-end">
                <Button
                  type="button"
                  className="shad-button_dark_4"
                  onClick={() => navigate(-1)}
                  disabled={isUpdatedConfirmed}
                >
                  Cancell
                </Button>
                <Button
                  type="submit"
                  className="shad-button_primary whitespace-nowrap"
                  disabled={isUpdatedConfirmed}
                >
                  {isUpdatedConfirmed ? (
                    <div className=" m-auto flex flex-row">
                      <Loader width={28} height={28} color="invert"/> Loading...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
