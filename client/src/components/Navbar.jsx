import { useState } from 'react';
import IKImage from "./Image";
import { Link } from 'react-router';
// Clerk autentimiskomponendid
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

// Navigatsiooniriba komponent
const Navbar = () => {
  const [open, setOpen] = useState(false); // Mobiilimenüü nähtavuse seisund

  return (
    <div className='w-full h-16 md:h-20 px-4'>
      <div className='max-w-screen-2xl h-full mx-auto flex items-center justify-between'>
        {/* Logo ja nimi vasakul */}
        <Link to='/' className='flex items-center gap-3 mr-dafoe-regular text-4xl h-full'>
          <IKImage src="logo.png" alt='Retseptik Logo' w={50} h={50} />
          <span>Retseptik</span>
        </Link>

        {/* Mobiilimenüü nupp ja sisu */}
        <div className='md:hidden'>
          {/* Hamburger-menüü nupp */}
          <button
            className={`tham tham-e-spin tham-w-6 ${open ? 'tham-active' : ''}`}
            type="button"
            onClick={() => setOpen(!open)}
          >
            <div className="tham-box">
              <div className="tham-inner" />
            </div>
          </button>
          {/* Mobiilne menüü sisu */}
          <div className={`w-full h-screen flex flex-col items-center justify-start pt-40 gap-6 font-medium text-lg absolute top-16 bg-[#f5f3f2] transition-all ease-in-out duration-300 ${open ? 'right-0' : '-right-full'}`}>
            <Link className='bg-[#edd9d7] rounded-full px-4 py-2' to='/'>Pealeht</Link>
            <Link className='bg-[#edd9d7] rounded-full px-4 py-2' to="/posts?sort=trending">Trendid</Link>
            <Link className='bg-[#edd9d7] rounded-full px-4 py-2' to="/posts?sort=popular">Populaarne</Link>
            <Link className='bg-[#edd9d7] rounded-full px-4 py-2' to='/'>Meist</Link>
            {/* Näita salvestatud retseptide linki ainult sisseloginud kasutajale */}
            <SignedIn>
              <Link className='hover:bg-[#edd9d7] rounded-full px-4 py-2' to='/saved'>
                Minu salvestatud retseptid
              </Link>
            </SignedIn>
            {/* Näita sisselogimise nuppu välja logitud kasutajatele */}
            <SignedOut>
              <Link to='/login'>
                <button
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  Login
                </button>
              </Link>
            </SignedOut>
            {/* Kasutaja avatar ja menüü (Clerk) */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Desktop menüü */}
        <div className='hidden md:flex items-center gap-8 xl:gap-12 font-medium'>
          <Link className='hover:bg-[#edd9d7] rounded-full px-4 py-2' to='/'>Pealeht</Link>
          <Link className='hover:bg-[#edd9d7] rounded-full px-4 py-2' to="/posts?sort=trending">Trendid</Link>
          <Link className='hover:bg-[#edd9d7] rounded-full px-4 py-2' to="/posts?sort=popular">Populaarne</Link>
          <Link className='hover:bg-[#edd9d7] rounded-full px-4 py-2' to='/'>Meist</Link>
          {/* Ainult sisseloginutele nähtav link */}
          <SignedIn>
            <Link className='hover:bg-[#edd9d7] rounded-full px-4 py-2' to='/saved'>
              Minu salvestatud retseptid
            </Link>
          </SignedIn>
          {/* Ainult välja loginutele nähtav nupp */}
          <SignedOut>
            <Link to='/login'>
              <button
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Login
              </button>
            </Link>
          </SignedOut>
          {/* Kasutaja ikoon, kui sisse logitud */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;