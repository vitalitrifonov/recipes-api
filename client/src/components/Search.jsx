import { useLocation, useNavigate, useSearchParams } from "react-router";

const Search = () => {
  // praeguse URL ja rada saamiseks
  const location = useLocation();
  // navigatsiooni funktsioon lehevahetuseks
  const navigate = useNavigate();
  // otsingupäringu parameetrite lugemiseks ja muutmiseks
  const [searchParams, setSearchParams] = useSearchParams();

  // funktsioon, mis käivitub klahvivajutusel sisendväljal
  const handleKeyPress = (e) => {
    // kui vajutati Enter-klahvi
    if (e.key === "Enter") {
      // loeme sisestatud otsingusõna
      const query = e.target.value;
      // kui oleme juba /posts lehel
      if (location.pathname === "/posts") {
        // uuendame URL otsingupäringu parameetrit (säilitades teised parameetrid)
        setSearchParams({ ...Object.fromEntries(searchParams), search: query });
      } else {
        // muul juhul suuname kasutaja /posts lehele koos otsingupäringuga
        navigate(`/posts?search=${query}`);
      }
    }
  };

  return (
    <div className="bg-[#e5c3bc] p-2 rounded-full shadow-md flex items-center gap-2">
      {/* Otsinguikoon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      {/* Tekstisisend otsingu jaoks */}
      <input
        type="text"
        placeholder="Otsi retsepte..."
        className="bg-transparent"
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Search;