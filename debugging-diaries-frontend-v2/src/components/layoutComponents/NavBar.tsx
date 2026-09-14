import SearchBar from '@/components/search/SearchBar'; // ← নতুন কম্পোনেন্ট ইমপোর্ট
import { useSignOut } from '@/hooks/auth/useSignOut';
import { getUserPayload } from '@/utils/localStorageUtils';
import dp from '@public/assets/images/logo.png';
import { useState } from 'react';
import {
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineUserCircle,
} from 'react-icons/hi';
import { LuLoaderCircle, LuLogOut } from 'react-icons/lu';
import { Link, NavLink } from 'react-router-dom';

const NavBar = () => {
  const [username] = useState(() => {
    const payload = getUserPayload();
    return payload?.username || '';
  });

  const { handleSignOut, loading: isLoggingOut } = useSignOut();

  const navLinkStyle =
    'flex flex-col items-center justify-center p-2 rounded-md transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground';

  return (
    <>
      {/* TOP NAV: Desktop & Tablet */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="w-full max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Left Section: Logo & Primary Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/home"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <img src={dp} className="w-8 h-8 object-contain" alt="Logo" />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <NavLink title="Home" to="/home" className={navLinkStyle}>
                <HiOutlineHome size={22} />
              </NavLink>

              {/* ─── Reusable Search Bar ─── */}
              <div className="ml-2">
                <SearchBar
                  placeholder="Search stories & users..."
                  className="w-72" // ডেস্কটপে নির্দিষ্ট উইডথ
                />
              </div>
            </div>
          </div>

          {/* Right Section: Desktop Profile & Actions */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              title="Profile"
              to={`/profile/${username}`}
              className={navLinkStyle}
            >
              <HiOutlineUserCircle size={22} />
            </NavLink>

            <NavLink title="Settings" to="/settings" className={navLinkStyle}>
              <HiOutlineCog size={22} />
            </NavLink>

            <div className="mx-2 h-6 w-px bg-border" />

            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex items-center justify-center p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              {isLoggingOut ? (
                <LuLoaderCircle size={22} className="animate-spin" />
              ) : (
                <LuLogOut size={22} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* BOTTOM NAV: Mobile Only */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <NavLink to="/home" className={navLinkStyle}>
            <HiOutlineHome size={24} />
          </NavLink>
          <NavLink to="/search" className={navLinkStyle}>
            <HiOutlineSearch size={24} />
          </NavLink>
          <NavLink to={`/profile/${username}`} className={navLinkStyle}>
            <HiOutlineUserCircle size={24} />
          </NavLink>
          <NavLink to="/settings" className={navLinkStyle}>
            <HiOutlineCog size={24} />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default NavBar;
