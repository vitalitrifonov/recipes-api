import { Link } from "react-router";
// Otsingu komponent
import Search from "./Search";

// Peakategooriate navigatsioonikomponent
const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
      {/* links */}
      {/* Kategooriate lingid – paigutatud ühtlase vahega rea peale */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        {/* Link kõigile postitustele */}
        <Link
          to="/posts"
          className="rounded-full bg-[#cc7e7c] text-black shadow-md px-6 py-2 transition-colors duration-300 hover:bg-black hover:text-white"
        >
          Kõik retseptid
        </Link>
        {/* Teised kategooriate lingid */}
        <Link
          to="/posts?cat=homemade"
          className="hover:bg-[#edd9d7] rounded-full px-4 py-2"
        >
          Kodused toidud
        </Link>
        <Link
          to="/posts?cat=desserts"
          className="hover:bg-[#edd9d7] rounded-full px-4 py-2"
        >
          Magustoidud
        </Link>
        <Link
          to="/posts?cat=vegan"
          className="hover:bg-[#edd9d7] rounded-full px-4 py-2"
        >
          Taimetoidud
        </Link>
        <Link
          to="/posts?cat=soups"
          className="hover:bg-[#edd9d7] rounded-full px-4 py-2"
        >
          Supid
        </Link>
        <Link
          to="/posts?cat=salads"
          className="hover:bg-[#edd9d7] rounded-full px-4 py-2"
        >
          Salatid
        </Link>
      </div>
      {/* Vertikaalne eraldaja visuaalseks jaotamiseks */}
      <span className="text-xl font-medium">|</span>
      {/* Otsingukast – eraldi komponendina */}
      <Search />
    </div>
  );
};

export default MainCategories;