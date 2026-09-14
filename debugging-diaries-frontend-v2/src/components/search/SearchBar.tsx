import { useEffect, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar = ({
  placeholder = 'Search...',
  className = '',
  autoFocus = false,
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(urlQuery);

  // URL চেঞ্জ হলে ইনপুট ফিল্ড সিঙ্ক করা (ESLint Error Free)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchInput(urlQuery);
    }, 0);
    return () => clearTimeout(timer);
  }, [urlQuery]);

  const executeSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          autoFocus={autoFocus}
          // w-full দেওয়া হয়েছে যাতে প্যারেন্ট div অনুযায়ী জায়গা নেয়
          className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>
      <button
        onClick={executeSearch}
        disabled={!searchInput.trim()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
