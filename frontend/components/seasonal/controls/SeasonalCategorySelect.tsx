"use client";

import { memo, useState, useRef, useEffect, useMemo } from "react";

export interface SeasonalCategorySelectProps {
  selectedGenre?: string;
  selectedFormat?: string;
  onSelectGenre: (genre: string) => void;
  onSelectFormat: (format: string) => void;
  onClearFilter?: () => void;
  availableGenres?: string[];
  availableFormats?: string[];
  hasLoadedData?: boolean;
}

export const SeasonalCategorySelect = memo(function SeasonalCategorySelect({
  selectedGenre,
  selectedFormat,
  onSelectGenre,
  onSelectFormat,
  availableGenres = [],
  availableFormats = [],
  hasLoadedData = false,
}: SeasonalCategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Filtered genres and formats for fast lookup
  const filteredGenres = useMemo(() => {
    if (!searchFilter.trim()) return availableGenres;
    const q = searchFilter.toLowerCase();
    return availableGenres.filter((g) => g.toLowerCase().includes(q));
  }, [availableGenres, searchFilter]);

  const filteredFormats = useMemo(() => {
    if (!searchFilter.trim()) return availableFormats;
    const q = searchFilter.toLowerCase();
    return availableFormats.filter((f) => f.toLowerCase().includes(q));
  }, [availableFormats, searchFilter]);

  const handleGenreClick = (genre: string) => {
    onSelectGenre(genre);
    setIsOpen(false);
  };

  const handleFormatClick = (format: string) => {
    onSelectFormat(format);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center gap-3" ref={dropdownRef}>
      <div className="flex items-center gap-2 font-mono text-label-sm uppercase tracking-widest-sm text-anilytics-purple-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span className="hidden sm:inline">Filter By:</span>
      </div>

      {/* Single 2-Column Dropdown Trigger */}
      <div className="relative">
        <button
          type="button"
          id="seasonal-category-dropdown-trigger"
          disabled={!hasLoadedData}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center justify-between gap-3 min-w-52.5 sm:min-w-65 px-3.5 py-2 rounded-xl border text-body-md font-sans transition-all cursor-pointer ${
            !hasLoadedData
              ? "border-anilytics-line-soft bg-transparent text-anilytics-text-low cursor-not-allowed opacity-50 font-mono text-xs"
              : isOpen
              ? "border-anilytics-purple-400 bg-anilytics-panel-2 text-anilytics-text-hi shadow-lg"
              : "border-anilytics-line bg-anilytics-panel text-anilytics-text-hi hover:border-anilytics-purple-400/60 hover:bg-anilytics-panel-2"
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2 truncate">
            {hasLoadedData ? (
              selectedGenre ? (
                <span className="flex items-center gap-2 truncate">
                  <span className="truncate font-medium text-white">{selectedGenre}</span>
                  <span className="shrink-0 px-1.5 py-0.5 rounded text-2xs font-mono uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Genre
                  </span>
                </span>
              ) : selectedFormat ? (
                <span className="flex items-center gap-2 truncate">
                  <span className="truncate font-medium text-white">{selectedFormat}</span>
                  <span className="shrink-0 px-1.5 py-0.5 rounded text-2xs font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Format
                  </span>
                </span>
              ) : (
                <span className="text-anilytics-text-mid font-normal text-xs">
                  Select Genre or Format...
                </span>
              )
            ) : (
              <span>Pending Data Load</span>
            )}
          </div>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-3.5 h-3.5 text-anilytics-text-low transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180 text-anilytics-purple-300" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* 2-Column Dropdown Popover Panel */}
        {isOpen && hasLoadedData && (
          <div
            className="absolute left-0 top-full mt-2 z-50 w-77.5 sm:w-115 bg-anilytics-panel-2 border border-anilytics-line rounded-card-lg shadow-2xl p-4 space-y-3 backdrop-blur-xl animate-fade-in"
            role="listbox"
          >
            {/* Quick Search Input */}
            {(availableGenres.length > 8 || availableFormats.length > 8) && (
              <div className="relative">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Quick filter genres & formats..."
                  className="w-full bg-anilytics-panel border border-anilytics-line rounded-lg px-3 py-1.5 text-xs text-anilytics-text-hi placeholder-anilytics-text-low focus:outline-none focus:border-anilytics-purple-400 transition-colors font-mono"
                  autoFocus
                />
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-anilytics-text-low hover:text-white text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {/* 2 Column Sections Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-anilytics-line-soft">
              {/* Column 1: Genres (Blue Accent) */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between pb-1.5 border-b border-anilytics-line-soft">
                  <span className="flex items-center gap-1.5 font-mono text-label uppercase tracking-wider text-blue-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Genres
                  </span>
                  <span className="text-2xs font-mono text-anilytics-text-low">
                    {filteredGenres.length}
                  </span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1 text-body-sm overscroll-contain">
                  {filteredGenres.length > 0 ? (
                    filteredGenres.map((genre) => {
                      const isSelected = selectedGenre === genre;
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleGenreClick(genre)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30"
                              : "text-anilytics-text-mid hover:text-white hover:bg-blue-500/10"
                          }`}
                        >
                          <span className="truncate">{genre}</span>
                          {isSelected && (
                            <span className="text-blue-400 text-xs font-bold shrink-0 ml-1">✓</span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-3 text-center text-xs text-anilytics-text-low font-mono">
                      No genres match
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Formats (Green Accent) */}
              <div className="space-y-1.5 sm:pl-3 pt-3 sm:pt-0 min-w-0">
                <div className="flex items-center justify-between pb-1.5 border-b border-anilytics-line-soft">
                  <span className="flex items-center gap-1.5 font-mono text-label uppercase tracking-wider text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Formats
                  </span>
                  <span className="text-2xs font-mono text-anilytics-text-low">
                    {filteredFormats.length}
                  </span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1 text-body-sm overscroll-contain">
                  {filteredFormats.length > 0 ? (
                    filteredFormats.map((format) => {
                      const isSelected = selectedFormat === format;
                      return (
                        <button
                          key={format}
                          type="button"
                          onClick={() => handleFormatClick(format)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30"
                              : "text-anilytics-text-mid hover:text-white hover:bg-emerald-500/10"
                          }`}
                        >
                          <span className="truncate">{format}</span>
                          {isSelected && (
                            <span className="text-emerald-400 text-xs font-bold shrink-0 ml-1">✓</span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-3 text-center text-xs text-anilytics-text-low font-mono">
                      No formats match
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
