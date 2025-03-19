import { findAllByTestId } from "@testing-library/react";

export const DEFAULT_SORTING_COL = {
  install: 'installTime',
  uninstall: 'uninstallTime',
  ongoing: 'stockId',
  softwareinfo: 'modifiedTime',
  permissionmgt: '',
  eformauth: 'account',
  vipmgt: 'account',
  softwareinfomgt: 'sourceId',
  sccm: 'Modified',
  license: 'Modified',
  installationpath: 'modifiedTime',
  trialWare: 'lastUpdateDate',
  sdpmanual: 'eForm',
  sdpunprocessed: 'eForm',
  sdpprocessed: 'eForm',
  rate: 'rate',
}
// export const DEFAULT_RATE_SORTING_COL={
//   rate:'rate',
//   version:'version',
//   lastUpdateDate:'lastUpdateDate',
//   fromCurr:'fromCurr',
//   toCurr:'toCurr'
// }
// const asyncFilter = async (arr, predicate) => {
// 	const results = await Promise.all(arr.map(predicate));

// 	return arr.filter((_v, index) => results[index]);
// }

export const sortingFunction = (list, params, cols, defaultSortingColumn) => {
  let { sortingColumn, isASC } = params
  let newList = [...list]

  if (sortingColumn && typeof isASC !== 'undefined') {
    let colInfo1 = cols.filter(el => el.id === sortingColumn)[0]
    let colInfo2 = cols.filter(el => el.id === defaultSortingColumn)[0]

    newList.sort((obj1, obj2) => {
      let param1 = obj1[sortingColumn]
      let param2 = obj2[sortingColumn]

      if (colInfo1.sortingFunc) {
        return colInfo1.sortingFunc(param1, param2, isASC)
      }
      if (!param1 || !param2) {
        param1 = obj1[defaultSortingColumn]
        param2 = obj2[defaultSortingColumn]
        colInfo2 = cols.filter(el => el.id === defaultSortingColumn)[0]

        if (colInfo2.sortingFunc) {
          return colInfo2.sortingFunc(param1, param2, isASC)
        }
      }

      if (typeof param1 === 'string' && typeof param2 === 'string') {
        return isASC ? param1.localeCompare(param2) : param2.localeCompare(param1)
      } else if (typeof param1 === 'number' && typeof param2 === 'string') {
        return isASC ? -1 : 1
      } else if (typeof param1 === 'string' && typeof param2 === 'number') {
        return isASC ? 1 : -1
      } else if (typeof param1 === 'number' && typeof param2 === 'number') {
        if (param1 > param2) { return isASC ? 1 : -1 }
        if (param1 === param2) { return 0 }
        if (param1 < param2) { return isASC ? -1 : 1 }
      }
      return 0
    })
  }
  return newList
}

export const sortingAndPaginationController = (dataObj, params, defaultSortingColumn, cols) => {
  let { currentPage, pageSize, keyword, sortingColumn, isASC } = params
  let { list } = dataObj
  if (keyword) {

    list = list.filter(el => {
      return el.sortingString.match(keyword.toLowerCase())
    })
  }
  if (sortingColumn && typeof isASC !== 'undefined') {


    let colInfo1 = cols.filter(el => el.id === sortingColumn)[0]
    let colInfo2 = cols.filter(el => el.id === defaultSortingColumn)[0]

    list.sort((obj1, obj2) => {
      let param1 = obj1[sortingColumn]
      let param2 = obj2[sortingColumn]

      if (colInfo1.sortingFunc) {
        return colInfo1.sortingFunc(param1, param2, isASC)
      }
      if (!param1 || !param2) {
        param1 = obj1[defaultSortingColumn]
        param2 = obj2[defaultSortingColumn]
        colInfo2 = cols.filter(el => el.id === defaultSortingColumn)[0]

        if (colInfo2.sortingFunc) {
          return colInfo2.sortingFunc(param1, param2, isASC)
        }
      }

      if (typeof param1 === 'string' && typeof param2 === 'string') {
        return isASC ? param1.localeCompare(param2) : param2.localeCompare(param1)
      } else if (typeof param1 === 'number' && typeof param2 === 'string') {
        return isASC ? -1 : 1
      } else if (typeof param1 === 'string' && typeof param2 === 'number') {
        return isASC ? 1 : -1
      } else if (typeof param1 === 'number' && typeof param2 === 'number') {
        if (param1 > param2) { return isASC ? 1 : -1 }
        if (param1 === param2) { return 0 }
        if (param1 < param2) { return isASC ? -1 : 1 }
      }
      return 0
    })
  }

  let total = list.length

  let totalPages = Math.ceil(total / pageSize)

  let startIdx = Math.ceil(pageSize * currentPage)
  let endIdx = Math.ceil(startIdx + pageSize)

  let viewList = list.slice(startIdx, endIdx)

  return {
    currentPage,
    total,
    pageSize,
    totalPages,
    list: dataObj.list,
    viewList
  }
}

export const initSortingAndPaging = (dataObj, params, defaultSortingColumn, cols) => {
  let { pageNum, pageSize } = params
  let currentPage = pageNum - 1

  let oriList = [...(dataObj.list ? dataObj.list : dataObj)]
  let list = oriList.map(el => {
    return {
      ...el,
      sortingString: Object.values(el).map(v => (typeof v === 'string') ? v.toLowerCase() : JSON.stringify(v)).join('_')
    }
  })

  let isASC = false
  let colInfo = cols.filter(el => el.id === defaultSortingColumn)[0]

  list.sort((obj1, obj2) => {

    let param1 = obj1[defaultSortingColumn]
    let param2 = obj2[defaultSortingColumn]

    if (colInfo.sortingFunc) {
      return colInfo.sortingFunc(param1, param2, isASC)
    }

    if (typeof param1 === 'string' && typeof param2 === 'string') {
      return isASC ? param1.localeCompare(param2) : param2.localeCompare(param1)
    } else if (typeof param1 === 'number' && typeof param2 === 'string') {
      return isASC ? -1 : 1
    } else if (typeof param1 === 'string' && typeof param2 === 'number') {
      return isASC ? 1 : -1
    } else if (typeof param1 === 'number' && typeof param2 === 'number') {
      if (param1 > param2) { return isASC ? 1 : -1 }
      if (param1 === param2) { return 0 }
      if (param1 < param2) { return isASC ? -1 : 1 }
    }
    return 0
  })
  
  let total = list.length

  let totalPages = Math.ceil(total / pageSize)

  let startIdx = Math.ceil(pageSize * currentPage)
  let endIdx = Math.ceil(startIdx + pageSize)

  let viewList = list.slice(startIdx, endIdx)

  return {
    currentPage,
    total,
    pageSize,
    totalPages,
    list,
    viewList
  }
}