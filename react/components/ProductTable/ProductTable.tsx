import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
// import { ExtensionPoint } from 'vtex.render-runtime'
import './ProductTable.css'

const CSS_HANDLES = [
  'productTableWrapper',
  'productTable',
  'tableHeader',
  'tableHeaderRow',
  'tableHeaderCell',
  'tableBody',
  'priceHeaderCell',
  'priceHeaderContent',
  'infoIcon',
] as const

interface ProductTableWrapperProps {
  children?: React.ReactNode
}

const ProductTableWrapper: React.FC<ProductTableWrapperProps> = ({
  children,
}) => {
  const handles = (useCssHandles(CSS_HANDLES) as unknown) as Record<
    typeof CSS_HANDLES[number],
    string
  >

  return (
    <div className={handles.productTableWrapper}>
      <table className={handles.productTable}>
        <thead className={handles.tableHeader}>
          <tr className={handles.tableHeaderRow}>
            <th className={handles.tableHeaderCell}>Compare</th>
            <th className={handles.tableHeaderCell}>SKU</th>
            <th className={handles.tableHeaderCell}>Products</th>
            <th className={handles.tableHeaderCell}>Finish</th>
            <th
              className={`${handles.tableHeaderCell} ${handles.priceHeaderCell}`}
            >
              <span className={handles.priceHeaderContent}>
                List Price
                <span
                  className={handles.infoIcon}
                  role="img"
                  aria-label="List Price Information"
                  title="List Price Information"
                >
                  i
                </span>
              </span>
            </th>
            <th className={handles.tableHeaderCell}>Service Parts</th>
            <th className={handles.tableHeaderCell}>Action</th>
          </tr>
        </thead>
        <tbody className={handles.tableBody}>
          <>{children}</>
        </tbody>
      </table>
    </div>
  )
}

export default ProductTableWrapper
