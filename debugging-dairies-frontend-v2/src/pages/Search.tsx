import SearchBar from '@/components/search/SearchBar'; // ← ইমপোর্ট করা হলো
import StoryCard from '@/components/story/StoryCard';
import { useSearch } from '@/hooks/search/useSearch';
import { LuLoaderCircle, LuSearch, LuUser } from 'react-icons/lu';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('search') || '';
  const { users, stories, loading } = useSearch(query);

  const handleEdit = (id: number) => navigate(`/story/edit/${id}`);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* ─── Search Bar (Visible on mobile & desktop) ─── */}
      <SearchBar
        autoFocus
        placeholder="Find stories, topics, and authors..."
        className="w-full" // পেজের ফুল উইডথ নেবে
      />

      {/* ─── Empty State ─── */}
      {!query && (
        <div className="text-center py-20 space-y-4">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
            <LuSearch className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            What are you looking for?
          </h2>
          <p className="text-sm text-muted-foreground">
            Type a keyword above to find stories and users.
          </p>
        </div>
      )}

      {/* ─── Results Content ─── */}
      {query && (
        <>
          <div className="space-y-1 border-b border-border pb-4">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Results for: <span className="text-primary">"{query}"</span>
              {loading && (
                <LuLoaderCircle className="w-5 h-5 animate-spin text-muted-foreground" />
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              Found {users.length} users and {stories.length} stories
            </p>
          </div>

          {loading ? (
            <div className="space-y-8">
              <div className="flex gap-4">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-16 w-48 bg-muted animate-pulse rounded-xl shrink-0"
                  />
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-40 w-full bg-muted animate-pulse rounded-xl"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Users Section */}
              {users.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground">People</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => navigate(`/profile/${user.username}`)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <LuUser className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold text-foreground truncate">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Stories Section */}
              {stories.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground">Stories</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {stories.map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* No Results Found */}
              {!loading && users.length === 0 && stories.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
                  <p className="text-muted-foreground">
                    We couldn't find anything matching "{query}"
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
