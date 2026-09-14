import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/api/categoryTypes';
import { LuHash, LuLoaderCircle } from 'react-icons/lu';

interface TrendingSidebarProps {
  categories: Category[];
  loading: boolean;
}

const SKELETON_WIDTHS = [65, 45, 75, 50, 60, 80, 55, 70];

const TrendingSidebar = ({ categories, loading }: TrendingSidebarProps) => {
  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm sticky top-20">
        <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
          <LuHash className="w-5 h-5 text-primary" />
          Top Trending
          {loading && (
            <LuLoaderCircle className="w-4 h-4 animate-spin text-muted-foreground ml-auto" />
          )}
        </h3>

        {loading ? (
          <div className="flex flex-wrap gap-2">
            {SKELETON_WIDTHS.map((width, index) => (
              <div
                key={index}
                className="h-6 bg-muted animate-pulse rounded-full"
                style={{ width: `${width}px` }}
              />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                onClick={() =>
                  window.open(
                    `/search?search=${encodeURIComponent(cat.name)}`,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                className="cursor-pointer font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200 px-3 py-1"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed border-border">
            <p className="text-xs text-muted-foreground">
              No trending topics yet.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default TrendingSidebar;
