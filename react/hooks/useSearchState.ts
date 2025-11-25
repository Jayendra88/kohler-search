import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

const useSearchState = () => {
  const { searchQuery } = useSearchPage()

  return {
    fuzzy: searchQuery?.data?.productSearch?.fuzzy,
    operator: searchQuery?.data?.productSearch?.operator,
    searchState: searchQuery?.data?.productSearch?.searchState,
  }
}

export default useSearchState
