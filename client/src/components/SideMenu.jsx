import { useSearchParams } from "react-router";
import Search from "./Search";
import { Link } from "react-router";

const SideMenu = () => {
    // loeb ja muudab URL-i päringuparameetreid
    const [searchParams, setSearchParams] = useSearchParams();

    // funktsioon sortimise valiku muutmiseks
    const handleFilterChange = (e) => {
        // uuendab ainult siis, kui uus väärtus erineb praegusest
        if (searchParams.get("sort") !== e.target.value) {
            setSearchParams({
                // säilitab olemasolevad parameetrid ja lisab/uuendab "sort"
                ...Object.fromEntries(searchParams.entries()),
                sort: e.target.value,
            });
        }
    };
    // funktsioon kategooria muutmiseks
    const handleCategoryChange = (category) => {
        // uuendab ainult kui valitud kategooria erineb praegusest
        if (searchParams.get("cat") !== category) {
        setSearchParams({
            // säilitab olemasolevad parameetrid ja lisab/uuendab "cat"
            ...Object.fromEntries(searchParams.entries()),
            cat:category,
        });
        }
    };

    return (
        // külgmise menüü konteiner koos sticky positsiooniga
        <div className="px-4 h-max sticky top-8">
            {/* Otsingu pealkiri */}
            <h1 className="mb-4 text-sm font-semibold">Otsing</h1>
            {/* Otsingukomponent */}
            <Search />
            {/* Filtrite pealkiri */}
            <h1 className="mt-8 mb-4 text-sm font-semibold">Filtrid</h1>
            <div className="flex flex-col gap-2 text-sm">
                {/* Sortimise valikud radio nuppudena */}
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input 
                    type="radio" 
                    name="sort" 
                    onChange={handleFilterChange}
                    value="newest"
                    className="appearance-none w-4 h-4 border-[1.5px] border-[#9e663c] cursor-pointer rounded-sm bg-white checked:bg-[#9e663c]"
                    />
                    Uuemad
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input 
                    type="radio" 
                    name="sort" 
                    onChange={handleFilterChange}
                    value="popular"
                    className="appearance-none w-4 h-4 border-[1.5px] border-[#9e663c] cursor-pointer rounded-sm bg-white checked:bg-[#9e663c]"
                    />
                    Kõige populaarsemad
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input 
                    type="radio" 
                    name="sort" 
                    onChange={handleFilterChange}
                    value="trending"
                    className="appearance-none w-4 h-4 border-[1.5px] border-[#9e663c] cursor-pointer rounded-sm bg-white checked:bg-[#9e663c]"
                    />
                    Trendid
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input 
                    type="radio" 
                    name="sort" 
                    onChange={handleFilterChange}
                    value="oldest"
                    className="appearance-none w-4 h-4 border-[1.5px] border-[#9e663c] cursor-pointer rounded-sm bg-white checked:bg-[#9e663c]"
                    />
                    Vanemad
                </label>
            </div>
            {/* Kategooriate pealkiri */}
            <h1 className="mt-8 mb-4 text-sm font-semibold">Kategooriad</h1>
            <div className="flex flex-col gap-2 text-sm">
                {/* Link ja nupud kategooriate filtreerimiseks */}
                <Link to="/posts" className="hover:text-[#cc7e7c] cursor-pointer">
                Kõik retseptid
                </Link>
                <span
                className="hover:text-[#cc7e7c] cursor-pointer"
                onClick={() => handleCategoryChange("homemade")}
                >
                Kodused toidud
                </span>
                <span
                className="hover:text-[#cc7e7c] cursor-pointer"
                onClick={() => handleCategoryChange("desserts")}
                >
                Magustoidud
                </span>
                <span
                className="hover:text-[#cc7e7c] cursor-pointer"
                onClick={() => handleCategoryChange("vegan")}
                >
                Taimetoidud
                </span>
                <span
                to="/posts?cat=soups"
                className="hover:text-[#cc7e7c] cursor-pointer"
                onClick={() => handleCategoryChange("soups")}
                >
                Supid
                </span>
                <span
                className="hover:text-[#cc7e7c] cursor-pointer"
                onClick={() => handleCategoryChange("salads")}
                >
                Salatid
                </span>
            </div>
        </div>
    )
}

export default SideMenu;