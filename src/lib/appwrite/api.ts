/* eslint-disable @typescript-eslint/no-explicit-any */
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, ImageGravity, Models, Query } from "appwrite";

//create account request
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    //create avatar image by initials user name
    const avatarUrl = avatars.getInitials(user.name);

    //save user to DB
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

//save account to out user collection in DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

//login account requset
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.log(error);
  }
}

//on each browser and ip address user can just have 1 account are loged in
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
   
  }
}

//logout account request
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    localStorage.removeItem('cookieFallback')
    return session;
  } catch (error) {
    console.log(error);
  }
}

//=========================================post/ create / delete and ....
export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    console.log(uploadedFile);
    if (!uploadedFile) throw Error;

    //check if image was uploaded on storage

    const fileUrl = getFilePreview(uploadedFile.$id);
    console.log(fileUrl);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    //create array of tags
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    console.log(tags);
    //create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    console.log(newPost);
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

//upload post image resquest to storage
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

//get image from storage
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      50
    );
    console.log(fileUrl);
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

//delete post image
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

//get recent by time creation
export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw Error;

  return posts;
}

// Delete Post
export async function deletePost(
  postId?: string,
  imageId?: string,
) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// SAVE POST : each user can save post
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// Update Post
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

//LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== Remove SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// User Posts
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// get selected postId
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// re fetch posts when reach end of posts post limit set on 9
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

//serach post by caption
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getSuggestedUsers() {
  const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(8)];
  try {
    const suggestedUsers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );
    if (!suggestedUsers) throw Error;

    return suggestedUsers;
  } catch (error) {
    console.log(error);
  }
}

export async function userFollowRequest(
  requesterId: string,
  receiverId: string
) {
  try {
    const saveRequestToDB = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followingCollectionId,
      ID.unique(),
      {
        following: requesterId,
        followers: receiverId,
      }
    );

    if (!saveRequestToDB) throw Error;

    console.log(saveRequestToDB);

    return saveRequestToDB;
  } catch (error) {
    console.log(error);
  }
}

export async function getFollwingAndFollowers() {
  try {
    const allRequest = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followingCollectionId
    );

    if (!allRequest) throw Error;

    return allRequest;
  } catch (error) {
    console.log(error);
  }
}

export async function userUnfollowRequest(requestId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followingCollectionId,
      requestId
    );

    if (!statusCode) throw Error;
  } catch (error) {
    console.log(error);
  }
}

export function getProfileImagePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      400,
      400,
      ImageGravity.Top,
      50
    );
    console.log(fileUrl);
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function updateProfile({
  user,
  avatarFile,
  bio,
  newName,
  newUsername,
}: {
  user: Models.Document;
  avatarFile?: File[];
  bio: string;
  newName?: string;
  newUsername?: string;
}) {
  try {
    let uploadedFile;
    if (avatarFile) {
      const avatarUrl = avatars.getInitials(user.name);
      uploadedFile = await uploadFile(avatarFile[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getProfileImagePreview(uploadedFile.$id);

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      if (user.imageId) {
        const deletePrevImage = await deleteFile(user.imageId);

        if (!deletePrevImage) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }

        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.$id,
          {
            imageId: "",
            imageUrl: avatarUrl,
          }
        );
      }

      const statusCode = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,
        {
          imageId: uploadedFile.$id,
          imageUrl: fileUrl,
          bio: bio,
          name: newName,
          username: newUsername,
        }
      );

      if (!statusCode) {
        // Delete new file that has been recently uploaded

        await deleteFile(uploadedFile.$id);
      }

      return statusCode;
    } else {
      let statusCode;

      if (!user.imageId) {
        const avatarUrl = avatars.getInitials(user.name);
        statusCode = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.$id,
          {
            bio: bio,
            name: newName,
            username: newUsername,
            imageUrl: avatarUrl,
          }
        );
      } else {
        statusCode = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.$id,
          {
            bio: bio,
            name: newName,
            username: newUsername,
          }
        );
      }
      return statusCode;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProfileImage({ user }: { user: Models.Document }) {
  try {
    const deleteImage = await deleteFile(user.imageId);

    if (!deleteImage) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const statusCode = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.$id,
      {
        imageId: "",
        imageUrl: avatarUrl,
      }
    );

    if (!statusCode) throw Error;

    return statusCode;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPeople(searchTerm: string) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("name", searchTerm)]
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}
