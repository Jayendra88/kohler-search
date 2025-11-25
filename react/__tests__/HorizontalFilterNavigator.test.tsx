import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import HorizontalFilterNavigator from '../HorizontalFilterNavigator'

// Mock the search page context
jest.mock('vtex.search-page-context/SearchPageContext', () => ({
  useSearchPage: () => ({
    searchQuery: {
      data: {
        facets: {
          brands: [
            { id: '1', name: 'Brand A', value: 'brand-a', quantity: 10, selected: false },
            { id: '2', name: 'Brand B', value: 'brand-b', quantity: 5, selected: true }
          ],
          specificationFilters: [
            {
              name: 'Color',
              facets: [
                { id: '3', name: 'Red', value: 'red', quantity: 8, selected: false },
                { id: '4', name: 'Blue', value: 'blue', quantity: 12, selected: false }
              ]
            }
          ]
        }
      }
    },
    map: 'c,c',
    showFacets: true,
    navigateToFacet: jest.fn()
  })
}))

describe('HorizontalFilterNavigator', () => {
  test('renders filter dropdowns', () => {
    render(<HorizontalFilterNavigator />)
    
    expect(screen.getByText('Brands')).toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  test('shows selected count in dropdown trigger', () => {
    render(<HorizontalFilterNavigator />)
    
    // Brand B is selected, so should show (1)
    expect(screen.getByText('(1)')).toBeInTheDocument()
  })

  test('opens dropdown when clicked', () => {
    render(<HorizontalFilterNavigator />)
    
    const brandsDropdown = screen.getByText('Brands').closest('button')
    fireEvent.click(brandsDropdown!)
    
    expect(screen.getByText('Brand A')).toBeInTheDocument()
    expect(screen.getByText('Brand B')).toBeInTheDocument()
  })

  test('handles checkbox selection', () => {
    const mockNavigateToFacet = jest.fn()
    
    render(<HorizontalFilterNavigator />)
    
    const brandsDropdown = screen.getByText('Brands').closest('button')
    fireEvent.click(brandsDropdown!)
    
    const brandACheckbox = screen.getByLabelText(/Brand A/)
    fireEvent.click(brandACheckbox)
    
    // Should have called navigation function
    expect(mockNavigateToFacet).toHaveBeenCalled()
  })
})