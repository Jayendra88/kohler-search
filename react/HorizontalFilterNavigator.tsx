import React, { useMemo } from 'react';
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';

import { LoadingPlaceholder } from './components';
import { FacetTransformer } from './utils';
import FilterNavigator from './components/FilterNavigator';
import FilterNavigatorContext from './components/FilterNavigatorContext';

const HorizontalFilterNavigator = () => {
  const {
    searchQuery,
    map,
    showFacets,
  } = useSearchPage();

  // Transform facets data using the transformer utility
  const facetGroups = useMemo(() => {
    return FacetTransformer.transformAllFacets(searchQuery?.data?.facets || {});
  }, [searchQuery?.data?.facets]);

  //   const filtersFetchMore =
  //       searchQuery && searchQuery.facets && searchQuery.facets.facetsFetchMore
  //         ? searchQuery.facets.facetsFetchMore
  //         : undefined

  const facets =
    searchQuery && searchQuery.data && searchQuery.data.facets
      ? searchQuery.data.facets
      : {}

  const {
    queryArgs,
  } = facets

  console.log('>> Facet Groups:', facetGroups);
  console.log('>> Facets:', facets);


  // Use the custom hook for filter state management


  // Early returns for various states
  if (showFacets === false || !map || facetGroups.length === 0) {
    return null;
  }

  if (!searchQuery?.data) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="horizontal-filter-navigator-container">
      <FilterNavigatorContext.Provider value={queryArgs}>
        <FilterNavigator facets={facets} facetGroups={facetGroups} />
      </FilterNavigatorContext.Provider>
    </div>
  );
};

export default HorizontalFilterNavigator;