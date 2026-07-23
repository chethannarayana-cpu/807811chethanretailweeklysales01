import React from 'react';
import { Filter, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';
import { FilterState } from '../types/retail';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableWeeks: string[];
  availableRegions: string[];
  availableCities: string[];
  availableFormats: string[];
  availableCategories: string[];
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableWeeks,
  availableRegions,
  availableCities,
  availableFormats,
  availableCategories,
  onReset,
}) => {
  const activeCount =
    filters.weeks.length +
    filters.regions.length +
    filters.cities.length +
    filters.formats.length +
    filters.categories.length +
    (filters.searchQuery ? 1 : 0);

  const toggleArrayItem = (key: keyof FilterState, val: string) => {
    const currentList = (filters[key] as string[]) || [];
    const exists = currentList.includes(val);
    const updated = exists ? currentList.filter((item) => item !== val) : [...currentList, val];
    onFilterChange({ ...filters, [key]: updated });
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 relative z-30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Title */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/30">
            <Filter className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Dashboard Filters
          </span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
              {activeCount} Active
            </span>
          )}
        </div>

        {/* Search input & Reset button */}
        <div className="flex items-center space-x-2 flex-1 max-w-xs ml-auto">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              placeholder="Search store, city, or product..."
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700 transition"
              title="Reset All Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdown Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
        {/* 1. Week */}
        <DropdownFilter
          label="Week"
          selected={filters.weeks}
          options={availableWeeks}
          onToggle={(val) => toggleArrayItem('weeks', val)}
          onClear={() => onFilterChange({ ...filters, weeks: [] })}
        />

        {/* 2. Region */}
        <DropdownFilter
          label="Region"
          selected={filters.regions}
          options={availableRegions}
          onToggle={(val) => toggleArrayItem('regions', val)}
          onClear={() => onFilterChange({ ...filters, regions: [] })}
        />

        {/* 3. City */}
        <DropdownFilter
          label="Store City"
          selected={filters.cities}
          options={availableCities}
          onToggle={(val) => toggleArrayItem('cities', val)}
          onClear={() => onFilterChange({ ...filters, cities: [] })}
        />

        {/* 4. Format */}
        <DropdownFilter
          label="Store Format"
          selected={filters.formats}
          options={availableFormats}
          onToggle={(val) => toggleArrayItem('formats', val)}
          onClear={() => onFilterChange({ ...filters, formats: [] })}
        />

        {/* 5. Category */}
        <DropdownFilter
          label="Product Category"
          selected={filters.categories}
          options={availableCategories}
          onToggle={(val) => toggleArrayItem('categories', val)}
          onClear={() => onFilterChange({ ...filters, categories: [] })}
        />
      </div>
    </div>
  );
};

interface DropdownFilterProps {
  label: string;
  selected: string[];
  options: string[];
  onToggle: (option: string) => void;
  onClear: () => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  selected,
  options,
  onToggle,
  onClear,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-50' : 'z-10'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
          selected.length > 0
            ? 'bg-blue-950/80 border-blue-600/80 text-blue-200'
            : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
        }`}
      >
        <span className="truncate">
          {selected.length === 0
            ? `All ${label}s`
            : selected.length === 1
            ? selected[0]
            : `${label}: ${selected.length}`}
        </span>
        <ChevronDown className="w-3.5 h-3.5 ml-1.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-56 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1">
          <div className="flex items-center justify-between px-2 py-1 pb-1.5 border-b border-slate-800 text-[11px] text-slate-400">
            <span>Filter {label}</span>
            {selected.length > 0 && (
              <button onClick={onClear} className="text-blue-400 hover:underline">
                Clear ({selected.length})
              </button>
            )}
          </div>
          {options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-200 transition text-left"
              >
                <span className="truncate">{opt}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
