/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hook/useDebounce";
import  Loader  from "@/components/ui/shared/Loader";
import { useGetPosts, useSearchPosts } from "@/lib/reat-query/queriesAndMutation";
import GridPostList from "@/components/ui/shared/GridPostList";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};


//in explor page we can have 2 scenario 1 of them if user want search posts  so we render some jsx elemnet
const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {

  //if our fetching data was on isfetching property on useQuery hook in react-query lib
  if (isSearchFetching) {
    return <Loader width={30} height={30} />;

    // if data fetchet and data array have lenght
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;

    //if search result wasnt match with any post captions
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

//explor page
const Explore = () => {

  /*this package have hook  when  element enter or leave viewport  on page that mean elemnt come inside of our pageview  or leave it 
  so we can set him on container */
  const { ref, inView } = useInView();

  //we use useInfiniteQuery from react query for get posts with limit and every time we reach end of our page we get another 9 posts we can see nicee loader on bottom of page with useInview hook until posts loaded
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();


  //search value send to our DB for searching by caption
  const [searchValue, setSearchValue] = useState("");

  //make samll delay if user thinking or slow type For the purpose of receiving the data, get it.
  const debouncedSearch = useDebounce(searchValue, 500);
  
  //fetch posts by searchvalue 
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);


  //fetch next page of posts if we have nextpage
  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

 
  //data not yet recive
  if (!posts)
    return (
      <div className="flex-center w-full h-full" >
        <Loader width={30} height={30}/>
      </div>
    );

  //check we have serch value or not
  const shouldShowSearchResults = searchValue !== "";

  //check if we dont have search value and we dont have any posts
  const shouldShowPosts = !shouldShowSearchResults && 
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
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
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full" >End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item?.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader width={30} height={30} />
        </div>
      )}
    </div>
  );
};

export default Explore;