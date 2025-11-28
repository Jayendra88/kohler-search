import React, { useCallback, useMemo, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import FilterDropdown from './FilterDropdown'
import SelectedFilters from './SelectedFilters'
import Sidebar from './Sidebar'
import FilterNavigatorVertical from './FilterNavigatorVertical'
import { useFacetNavigation, useFilterState } from '../../hooks'
import { FacetGroup, FacetItem } from '../../types'
import { newFacetPathName } from '../../utils/slug'
import './filterNavigator.css'

const CSS_HANDLES = [
  'filterNavigatorContainer',
  'filterSidebarButton',
  'filterSidebarButtonText',
  'filterSidebarButtonIcon',
  'filterSidebarHeader',
  'filterSidebarTitle',
  'filterSidebarContent',
  'filterSidebarFooter',
  'filterSidebarClearButton',
  'filterSidebarApplyButton',
]

const getSelectedCategories = (tree: any[]): any[] => {
  for (const node of tree) {
    if (!node.selected) {
      continue
    }

    if (node.children) {
      return [node, ...getSelectedCategories(node.children)]
    }

    return [node]
  }

  return []
}

const newNamedFacet = (facet: any) => {
  return { ...facet, newQuerySegment: newFacetPathName(facet) }
}

const flattenDeep = (arr: any[]): any[] => {
  return arr.reduce((accumulator, currentValue) => {
    return accumulator.concat(
      Array.isArray(currentValue) ? flattenDeep(currentValue) : currentValue
    )
  }, []) as any[]
}

interface FilterNavigatorProps {
  facetGroups: FacetGroup[]
  facets: any
}

const FilterNavigator = ({ facetGroups, facets }: FilterNavigatorProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { selectedFilterValues, updateSelection } = useFilterState(facetGroups)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { brands, priceRanges, specificationFilters, categoriesTrees } = facets

  const selectedFilters = useMemo(() => {
    const options = [
      ...specificationFilters.map((filter: any) => {
        return filter.facets.map((facet: any) => {
          return {
            ...newNamedFacet({ ...facet, title: filter.name }),
            hidden: filter.hidden,
          }
        })
      }),
      ...brands,
      ...priceRanges,
    ]

    return flattenDeep(options)
  }, [brands, priceRanges, specificationFilters]).filter(
    (facet: any) => facet.selected
  )

  const selectedCategories = getSelectedCategories(categoriesTrees || [])
  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedCategories.concat(selectedFilters)
    }, [selectedFilters, selectedCategories]),
    'none'
  )

  const handleSelectionChange = useCallback(
    (facet: FacetItem) => {
      // console.log('>> Handling selection change:', { ...facet });
      // Update local state
      updateSelection(facet.value, facet.selected)

      // Navigate using the navigation service
      navigateToFacet({ ...facet }, false)
    },
    [navigateToFacet, updateSelection]
  )

  // Collect all selected facets from all groups
  const allSelectedFacets = useMemo(() => {
    const selected: FacetItem[] = []

    facetGroups.forEach((group) => {
      group.facets.forEach((facet) => {
        if (selectedFilterValues.has(facet.value)) {
          selected.push(facet)
        }
      })
    })

    return selected
  }, [facetGroups, selectedFilterValues])

  const handleRemoveFilter = useCallback(
    (facetSelected: FacetItem) => {
      if (facetSelected) {
        handleSelectionChange(facetSelected)
      }
    },
    [handleSelectionChange]
  )

  return (
    <>
      <div className={`${handles.filterNavigatorContainer} flex flex-row flex-wrap items-center`}>
        {facetGroups.map((group, index) => (
          <FilterDropdown
            key={`${group.type}-${group.key || index}`}
            facetGroup={group}
            selectedValues={selectedFilterValues}
            onSelectionChange={handleSelectionChange}
          />
        ))}

        {/* All Filters Button */}
        <button
          className={`${handles.filterSidebarButton} pointer flex items-center`}
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className={`${handles.filterSidebarButtonIcon} mr2`}>
            {/* Filter Icon - Sliders */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="4" />
              <circle cx="6" cy="4" r="1.5" fill="currentColor" stroke="none" />
              <line x1="4" y1="8" x2="12" y2="8" />
              <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <line x1="4" y1="12" x2="12" y2="12" />
              <circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className={`${handles.filterSidebarButtonText}`}>
            All Filters
          </span>
        </button>
      </div>

      <SelectedFilters
        selectedFacets={allSelectedFacets}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Sidebar Modal */}
      <Sidebar isOpen={isSidebarOpen} onOutsideClick={() => setIsSidebarOpen(false)} fullWidth={false}>
        {/* Header */}
        <div className={handles.filterSidebarHeader}>
          <h3 className={handles.filterSidebarTitle}>All Filters</h3>
        </div>

        {/* Content */}
        <div className={handles.filterSidebarContent}>
          <FilterNavigatorVertical
            facets={facets}
            facetGroups={facetGroups}
          />
        </div>

        {/* Footer with Clear and Apply buttons */}
        <div className={`${handles.filterSidebarFooter} flex`}>
          <button
            className={`${handles.filterSidebarClearButton} flex-auto`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Clear Filters
          </button>
          <button
            className={`${handles.filterSidebarApplyButton} flex-auto`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Apply Filters
          </button>
        </div>
      </Sidebar>
    </>
  )
}

export default FilterNavigator
