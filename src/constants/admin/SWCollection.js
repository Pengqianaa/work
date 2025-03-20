import { viewCallback } from "src/Common/commonMethod";
import moment from 'moment'

const QueryOrDownloadCols = [
  {
    id: 'brand', label: 'Brand', minWidth: 100, viewCallback
  },
  {
    id: 'productName', label: 'Product Name', minWidth: 100, viewCallback
  },
  {
    id: 'area', label: 'Area', minWidth: 100, viewCallback
  },
  {
    id: 'bg', label: 'Bg', minWidth: 100, viewCallback
  },
  {
    id: 'bu', label: 'Bu', minWidth: 100, viewCallback: (el) => {
      return el
    }
  },
  {
    id: 'costCenter', label: 'Cost Center', minWidth: 100, viewCallback
  },
  {
    id: 'status', label: 'Status', minWidth: 100, viewCallback
  },
  {
    id: 'installedQty', label: 'Installed Qty', minWidth: 100, viewCallback: (el) => {
      // if (!el) { return '-' }
      return el
    }
  },
  {
    id: 'budgetQty', label: 'Budget Qty', minWidth: 100, viewCallback
  },
  {
    id: 'planToAddRemoveQty', label: 'plan To Add/Remove Qty', minWidth: 100, viewCallback
  },
  {
    id: 'budgetAmountTwd', label: 'Budget Amount(TWD)', minWidth: 100, viewCallback: (el) => {
      // if (!el) { return '-' }
      return el
    }
  },
  {
    id: 'budgetAmountUsd', label: 'Budget Amount(USD)', minWidth: 100, viewCallback: (el) => {
      // if (!el) { return '-' }
      return el
    }
  },
  {
    id: 'lastUpdatedBy', label: 'Last Updated By', minWidth: 100, viewCallback
  },
  {
    id: 'lastUpdated', label: 'Last Updated', minWidth: 100, viewCallback: (el) => {
      if (!el) { return '-' }
      return moment(el).format('YYYY/MM/DD hh:mm:ss')
    }
  },
]

const SWCollectionReportSubCols = [
  {
    id: 'area', label: 'Area', minWidth: 100, viewCallback
  },
  {
    id: 'brand', label: 'Brand', minWidth: 100, viewCallback
  },
  {
    id: 'productName', label: 'Product Name', minWidth: 100, viewCallback
  },
  {
    id: 'adAccount', label: 'Account', minWidth: 100, viewCallback
  },
  {
    id: 'computerName', label: 'Computer Name', minWidth: 100, viewCallback
  },
]

export { QueryOrDownloadCols , SWCollectionReportSubCols };
