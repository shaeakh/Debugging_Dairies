import categoryApi from '@/apis/category/categoryApi';
import type { Category } from '@/types/api/categoryTypes';
import type { StoryCreate } from '@/types/api/storyTypes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuLoaderCircle, LuX } from 'react-icons/lu';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_TAGS = 5;
const MAX_BODY_CHARS = 5000; // ← নতুন ক্যারেক্টার লিমিট কনস্ট্যান্ট
const DEBOUNCE_MS = 300;

// ─── Types ────────────────────────────────────────────────────────────────────
export type StoryFormValues = {
  title: string;
  body: string;
  categories: Category[];
};

type StoryFormProps = {
  initialValues?: StoryFormValues;
  allCategories: Category[];
  categoriesLoading: boolean;
  submitLoading: boolean;
  onSubmit: (data: StoryCreate) => void;
  onCancel: () => void;
  onCategoryCreated: () => Promise<void>;
  mode: 'create' | 'update';
};

const DEFAULT_VALUES: StoryFormValues = {
  title: '',
  body: '',
  categories: [],
};

// ─── Component ────────────────────────────────────────────────────────────────
const StoryForm = ({
  initialValues = DEFAULT_VALUES,
  allCategories,
  categoriesLoading,
  submitLoading,
  onSubmit,
  onCancel,
  onCategoryCreated,
  mode,
}: StoryFormProps) => {
  const [title, setTitle] = useState(initialValues.title);
  const [body, setBody] = useState(initialValues.body);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialValues.categories
  );

  const [tagInput, setTagInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce tag input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedInput(tagInput.trim().toLowerCase());
    }, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [tagInput]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = debouncedInput
    ? allCategories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(debouncedInput) &&
          !selectedCategories.some((s) => s.id === cat.id)
      )
    : [];

  const isNewTag =
    debouncedInput.length > 0 &&
    !allCategories.some((cat) => cat.name.toLowerCase() === debouncedInput) &&
    !selectedCategories.some(
      (cat) => cat.name.toLowerCase() === debouncedInput
    );

  const isAtMax = selectedCategories.length >= MAX_TAGS;

  const addTag = useCallback(
    (cat: Category) => {
      if (isAtMax) return;
      setSelectedCategories((prev) => [...prev, cat]);
      setTagInput('');
      setDebouncedInput('');
      setIsDropdownOpen(false);
      inputRef.current?.focus();
    },
    [isAtMax]
  );

  const createAndAddTag = useCallback(async () => {
    if (!debouncedInput || isAtMax || isCreatingTag) return;
    setIsCreatingTag(true);
    try {
      const newCat = await categoryApi.create(debouncedInput);
      await onCategoryCreated();
      setSelectedCategories((prev) => [...prev, newCat]);
      setTagInput('');
      setDebouncedInput('');
      setIsDropdownOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingTag(false);
      inputRef.current?.focus();
    }
  }, [debouncedInput, isAtMax, isCreatingTag, onCategoryCreated]);

  const removeTag = (id: number) => {
    setSelectedCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && !isNewTag) {
        addTag(suggestions[0]);
      } else if (isNewTag) {
        createAndAddTag();
      }
    }
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
    if (
      e.key === 'Backspace' &&
      tagInput === '' &&
      selectedCategories.length > 0
    ) {
      removeTag(selectedCategories[selectedCategories.length - 1].id);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !body.trim() || body.length > MAX_BODY_CHARS) return;
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      categories: selectedCategories,
    });
  };

  // ৫০০০ ক্যারেক্টারের বেশি হলে ফর্ম সাবমিট ইনভ্যালিড হবে
  const isValid =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    body.length <= MAX_BODY_CHARS;
  const isOverLimit = body.length > MAX_BODY_CHARS;

  return (
    <div className="space-y-3.5">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground tracking-wide">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a compelling title..."
          className="w-full px-3.5 py-2 rounded-lg border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        />
      </div>

      {/* Body / Description */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground tracking-wide">
          Story <span className="text-destructive">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your story here..."
          // rows={7} থেকে কমিয়ে rows={5} করা হয়েছে সাইজ আরও ছোট করার জন্য
          rows={5}
          // md:min-h-[160px] থেকে কমিয়ে md:min-h-[120px] করা হয়েছে যাতে ভার্টিক্যালি ওভারফ্লো না হয়
          className={`w-full px-3.5 py-2 rounded-lg border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition resize-none leading-relaxed md:min-h-30 ${
            isOverLimit
              ? 'border-destructive focus:ring-destructive/40'
              : 'border-border focus:ring-primary/40'
          }`}
        />
        {/* ক্যারেক্টার কাউন্টার: ছোট সাইজ এবং ৫০০০ লিমিট শো করা হয়েছে */}
        <p
          className={`text-[10px] text-right leading-none font-medium ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
        >
          {body.length} / {MAX_BODY_CHARS} characters
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground tracking-wide">
            Categories
          </label>
          <span
            className={`text-[10px] font-medium ${isAtMax ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {selectedCategories.length}/{MAX_TAGS}
          </span>
        </div>

        {/* Tag input box */}
        <div
          className={`flex flex-wrap gap-1.5 px-2.5 py-1.5 rounded-lg border bg-input transition cursor-text min-h-9.5 items-center ${
            isDropdownOpen
              ? 'border-primary ring-2 ring-primary/40'
              : 'border-border'
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {selectedCategories.map((cat) => (
            <span
              key={cat.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-medium shrink-0"
            >
              {cat.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(cat.id);
                }}
                className="hover:opacity-70 transition"
                aria-label={`Remove ${cat.name}`}
              >
                <LuX className="w-3 h-3" />
              </button>
            </span>
          ))}

          {!isAtMax && (
            <input
              ref={inputRef}
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (tagInput) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedCategories.length === 0
                  ? 'Search or create tags...'
                  : ''
              }
              disabled={categoriesLoading}
              className="flex-1 min-w-30 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none py-0.5"
            />
          )}

          {isCreatingTag && (
            <LuLoaderCircle className="w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" />
          )}
        </div>

        {/* Dropdown Options List */}
        {isDropdownOpen && tagInput && (
          <div
            ref={dropdownRef}
            className="absolute z-30 max-w-xl w-[calc(100%-2rem)] md:w-auto md:min-w-75 rounded-lg border border-border bg-popover shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            {suggestions.length > 0 && (
              <ul className="max-h-35 overflow-y-auto scrollbar-thin">
                {suggestions.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addTag(cat)}
                      className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-accent transition flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {isNewTag && (
              <>
                {suggestions.length > 0 && (
                  <div className="border-t border-border" />
                )}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={createAndAddTag}
                  disabled={isCreatingTag}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-accent transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isCreatingTag ? (
                    <LuLoaderCircle className="w-3 h-3 animate-spin shrink-0 text-primary" />
                  ) : (
                    <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-primary text-primary-foreground shrink-0 uppercase tracking-wider">
                      new
                    </span>
                  )}
                  <span className="text-foreground truncate">
                    Create{' '}
                    <span className="font-semibold text-primary">
                      "{debouncedInput}"
                    </span>
                  </span>
                </button>
              </>
            )}

            {suggestions.length === 0 && !isNewTag && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No matching tags found.
              </p>
            )}
          </div>
        )}

        {/* Tips Footer */}
        <p className="text-[10px] text-muted-foreground leading-none pt-0.5">
          Press{' '}
          <kbd className="px-1 py-0.5 rounded border border-border bg-muted font-mono text-[9px]">
            Enter
          </kbd>{' '}
          to add ·{' '}
          <kbd className="px-1 py-0.5 rounded border border-border bg-muted font-mono text-[9px]">
            Backspace
          </kbd>{' '}
          to remove last
        </p>
      </div>

      {/* Actions Section */}
      <div className="flex justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitLoading}
          className="px-4 py-1.5 rounded-lg border border-border text-foreground text-xs font-medium hover:bg-muted transition disabled:opacity-50 min-w-20"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || submitLoading}
          className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-27.5"
        >
          {submitLoading && (
            <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" />
          )}
          {mode === 'create' ? 'Publish' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default StoryForm;
