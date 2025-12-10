import { useState, useMemo, useCallback } from 'react';

/**
 * Hook for searching/filtering table data
 */
export function useTableSearch({ data, searchFields, initialSearchTerm = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [data, searchTerm, searchFields]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const isSearching = searchTerm.trim().length > 0;

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    isSearching,
  };
}

