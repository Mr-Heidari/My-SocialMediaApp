import { Route, Routes } from "react-router-dom";

import "./globals.css";

import SigninForm from "./_auth/forms/SigninForm";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from "./_root/pages";
import SingupForm from "./_auth/forms/SingupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";

export const App = () => {
  return (
    <main className=" flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          {/**public routes : every body can see */}
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SingupForm />} />
        </Route>

        {/**private routes : only ppl are sing in can see */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-pos:id" element={<EditPost />} />
          <Route path="/posts:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};
