import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

export interface URLState {
  page: number;
  search: string;
  category: string;
  city: string;
  rating: string;
  priceRange: string;
  sortBy: string;
  [key: string]: string | number;
}

export const useURLManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current URL state
  const getURLState = (): URLState => ({
    page: parseInt(searchParams.get('page') || '1'),
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    rating: searchParams.get('rating') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || '',
  });

  // Update URL with new state
  const updateURL = (newState: Partial<URLState>, replace = false) => {
    const currentState = getURLState();
    const updatedState = { ...currentState, ...newState };
    
    // Remove empty values
    Object.keys(updatedState).forEach(key => {
      if (updatedState[key] === '' || updatedState[key] === 0) {
        delete updatedState[key];
      }
    });

    // Convert to URLSearchParams
    const newSearchParams = new URLSearchParams();
    Object.entries(updatedState).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newSearchParams.set(key, value.toString());
      }
    });

    if (replace) {
      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    } else {
      setSearchParams(newSearchParams);
    }
  };

  // Update specific parameter
  const updateParam = (key: keyof URLState, value: string | number, replace = false) => {
    updateURL({ [key]: value }, replace);
  };

  // Reset to specific page
  const goToPage = (page: number, replace = false) => {
    updateParam('page', page, replace);
  };

  // Reset filters and go to page 1
  const resetFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  // Clear specific filter
  const clearFilter = (key: keyof URLState) => {
    const currentState = getURLState();
    delete currentState[key];
    currentState.page = 1; // Reset to page 1 when clearing filters
    
    const newSearchParams = new URLSearchParams();
    Object.entries(currentState).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        newSearchParams.set(k, v.toString());
      }
    });
    setSearchParams(newSearchParams);
  };

  // Get URL for pagination
  const getPageURL = (page: number) => {
    const currentState = getURLState();
    currentState.page = page;
    
    const newSearchParams = new URLSearchParams();
    Object.entries(currentState).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newSearchParams.set(key, value.toString());
      }
    });
    
    return `${location.pathname}?${newSearchParams.toString()}`;
  };

  // Get URL for filter changes
  const getFilterURL = (filters: Partial<URLState>) => {
    const currentState = getURLState();
    const updatedState = { ...currentState, ...filters, page: 1 }; // Reset to page 1 when applying filters
    
    const newSearchParams = new URLSearchParams();
    Object.entries(updatedState).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newSearchParams.set(key, value.toString());
      }
    });
    
    return `${location.pathname}?${newSearchParams.toString()}`;
  };

  // Sync URL with component state
  const syncURLWithState = (state: Partial<URLState>) => {
    const urlState = getURLState();
    const hasChanges = Object.keys(state).some(key => 
      state[key as keyof URLState] !== urlState[key as keyof URLState]
    );
    
    if (hasChanges) {
      updateURL(state, true);
    }
  };

  return {
    searchParams,
    getURLState,
    updateURL,
    updateParam,
    goToPage,
    resetFilters,
    clearFilter,
    getPageURL,
    getFilterURL,
    syncURLWithState,
    currentPage: getURLState().page,
    currentSearch: getURLState().search,
    currentCategory: getURLState().category,
    currentCity: getURLState().city,
    currentRating: getURLState().rating,
    currentPriceRange: getURLState().priceRange,
    currentSortBy: getURLState().sortBy,
  };
};

// Helper function to create pagination URLs
export const createPaginationURLs = (basePath: string, currentPage: number, totalPages: number, searchParams: URLSearchParams) => {
  const urls: { [key: string]: string } = {};
  
  // Previous page
  if (currentPage > 1) {
    const prevParams = new URLSearchParams(searchParams);
    prevParams.set('page', (currentPage - 1).toString());
    urls.prev = `${basePath}?${prevParams.toString()}`;
  }
  
  // Next page
  if (currentPage < totalPages) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', (currentPage + 1).toString());
    urls.next = `${basePath}?${nextParams.toString()}`;
  }
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageParams = new URLSearchParams(searchParams);
    pageParams.set('page', i.toString());
    urls[i] = `${basePath}?${pageParams.toString()}`;
  }
  
  return urls;
};

// Helper function to create filter URLs
export const createFilterURLs = (basePath: string, currentFilters: URLState, searchParams: URLSearchParams) => {
  const urls: { [key: string]: string } = {};
  
  // Category filter URLs
  const categories = ['restaurants', 'cafes', 'shopping', 'entertainment', 'health-wellness', 'sports-fitness', 'arts-culture'];
  categories.forEach(category => {
    const categoryParams = new URLSearchParams(searchParams);
    categoryParams.set('category', category);
    categoryParams.set('page', '1');
    urls[category] = `${basePath}?${categoryParams.toString()}`;
  });
  
  // Rating filter URLs
  const ratings = ['4.5', '4.0', '3.5', '3.0'];
  ratings.forEach(rating => {
    const ratingParams = new URLSearchParams(searchParams);
    ratingParams.set('rating', rating);
    ratingParams.set('page', '1');
    urls[`rating-${rating}`] = `${basePath}?${ratingParams.toString()}`;
  });
  
  // Price range filter URLs
  const priceRanges = ['$', '$$', '$$$', '$$$$'];
  priceRanges.forEach(price => {
    const priceParams = new URLSearchParams(searchParams);
    priceParams.set('priceRange', price);
    priceParams.set('page', '1');
    urls[`price-${price}`] = `${basePath}?${priceParams.toString()}`;
  });
  
  return urls;
};

