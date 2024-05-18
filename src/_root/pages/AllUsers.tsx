import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/shared/Loader";
import UserGridList from "@/components/ui/shared/UserGridList";
import { useUserContext } from "@/context/AuthContext";
import useDebounce from "@/hook/useDebounce";
import {
  useGetSuggestedUsers,
  useSearchPeople,
} from "@/lib/reat-query/queriesAndMutation";
import { useState } from "react";
import { Models } from "appwrite";
import { IUser } from "@/types";
import UserCard from "@/components/ui/shared/UserCard";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPeoples: Models.DocumentList<Models.Document> | null | undefined;
  user: IUser;
};

//in explor page we can have 2 scenario 1 of them if user want search posts  so we render some jsx elemnet
const SearchResults = ({
  isSearchFetching,
  searchedPeoples,
  user,
}: SearchResultProps) => {
  //if our fetching data was on isfetching property on useQuery hook in react-query lib
  if (isSearchFetching) {
    return (
      <div className="mx-auto mt-10">
        <Loader width={30} height={30} />
      </div>
    );

    // if data fetchet and data array have lenght
  } else if (searchedPeoples && searchedPeoples?.documents.length > 0) {
    return searchedPeoples?.documents.map((people) => (
      <UserGridList people={people} user={user} key={people.$id} />
    ));

    //if search result wasnt match with any post captions
  } else {
    return (
      <p className="text-neutral-400 mt-10 text-center w-full">
        No results found
      </p>
    );
  }
};

const AllUsers = () => {
  //get user data
  const { user } = useUserContext();

  //get suggest user form DB
  const { data: users } = useGetSuggestedUsers();

  //save search input Value
  const [searchValue, setSearchValue] = useState<string>("");

  //a samll delay for calling api 
  const debouncedSearch = useDebounce(searchValue, 500);

  //get searched peoples  from db
  const { data: peoples, isFetching: isSearchFetching } =
    useSearchPeople(debouncedSearch);

  const shouldShowSearchResults = searchValue !== "";

  const shouldShowPeoples =
    !shouldShowSearchResults &&
    peoples?.documents.every((item) => item?.documents?.length === 0);

  const suggestedUsers = users?.documents.filter((currentuser) => {
    return currentuser.$id !== user.id;
  });

  return (
    <>
      {/** desktop */}
      <div className="w-full px-14 pt-14 max-h-screen overflow-auto max-lg:hidden">
        <h2 className="h3-bold md:h2-bold w-full mb-10">Search Users</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
            className="invert brightness-0"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
        <div className="w-full h-fit flex flex-col gap-2 ">
          {shouldShowSearchResults ? (
            <SearchResults
              isSearchFetching={isSearchFetching}
              searchedPeoples={peoples}
              user={user}
            />
          ) : shouldShowPeoples ? (
            <p className="text-light-4 mt-10 text-center w-full">
              End of peoples
            </p>
          ) : (
            <p></p>
          )}
        </div>
      </div>


      {/** tablet, ipad, mobile, etc.. */}

      <div className="peoplemobile">
        <div className="p-5 md:p-10">
        <h2 className="h3-bold md:h2-bold w-full mb-5 mt-5">Search Users</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
            className="invert brightness-0"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
        <div className="w-full h-fit flex flex-col gap-2 ">
          {shouldShowSearchResults ? (
            <SearchResults
              isSearchFetching={isSearchFetching}
              searchedPeoples={peoples}
              user={user}
            />
          ) : shouldShowPeoples ? (
            <p className="text-light-4 mt-10 text-center w-full">
              End of peoples
            </p>
          ) : (
            <div className="md:mx-10  mt-5 max-md:mb-5">
              <p className=" text-white/70 mb-5">Suggested for you</p>
              <div className="flex flex-col   h-fit gap-5 ">
                {suggestedUsers?.map((user) => (
                  <UserCard
                    key={user.$createdAt}
                    name={user.name}
                    userName={user.username}
                    id={user.$id}
                    imageUrl={user.imageUrl}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
