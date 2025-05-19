import { Link, useParams } from "react-router";
import IKImage from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "timeago.js";

// Funktsioon retsepti andmete pärimiseks API-st slug'i põhjal
const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  // URL-i parameetrist retsepti slug
  const { slug } = useParams();

  // Kasutame React Query'd andmete pärimiseks ja haldamiseks
  const {isPending, error, data} = useQuery({
    queryKey: ["post", slug], // unikaalne päringu võti
    queryFn: () => fetchPost(slug), // päringu funktsioon
  });

  // Laadimise ajal kuvame "Loading..."
  if (isPending) return <div>Loading...</div>;
  // Kui päring ebaõnnestub, kuvame vea sõnumi
  if (error) return <div>Error: {error.message}</div>;
  // Kui andmeid ei leidu, kuvame vastava teate
  if (!data) return <div>No data found</div>;


  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-8">
          {/* Postituse detailid ja info */}
          <div className="flex gap-8">
            <div className="lg:w-3/5 flex flex-col gap-4">
              {/* Postituse pealkiri */}
              <h1 className="text-[#9e663c] text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
                {data.title}
              </h1>
              {/* Autor, kuupäev ja kategooria lingid */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>Retsepti autor:</span>
                <Link to={`/posts?author=${data.user.username}`} className="text-[#cc7e7c] font-semibold hover:text-black transition-colors">{data.user.username}</Link>
                <span>{format(data.createdAt)}</span>
                <span>Kategooria:</span>
                <Link to={`/posts?cat=${data.category}`} className="text-[#cc7e7c] font-semibold hover:text-black transition-colors">{data.category}</Link>
              </div>
              {/* Kirjeldus */}
              <p className='text-gray-500 font-medium'>
                {data.desc}
              </p>
            </div>
            {/* Postituse pilt */}
            {data.img && <div className="hidden lg:block w-2/5">
              <IKImage src={data.img} w="600" className="rounded-2xl"/>
            </div>}
          </div>
          {/* Peamine sisu ja külgriba */}
          <div className="flex flex-col md:flex-row gap-12 justify-between">
            {/* Postituse tekstisisu, mis võib sisaldada HTML-i õigesti kuvamiseks */}
            <div className="lg:text-lg flex flex-col gap-6 text-justify">
              <div
              dangerouslySetInnerHTML={{ __html: data.content }}
              ></div>
            </div>
            {/* Külgriba: autor, postituse toimingud, kategooriad ja otsing */}
            <div className="px-4 h-max sticky top-8">
              <h1 className="mb-4 text-sm font-semibold">Autor</h1>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {/* Autori pilt, kui olemas */}
                  {data.user.img && <IKImage src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="100"
                  h="100"
                  />}
                  <Link to={`/posts?author=${data.user.username}`} className="text-[#cc7e7c] text-sm font-semibold hover:text-black transition-colors">{data.user.username}</Link>
                </div>
              </div>
              {/* Postituse toimingute menüü */}
              <PostMenuActions post={data}/>
              {/* Kategooriad */}
              <h1 className="mt-8 mb-4 text-sm font-semibold">Kategooriad</h1>
              <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/posts"
                className="hover:text-[#cc7e7c]"
              >
              Kõik retseptid
              </Link>
              <Link
                to="/posts?cat=homemade"
                className="hover:text-[#cc7e7c]"
              >
              Kodused toidud
              </Link>
              <Link
                to="/posts?cat=desserts"
                className="hover:text-[#cc7e7c]"
              >
              Magustoidud
              </Link>
              <Link
                to="/posts?cat=vegan"
                className="hover:text-[#cc7e7c]"
              >
              Taimetoidud
              </Link>
              <Link
                to="/posts?cat=soups"
                className="hover:text-[#cc7e7c]"
              >
              Supid
              </Link>
              <Link
                to="/posts?cat=salads"
                className="hover:text-[#cc7e7c]"
              >
              Salatid
              </Link>
              </div>
              <h1 className="mt-8 mb-4 text-sm font-semibold">Otsing</h1>
              {/* Otsingukomponent */}
              <Search />
              </div>
            </div>
            {/* Kommentaaride sektsioon, kasutades postituse ID-d */}
            <Comments postId={data._id}/>
          </div>
        </div>
  );
};

export default SinglePostPage;