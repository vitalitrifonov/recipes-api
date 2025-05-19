// Komponent piltide kuvamiseks ImageKit abil
import IKImage from "./Image";
// Aegade formaatimise teek, nt "5 minutit tagasi"
import { format } from "timeago.js";
// Clerk autenduse konksud kasutaja ja tokeni saamiseks
import { useUser, useAuth } from "@clerk/clerk-react";
// React Query tööriistad andmete muutmiseks ja vahemälu haldamiseks
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Teavituste kuvamiseks
import { toast } from "react-toastify";
// HTTP-päringute tegemiseks
import axios from "axios";

// Kommentaari komponent, mis kuvab üksiku kommentaari
const Comment = ({comment, postId}) => {
    // Saame praeguse kasutaja info
    const { user } = useUser();
    // Funktsioon turvatud API päringu tegemiseks
    const { getToken } = useAuth();
    // Kasutaja roll (nt admin)
    const role = user?.publicMetadata?.role;

    // React Query kliendi instants päringute värskendamiseks
    const queryClient = useQueryClient();

    // Kommentaari kustutamise mutatsioon
    const mutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.delete(
                `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        // Kui kustutamine õnnestub, värskendame kommentaaride andmeid
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast.success("Kommentaar edukalt kustutatud");
        },
        // Kui tekib viga, kuvame veateate
        onError: (error) => {
            toast.error(error.response?.data || "Kommentaari kustutamine ebaõnnestus");
        },
    });

    return (
        <div className='p-4 bg-white rounded-xl mb-4 shadow-md flex items-start gap-4'>
            {/* Kui kasutajal on profiilipilt, siis kuvatakse see */}
            {comment.user.img && <IKImage 
                src={comment.user.img}
                className="w-12 h-12 rounded-full object-cover"
                w="100"
                h="100"
            />}
            {/* Kommentaari sisu */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    {/* Kasutajanimi ja kuupäev (nt "3 tundi tagasi") */}
                    <span className="text-[#cc7e7c] text-sm font-semibold hover:text-black transition-colors">{comment.user.username}</span>
                    <span className="text-sm text-gray-500">{format(comment.createdAt)}</span>
                    {/* Näita kustutamise linki ainult siis, kui kasutaja on autor või admin */}
                    {user && (comment.user.username === user.username || role === "admin") && (
                        <span 
                        className="text-xs text-red-300 hover:text-red-600 cursor-pointer" 
                        on onClick={() => mutation.mutate()}
                    >
                        kustuta
                        {/* Näita laadimise indikaatorit kustutamise ajal */}
                        {mutation.isPending && <span>(kustutatakse...)</span>}
                    </span>
                    )}
                </div>
                {/* Kommentaari tekst */}
                <p className="mt-2 text-sm text-gray-800">
                    {comment.desc}
                </p>
            </div>
        </div>
    )
}

export default Comment;