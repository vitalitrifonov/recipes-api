import { Link } from "react-router";
import IKImage from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

// Funktsioon esile tõstetud postituste toomiseks serverist
const fetchPost = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`);
  return res.data;
};

const FeaturedPosts = () => {
  // Pärime postitused React Query abil
  const {isPending, error, data} = useQuery({
    queryKey: ["featuredPosts"], // Cache võti
    queryFn: () => fetchPost(), // Funktsioon, mis päringu käivitab
  });

  // Kuvame laadimise või vea olekut
  if (isPending) return "Laadimine...";
  if (error) return "Midagi läks valesti!" + error.message;

  const posts = data.posts;
  if (!posts || posts.length === 0) {
    return null; // Kui postitusi pole, ei kuva midagi
  }

return (
  <div className="mt-8 flex flex-col lg:flex-row gap-8">
    {/* Suurim esiletõstetud postitus (1. koht) */}
    {posts[0] && (
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Pilt */}
        {posts[0].img && (
          <IKImage
            src={posts[0].img}
            className="rounded-3xl object-cover aspect-video"
            w="895"
          />
        )}
        {/* Postituse detailid */}
        <div className="flex items-center gap-4">
          <h1 className="font-semibold lg:text-lg">01.</h1>
          <Link to={`/posts?cat=${posts[0].category}`} className="text-gray-800 lg:text-lg hover:text-[#cc7e7c]">
            {posts[0].category}
          </Link>
          <span className="text-gray-500">{format(posts[0].createdAt)}</span>
        </div>
        {/* Pealkiri */}
        <Link to={posts[0].slug} className="text-xl lg:text-3xl font-semibold lg:font-bold hover:text-[#cc7e7c]">
          {posts[0].title}
        </Link>
      </div>
    )}

    {/* Järgmised kolm postitust väiksemas formaadis */}
    <div className="w-full lg:w-1/2 flex flex-col gap-4">
      {/* 2. postitus */}
      {posts[1] && (
        <div className="lg:h-1/3 flex justify-between gap-4">
          {posts[1].img && (
            <IKImage
              src={posts[1].img}
              className="rounded-3xl object-cover w-1/3 aspect-video"
              w="300"
            />
          )}
          <div className="w-2/3">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">02.</h1>
              <Link to={`/posts?cat=${posts[1].category}`} className="text-gray-800 lg:text-lg hover:text-[#cc7e7c]">
                {posts[1].category}
              </Link>
              <span className="text-gray-500">{format(posts[1].createdAt)}</span>
            </div>
            <Link to={posts[1].slug} className="text-xl lg:text-3xl font-semibold lg:font-bold hover:text-[#cc7e7c]">
              {posts[1].title}
            </Link>
          </div>
        </div>
      )}

      {/* 3. postitus */}
      {posts[2] && (
        <div className="lg:h-1/3 flex justify-between gap-4">
          {posts[2].img && (
            <IKImage
              src={posts[2].img}
              className="rounded-3xl object-cover w-1/3 aspect-video"
              w="300"
            />
          )}
          <div className="w-2/3">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">03.</h1>
              <Link to={`/posts?cat=${posts[2].category}`} className="text-gray-800 lg:text-lg hover:text-[#cc7e7c]">
                {posts[2].category}
              </Link>
              <span className="text-gray-500">{format(posts[2].createdAt)}</span>
            </div>
            <Link to={posts[2].slug} className="text-xl lg:text-3xl font-semibold lg:font-bold hover:text-[#cc7e7c]">
              {posts[2].title}
            </Link>
          </div>
        </div>
      )}

      {/* 4. postitus */}
      {posts[3] && (
        <div className="lg:h-1/3 flex justify-between gap-4">
          {posts[3].img && (
            <IKImage
              src={posts[3].img}
              className="rounded-3xl object-cover w-1/3 aspect-video"
              w="300"
            />
          )}
          <div className="w-2/3">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">04.</h1>
              <Link to={`/posts?cat=${posts[3].category}`} className="text-gray-800 lg:text-lg hover:text-[#cc7e7c]">
                {posts[3].category}
              </Link>
              <span className="text-gray-500">{format(posts[3].createdAt)}</span>
            </div>
            <Link to={posts[3].slug} className="text-xl lg:text-3xl font-semibold lg:font-bold hover:text-[#cc7e7c]">
              {posts[3].title}
            </Link>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default FeaturedPosts;