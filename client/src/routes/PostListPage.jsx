import { useState } from "react";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";

const PostListPage = () => {
  // Seisundi hoidmine, mis määrab, kas filtrite menüü on avatud mobiilvaates
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Pealkiri retseptide lehel */}
        <h1 className="text-[#9e663c] text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold mb-4 mt-4">
          Retseptid
        </h1>

        {/* Nupp, mis mobiilivaates avab või sulgeb filtrite ja otsingu menüü */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="bg-[#cc7e7c] px-4 py-2 text-white font-medium rounded-xl whitespace-nowrap mb-4 mt-4 md:hidden"
        >
          {open ? "Kinni" : "Filtreeri või otsi"}
        </button>

        <div className="flex flex-col-reverse gap-8 md:flex-row justify-between">
          <div className="min-h-screen">
            <PostList />
          </div>
          {/* Külgriba menüü, mis on mobiilivaates nähtav ainult kui 'open' on tõene, suurel ekraanil alati nähtav */}
          <div className={`${open ? "block" : "hidden"} md:block`}>
            <SideMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListPage;