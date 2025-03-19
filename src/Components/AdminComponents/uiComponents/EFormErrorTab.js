import {
  CContainer, CRow
} from '@coreui/react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import AdminTableFields from '../../../Common/AdminTableFields'
import AdminPagination from './AdminPagination'

const columns = [...AdminTableFields.EFormErrorCols]

const data = {"code":0,"message":"success","data":{"total":4,"pageNum":1,"pageSize":10,"size":4,"startRow":1,"endRow":4,"pages":1,"prePage":0,"nextPage":0,"hasPreviousPage":false,"hasNextPage":false,"navigatePages":8,"navigatepageNums":[1],"navigateFirstPage":1,"navigateLastPage":1,"list":[{"eform":"20230312","errorType":"sdp單子狀態異常","cause":"sdp單子擱置時間過長","causeDetail":"empployee table未同步更新✓\nassets table未同步更新×\nsdp單子狀態異常×","datetime":"2024/03/12 14:00:02"},{"eform":"20230313","errorType":"sdp單子狀態異常","cause":"sdp單子擱置時間過長","causeDetail":"empployee table未同步更新×\nassets table未同步更新✓\nsdp單子狀態異常✓","datetime":"2024/03/13 16:00:02"},{"eform":"20230555","errorType":"sdp單子狀態異常","cause":"sdp單子擱置時間過長","causeDetail":"empployee table未同步更新✓\nassets table未同步更新✓\nsdp單子狀態異常✓","datetime":"2024/03/13 18:00:02"},{"eform":"20230666","errorType":"sdp單子狀態異常","cause":"sdp單子擱置時間過長","causeDetail":"empployee table未同步更新×\nassets table未同步更新×\nsdp單子狀態異常×","datetime":"2024/04/13 19:00:02"}],"lastPage":true,"firstPage":true}}

const EFormErrorTab = props => {
  const {
    total,
    totalPages,
    eformList,
    queryEFormList
  } = props

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [unPage, setUnPage] = useState(false)
  const [ASC, setIsASC] = useState('ASC')

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    queryEFormList(newPage, rowsPerPage, ASC, unPage)
  }

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10)
    setRowsPerPage(newPageSize)
    setPage(0)
    queryEFormList(page, newPageSize, ASC, unPage)
  }

  useEffect(() => {
    queryEFormList(page, rowsPerPage, ASC, unPage)
    setPage(0)
  }, [])

  const sortHandler = (property) => {
    let asc = ASC
    if(ASC==='ASC'){
      asc='DESC'
      setIsASC('DESC')
    }else{
      asc='ASC'
      setIsASC('ASC')
    }
    queryEFormList(page, rowsPerPage, asc, unPage)
  }
  return (
    <CContainer>
      <CRow>
        <TableContainer component={Paper}>
          <Table aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                {columns.map(column => {
                  return <TableCell key={column.id}>
                    <TableSortLabel
                      onClick={() => { sortHandler(column.id) }}><FormattedMessage id={`eformerrormgt.${column.id}`} /></TableSortLabel>
                  </TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {eformList.map((ef, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} style={{whiteSpace:column.whiteSpace}} >
                          {column.viewCallback(ef[column.id])}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
          <AdminPagination
            queryResults={{
              totalPages: totalPages,
              total: total
            }}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPage={rowsPerPage}
          ></AdminPagination>
        </TableContainer>
      </CRow>
    </CContainer>
  )

}

const mapStateToProps = state => ({
  currentPage: state.eform.currentPage,
  total: state.eform.total,
  pageSize: state.eform.pageSize,
  totalPages: state.eform.totalPages,
  eformList: state.eform.eformList
})
const mapDispatchToProps = dispatch => ({
  queryEFormList: (pageNum, pageSize, sort, unPage) => dispatch({
    type: 'queryEFormList',
    payload: { pageNum, pageSize, sort, unPage }
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(EFormErrorTab)
