/* eslint-disable no-console */
import React, { useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
// import { useProductComparison } from 'vtex.product-comparison'
// import { ExtensionPoint } from 'vtex.render-runtime'

import './ProductTableRow.css'

const CSS_HANDLES = [
  'tableRow',
  'tableCell',
  'compareCell',
  'skuCell',
  'productCell',
  'statusCell',
  'priceCell',
  'favoriteCell',
  'servicePartsCell',
  'shareCell',
  'productInfo',
  'productImage',
  'productDetails',
] as const

const ProductTableRow: React.FC = () => {
  const handles = (useCssHandles(CSS_HANDLES) as unknown) as Record<
    typeof CSS_HANDLES[number],
    string
  >

  const product = useProduct()

  const [image] = useState<string>(
    product?.selectedItem?.images?.find((im) => im)?.imageUrl ?? ''
  )

  const referenceId =
    product?.selectedItem?.referenceId?.find((r) => r.Key === 'RefId')?.Value ??
    ''

  if (!product) {
    return null
  }

  console.log(product)

  // const productId = product.product?.productId
  // const isSelected = isProductSelected?.(productId)

  return (
    <tr className={handles.tableRow}>
      <td>{product.product?.productId}</td>
      <td className={`${handles.tableCell} ${handles.skuCell}`}>
        {referenceId}
      </td>
      <td>
        <div>
          <img
            src={image}
            alt={product.product?.productName}
            width={100}
            height={100}
            style={{ objectFit: 'contain' }}
          />
          <div>
            <span>{product.product?.brand}</span>
            <span>{product.product?.productName}</span>
          </div>
        </div>
      </td>
      {/* <td className={`${handles.tableCell} ${handles.compareCell}`}>
        <input type="checkbox" checked={false} />
      </td>
      <td className={`${handles.tableCell} ${handles.skuCell}`}>
        <ExtensionPoint id="product-identifier.summary" />
      </td>
      <td className={`${handles.tableCell} ${handles.productCell}`}>
        <div className={handles.productInfo}>
          <div className={handles.productImage}>
            <ExtensionPoint id="product-summary-image#table" />
          </div>
          <div className={handles.productDetails}>
            <ExtensionPoint id="product-summary-brand" />
            <ExtensionPoint id="product-summary-name" />
          </div>
        </div>
      </td>
      <td className={`${handles.tableCell} ${handles.statusCell}`}>
        <ExtensionPoint id="product-specification-badges" />
      </td>
      <td className={`${handles.tableCell} ${handles.priceCell}`}>
        <ExtensionPoint id="product-summary-price" />
      </td>
      <td className={`${handles.tableCell} ${handles.favoriteCell}`}>
        <ExtensionPoint id="add-to-list-btn#table" />
      </td>
      <td className={`${handles.tableCell} ${handles.servicePartsCell}`}>
        <ExtensionPoint id="rich-text#service-parts-placeholder" />
      </td>
      <td className={`${handles.tableCell} ${handles.shareCell}`}>
        <ExtensionPoint id="rich-text#share-placeholder" />
      </td> */}
    </tr>
  )
}

export default ProductTableRow
