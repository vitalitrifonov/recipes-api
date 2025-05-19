import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import PostListItem from "./PostListItem";

const SavedPostList = () => {
  // Clerk'i hook tokeni saamiseks
  const { getToken } = useAuth();

  // Kasutame React Query'd, et pärida kasutaja salvestatud postitused täieliku info (full)
  const { data, isLoading, error } = useQuery({
    queryKey: ["savedPostsFull"], // unikaalne võtmestring React Query's
    queryFn: async () => {
      const token = await getToken(); // võtame autentimistokeni
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved/full`, {
        headers: { Authorization: `Bearer ${token}` },  // lisame tokeni päisesse
      });
      return res.data; // tagastame serverist saadud andmed
    },
  });

  // Laadimise ja veateated
  if (isLoading) return <p className="max-w-screen-2xl mx-auto flex flex-col gap-8 mt-8">Laadimine...</p>;
  if (error) return <p className="max-w-screen-2xl mx-auto flex flex-col gap-8 mt-8 text-red-500">Midagi läks valesti!</p>;
  if (!data || data.length === 0) return <p className="max-w-screen-2xl mx-auto flex flex-col gap-8 mt-8">Teil ei ole veel salvestatud retsepte.</p>;

  // Kui andmed olemas, kuvatakse salvestatud retseptide nimekiri
  return (
    <div className="w-full px-4 py-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-8">
        <h1 className="text-[#9e663c] text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold mb-4 mt-4">Minu salvestatud retseptid</h1>
        {data.map((post) => (
            <PostListItem key={post._id} post={post} />
        ))}
        </div>
    </div>
  );
};

export default SavedPostList;