import PostListItem from "./PostListItem";
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
// Automaatne lõpmatu kerimine
import InfiniteScroll from 'react-infinite-scroll-component';
// URL-i otsingupäringute (query params) lugemiseks
import { useSearchParams } from 'react-router';

// Funktsioon postituste toomiseks serverist
const fetchPosts = async (pageParam, searchParams) => {
    // Teisendame otsingupäringud tavaliseks objektiks
    const searchParamsObj = Object.fromEntries([...searchParams]);

    console.log(searchParamsObj); // Debug eesmärgil
    
    // Teeme GET-päringu serverile koos query parameetritega
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: { page: pageParam, limit: 5, ...searchParamsObj }, // Lisame lehe ja piiri (limit) parameetrid
    });
    return res.data;
};

const PostList = () => {
    // URL-i otsingupäringud (nt ?cat=vegan&sort=popular)
    const [searchParams] = useSearchParams();
    // React Query kasutamine postituste toomiseks
    const {
        data,               // Kõik lehed koos postitustega
        fetchNextPage,      // Funktsioon järgmise lehe toomiseks
        hasNextPage,        // Boolean, kas veel on lehti
        status,             // Laadimise olek (loading, error, success)
    } = useInfiniteQuery({
        queryKey: ['posts', searchParams.toString()], // unikaalne päringu võti
        queryFn: ({ pageParam=1 }) => fetchPosts(pageParam, searchParams),
        initialPageParam: 1,
        // Määrame, millal saab järgmist lehte laadida
        getNextPageParam: (lastPage, pages) => 
            lastPage.hasMore ? pages.length + 1 : undefined,
    });
    // Erinevad laadimisolekud
    if (status === "loading") return "Loading...";
    if (status === "error") return "Midagi läks valesti!";

    // Kombineerime kõik lehed üheks postituste massiiviks
    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  
    console.log(data); // Debug
    
    return (
        // InfiniteScroll tekitab automaatse laadimise, kui kasutaja jõuab lõppu
        <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4>Laadime rohkem retsepte...</h4>}
            endMessage={
                <p>
                    <b>Te nägite kõiki retsepte!</b>
                </p>
            }
        >
            {/* Iga postituse kuvamine */}
            {allPosts.map((post) => (
                <PostListItem key={post._id} post={post} />
            ))}
        </InfiniteScroll>
    );
};

export default PostList;