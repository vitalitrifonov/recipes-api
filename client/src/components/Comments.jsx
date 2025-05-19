import axios from "axios"; 
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
// Reacti hook lokaalse oleku jaoks
import { useState } from "react";

// Funktsioon kommentaaride toomiseks kindla postituse kohta
const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return res.data;
};

// Kommentaaride komponent (kõik kommentaarid ja uue lisamine)
const Comments = ({ postId }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    // Kommentaar, mida ajutiselt näitame enne serveri vastust
    const [pendingComment, setPendingComment] = useState(null);

    // Kommentaaride andmete toomine React Query abil
    const { isPending, error, data = [] } = useQuery({
        queryKey: ["comments", postId], // võtmesõna cache jaoks
        queryFn: () => fetchComments(postId), // päringu funktsioon
    });

    // React Query kliendi kasutamine vahemälu värskendamiseks
    const queryClient = useQueryClient();

    // Kommentaari saatmise mutatsioon
    const mutation = useMutation({
        mutationFn: async (newComment) => {
            const token = await getToken();
            return axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${postId}`,
                newComment,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        // Kui kommentaar on "mutatsioonis", näitame seda ajutiselt
        onMutate: async (newComment) => {
            setPendingComment({
                desc: newComment.desc + " (laadimine...)", // lisame visuaalse laadimise indikaatori
                createdAt: new Date(),
                user: {
                    username: user.username,
                    img: user.imageUrl,
                },
            });
        },
        // Kui saatmine õnnestub, eemaldame ajutise kommentaari ja värskendame andmeid
        onSuccess: () => {
            setPendingComment(null);
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        // Kui tekib viga, näitame veateadet ja eemaldame ajutise kommentaari
        onError: (error) => {
            toast.error(error.response?.data || "Kommentaari saatmine ebaõnnestus");
            setPendingComment(null);
        },
    });

    // Vormiga kommenteerimise funktsioon
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const desc = formData.get("desc");
        if (!desc.trim()) return; // väldime tühje kommentaare
        mutation.mutate({ desc }); // käivitame kommentaari saatmise
        e.target.reset(); // puhastame vormi
    };

    return (
        <div className="flex flex-col gap-6 lg:w-3/5">
            <h1 className="text-xl font-semibold">Kommentaarid</h1>
            {/* Kommentaari sisestusvorm */}
            <div className="flex item-center justify-between gap-8 w-full">
                <form onSubmit={handleSubmit} className="flex items-center gap-4 w-full">
                    <div className="flex-1">
                        <textarea
                            name="desc"
                            className="w-full p-4 rounded-xl shadow-md"
                            placeholder="Lisa oma kommentaar"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#cc7e7c] px-4 py-3 text-white font-medium rounded-xl whitespace-nowrap"
                    >
                        Saada
                    </button>
                </form>
            </div>
            {/* Laadimise indikaator ja veateade */}
            {isPending && <p>Laadime kommentaare...</p>}
            {error && <p>Viga kommentaaride laadimisel!</p>}

            {/* Ajutine kommentaar laadimise ajal */}
            {pendingComment && <Comment comment={pendingComment} />}

            {/* Püsivad kommentaarid andmebaasist */}
            {data.map((comment) => (
                <Comment key={comment._id} comment={comment} postId={postId} />
            ))}
        </div>
    );
};

export default Comments;