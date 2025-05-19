import { useUser, useAuth } from "@clerk/clerk-react"; 
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import IKImage from "../components/Image";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();   // Kasutaja autentimise olek
  const [value, setValue] = useState("");       // ReactQuill sisu
  const [cover, setCover] = useState("");       // Kattepildi andmed
  const [img, setImg] = useState("");           // Üksikpildi andmed, mida lisatakse sisu sisse
  const [progress, setProgress] = useState(0);  // Pildi üleslaadimise progress

  // Kui img muutub, lisame selle automaatselt sisu lõppu
  useEffect(() => {
    img && setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  }, [img]);

  const navigate = useNavigate();

  const {getToken} = useAuth(); // Funktsioon JWT tokeni saamiseks

  // Postituse loomise mutatsioon React Query abil
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken(); // Hangi token autentimiseks
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`, // Lisa token headerisse
        },
      });
    },
    // Kui postitus edukalt loodud, suunatakse kasutaja tehtud postitusele
    onSuccess: (res) => {
      toast.success("Retsept on loodud!");
      navigate(`/${res.data.slug}`);
    },
  });

  // Kui kasutaja andmed pole veel laetud
  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  // Kui kasutaja ei ole sisse loginud
  if (isLoaded && !isSignedIn) {
    return <div className="max-w-screen-2xl mx-auto flex flex-col gap-8 mt-8">Te peate sisse logima!</div>;
  }

  // Vormisisu saatmise funktsioon
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    
    // Koostame postituse objekti
    const data = {
      img: cover.filePath || "",
      title: formData.get('title'),
      desc: formData.get('desc'),
      category: formData.get('category'),
      content: value,
    };

    console.log(data);

    // Käivitame mutatsiooni
    mutation.mutate(data);

  }

  return (
    <div className="w-full px-4">
      <div className="max-w-screen-2xl mx-auto h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
        {/* Pealkiri */}
        <h1 className="text-[#9e663c] text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold mt-4">Lisa uus retsept</h1>
        {/* Vorm uue retsepti lisamiseks */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
          {/* Kattepildi üleslaadimine */}
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <button
              type="button"
              className="w-max p-2 px-4 py-2 shadow-md rounded-xl text-sm text-gray-500 bg-white"
            >
              Lisa pilt
            </button>
          </Upload>
          {/* Kattepildi eelvaade */}
          {cover && (cover.url || cover.filePath) && (
            <div className="mt-2 max-w-xs">
              <img
                src={cover.url || cover.filePath}
                alt="Cover preview"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          {/* Retsepti pealkiri */}
          <input className="w-max text-2xl rounded-xl px-4 py-2 font-semibold bg-white outline-none" 
          type="text" 
          placeholder="Retsepti pealkiri..."
          name="title"
          />
          {/* Kategooria valik */}
          <div className="flex items-center gap-4">
            <label htmlFor="" className="text-sm">Vali kategooria:</label>
            <select 
              name="category"
              id=""
              className="p-2 rounded-xl bg-white shadow-md"
            >
              <option value="homemade">Kodused Toidud</option>
              <option value="desserts">Magustoidud</option>
              <option value="vegan">Taimetoidud</option>
              <option value="soups">Supid</option>
              <option value="salads">Salatid</option>
            </select>
          </div>
          {/* Retsepti kirjeldus */}
          <textarea name="desc" className="px-4 p-2 rounded-xl bg-white shadow-md" placeholder="Retsepti lühikirjeldus..." />
          {/* Sisupõhi koos pildi lisamise ja ReactQuill'iga */}
          <div className="flex flex-1 ">
            <div className="flex flex-col gap-2 mr-2">
              <Upload type="image" setProgress={setProgress} setData={setImg}>
                <IKImage src="image.png" alt='Lisa pilt' w={30} h={30}/>
              </Upload>
            </div>
            <ReactQuill 
              theme="snow" 
              className="flex-1 rounded-xl bg-white shadow-md"
              value={value}
              onChange={setValue}
              readOnly={0 > progress && progress < 100}
            />
          </div>
          {/* Saada nupuke */}
          <button 
            disabled={mutation.isPending || (0 > progress && progress < 100) }
            className='bg-[#cc7e7c] w-max px-4 py-3 text-white font-medium rounded-xl whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {mutation.isPending ? "Loading..." : "Saada"}
          </button>
          {/* Üleslaadimise progress ja veateade */}
          {"Pilt laetud: " + progress + "%"}
          {mutation.isError && <span>{mutation.error.message}</span>}
        </form>
      </div>
    </div>
  );
};

export default Write;