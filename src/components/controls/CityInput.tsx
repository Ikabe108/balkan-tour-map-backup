import { useState, useRef } from 'react';
import { Search, Plus, X, MapPin } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { searchCities } from '../../utils/cityMatcher';
import type { CityData } from '../../types';

export function CityInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { addCity } = useProjectStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length >= 2) {
      const matched = searchCities(val);
      setResults(matched);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (city: CityData) => {
    addCity(city);
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search for a city (e.g. Zagreb)"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {results.map((city, idx) => (
            <button
              key={`${city.name}-${idx}`}
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3 transition-colors"
            >
              <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">{city.name}</div>
                <div className="text-xs text-gray-500">{city.country}</div>
              </div>
              <Plus className="h-4 w-4 text-gray-300 ml-auto" />
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-4 px-4 text-center text-sm text-gray-500 ring-1 ring-black ring-opacity-5">
          No cities found matching "{query}"
        </div>
      )}
    </div>
  );
}
