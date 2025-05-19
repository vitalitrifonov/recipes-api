import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useState } from "react";

// Komponent, mis kuvab kasutajale tegevused ühe postituse kohta
const PostMenuActions = ({post}) => {
    const { user } = useUser();         // Hetkel sisselogitud kasutaja
    const {getToken} = useAuth();       // Autentimistokeni saamine
    const navigate = useNavigate();     // Navigeerimiseks pärast kustutamist
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Andmete pärimine salvestatud postituste kohta
    const { isPending, error, data:savedPosts } = useQuery({
        queryKey: ["savedPosts"],
        queryFn: async () => {
            const token = await getToken();
            return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
    });

    // Kontroll kas kasutaja on administraator
    const isAdmin = user?.publicMetadata?.role === "admin" || false;
    // Kontroll kas see postitus on salvestatud
    const isSaved = savedPosts?.data?.some((p) => p === post._id) || false;

    const queryClient = useQueryClient();

    // Mutatsioon retsepti salvestamiseks / eemaldamiseks salvestatute hulgast
    const saveMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.patch(
                `${import.meta.env.VITE_API_URL}/users/save`,
                {
                    postId: post._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:["savedPosts"] });
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    // Mutatsioon retsepti kustutamiseks
    const deleteMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            toast.success("Retsept kustutatud");
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    // Mutatsioon retsepti esiletõstmiseks
    const featureMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.patch(
                `${import.meta.env.VITE_API_URL}/posts/feature`,
                {
                    postId: post._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:["post", post.slug] });
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    // Kustutamise kinnitusküsimus
    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate();
        setShowDeleteModal(false);
    };

    const handleFeature = () => {
        featureMutation.mutate();
    };

    const handleSave = () => {
        if (!user) {
            toast.error("Te peate sisse logima, et retsepti salvestada");
        }
        saveMutation.mutate();
    };

    // JSX: tegevuste menüü
    return (
        <div className=''>
            <h1 className="mt-8 mb-4 text-sm font-semibold">Tegevused</h1>
            {/* Kui päring käib */}
            {isPending ? (
                "Loading..."
             ) : error ? (
             <span className="text-xs">Logi sisse, et tegevusi näha</span>
             ) : (
                // Salvesta retsept
                <div className='flex items-center gap-2 py-2 text-sm cursor-pointer' onClick={handleSave}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="20px"
                        height="20px"
                    >
                        <path
                            d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
                            stroke="black"
                            strokeWidth="2"
                            fill={saveMutation.isPending ? isSaved ? "none" : "black": isSaved ? "black" : "none"}
                        />
                    </svg>
                    <span>Salvesta retsept</span>
                    {saveMutation.isPending && <span className="text-xs">(Salvestatakse...)</span>}
                </div>
            )}
            {/* Ainult adminile: tõsta esile */}
            {isAdmin && (
                <div
                className="flex items-center gap-2 py-2 text-sm cursor-pointer"
                onClick={handleFeature}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="20px"
                    height="20px"
                >
                    <path
                    d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
                    stroke="black"
                    strokeWidth="2"
                    fill={
                        featureMutation.isPending
                        ? post.isFeatured
                            ? "none"
                            : "black"
                        : post.isFeatured
                        ? "black"
                        : "none"
                    }
                    />
                </svg>
                <span>Tõsta esile</span>
                {featureMutation.isPending && (
                    <span className="text-xs">(in progress)</span>
                )}
                </div>
            )}
            {/* Ainult postituse autorile või adminile: kustutamine */}
            {user && (post.user.username === user.username || isAdmin) && (
                <div className='flex items-center gap-2 py-2 text-sm cursor-pointer' onClick={handleDelete}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    fill="red"
                    width="20px"
                    height="20px"
                >
                    <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z" />
                </svg>
                <span>Kustuta retsept</span>
                {deleteMutation.isPending && <span className="text-xs">(Kustutakse...)</span>}
            </div>
            )}
            {/* MODAAL kustutamise kinnituseks */}
            {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-xl">
                    <h2 className="text-lg font-semibold mb-4">
                        Kas olete kindel?
                    </h2>
                    <p className="mb-6 text-sm text-gray-600">
                        Soovite kustutada selle retsepti? Seda tegevust ei saa tagasi võtta.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                        >
                            Tühista
                        </button>
                    <button
                        onClick={confirmDelete}
                        className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                        Kustuta
                    </button>
                    </div>
                </div>
            </div>
        )}
    </div>
    )
}

export default PostMenuActions;