import { ReactNode, CSSProperties } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortState = {
  columnKey: string | null
  direction: SortDirection
}

export type DataTableColumn<T> = {
  /**
   * Identifier for the column (also used for visibility + sticky tracking)
   */
  key: string
  /**
   * Optional accessor to pull values from the row.
   * If omitted we try to access row[key as keyof T].
   */
  accessor?: keyof T
  header: string
  width?: number
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  /**
   * Should this column be rendered by default?
   */
  defaultVisible?: boolean
  /**
   * Which side should the sticky styles anchor to?
   */
  sticky?: 'left' | 'right'
  defaultSticky?: boolean
  /**
   * Allow users to toggle sticky state from the column panel.
   */
  enableStickyToggle?: boolean
  /**
   * Render function for the cell contents.
   */
  render?: (row: T, context: { rowIndex: number; value: unknown }) => ReactNode
  /**
   * Custom header render (useful for sort indicators, tooltips, etc.).
   */
  headerRender?: (
    column: DataTableColumn<T>,
    context: { sort: SortState; onSort?: (columnKey: string) => void }
  ) => ReactNode
  /**
   * Optional short helper text rendered under the header label.
   */
  subLabel?: string
}

export type DataTableFilterOption = {
  label: string
  value: string
}

export type DataTableFilterControl = {
  id: string
  label: string
  type: 'select' | 'custom'
  value?: string
  placeholder?: string
  options?: DataTableFilterOption[]
  onChange?: (value: string) => void
  onClear?: () => void
  /**
   * Provide your own custom JSX control when type === 'custom'
   */
  element?: ReactNode
  /**
   * Optional width (defaults to bootstrap col auto)
   */
  width?: 'auto' | 3 | 4 | 6 | 12
}

export type DataTableSearchConfig = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onClear?: () => void
}

export type DataTableToolbarConfig = {
  showFilters?: boolean
  onToggleFilters?: () => void
  search?: DataTableSearchConfig
  filters?: DataTableFilterControl[]
  extra?: ReactNode
  title?: string
}

export type DataTablePaginationConfig = {
  currentPage: number
  pageSize: number
  totalRecords: number | string
  hasMore?: boolean
  isLastPage?: boolean
  totalPages?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  startRecord?: number
  endRecord?: number
}

export type DataTableEmptyState = {
  title: string
  description?: string
  icon?: ReactNode
}

export type DataTableColumnPanelConfig = {
  enableColumnVisibility?: boolean
  enableSticky?: boolean
  maxSticky?: number
}

export type DataTableProps<T> = {
  id: string
  title: string
  description?: string
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  stickyHeader?: boolean
  minTableWidth?: number
  toolbar?: DataTableToolbarConfig
  pagination?: DataTablePaginationConfig
  emptyState?: DataTableEmptyState
  columnPanel?: DataTableColumnPanelConfig
  rowKey?: (row: T, index: number) => string | number
  sorting?: {
    state: SortState
    onToggle: (columnKey: string) => void
    onReset?: () => void
  }
  tableContainerStyle?: CSSProperties
  rowClassName?: (row: T, rowIndex: number) => string
  rowStyle?: (row: T, rowIndex: number) => CSSProperties | undefined

}

