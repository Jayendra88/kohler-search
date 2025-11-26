import React, { useCallback, useMemo } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import FilterDropdown from './FilterDropdown'
import SelectedFilters from './SelectedFilters'
import { useFacetNavigation, useFilterState } from '../../hooks'
import { FacetGroup, FacetItem } from '../../types'
import { newFacetPathName } from '../../utils/slug'
import './filterNavigator.css'

const CSS_HANDLES = ['filterNavigatorContainer']

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
    (value: string) => {
      // Find the facet type and key for the value
      let selectedFacet = null

      facetGroups.forEach((group) => {
        selectedFacet = group.facets.find((f) => f.value === value)
      })

      if (selectedFacet) {
        handleSelectionChange(selectedFacet)
      }
    },
    [facetGroups, handleSelectionChange]
  )

  return (
    <>
      <div className={`${handles.filterNavigatorContainer} flex flex-row`}>
        {facetGroups.map((group, index) => (
          <FilterDropdown
            key={`${group.type}-${group.key || index}`}
            facetGroup={group}
            selectedValues={selectedFilterValues}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>

      <SelectedFilters
        selectedFacets={allSelectedFacets}
        onRemoveFilter={handleRemoveFilter}
      />
    </>
  )
}

export default FilterNavigator
