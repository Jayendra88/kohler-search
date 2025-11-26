/* eslint-disable no-console */
import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import {
  useSearchPage,
  // useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'

import CustomGallery from '../CustomGallery'

const CustomSearchContent = () => {
  const { searchQuery } = useSearchPage()
  // const { mobileLayout, showContentLoader } = useSearchPageState()

  const products = searchQuery?.data?.productSearch?.products || []

  const redirect = searchQuery?.data?.productSearch?.redirect

  /* No need to show the spinner if it is loading because
   the LoadingOverlay already takes care of this */
  if (redirect) {
    return null
  }

  if (!products || products.length === 0) {
    return <ExtensionPoint id="not-found" />
  }

  return (
    <>
      <div>
        <CustomGallery products={products} />
      </div>
    </>
  )
}

export default CustomSearchContent
