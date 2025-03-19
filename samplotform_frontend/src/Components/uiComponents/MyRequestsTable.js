import React, { useEffect, useState }  from 'react'
import { FormattedMessage } from 'react-intl'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import AddBoxIcon from '@mui/icons-material/AddBox'
import ErrorIcon from '@mui/icons-material/Error'
import Tooltip  from '@mui/material/Tooltip'
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import Search from '@mui/icons-material/Search'

import styled from 'styled-components'

const flowCodeInstall = process.env.REACT_APP_SDP_FLOW_CODE_INSTALL
const flowCodeUninstall = process.env.REACT_APP_SDP_FLOW_CODE_UNINSTALL
const flowCodeNative = process.env.REACT_APP_SDP_FLOW_CODE_NATIVE

const Expander = styled(IconButton)`
  &:focus{
    border: 0;
    outline: 0;
  }
`

const sprUrl = process.env.REACT_APP_SAM_PORTAL_SPR_FORM
const Row = props => {
  const { row, intl, isEn } = props
  const [open, setOpen] = React.useState(false)

  return <React.Fragment>
    <TableRow>
      <TableCell>
        {row.details && <Expander aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
          {open ? <IndeterminateCheckBoxOutlinedIcon /> : <AddBoxIcon />}
        </Expander>}
      </TableCell>
      <TableCell component="th" scope="row">
        {row.formId}
      </TableCell>
      <TableCell>{row.category}</TableCell>
      <TableCell>{row.formType && intl.formatMessage({ id: `myRequest.wording.type${row.formType}` })}</TableCell>
      <TableCell>{row.formType && intl.formatMessage({ id: `myRequest.wording.formType${row.formType}` })}</TableCell>
      <TableCell>{row.applicant}</TableCell>
      <TableCell>{row.statusCode && intl.formatMessage({ id: `myRequest.wording.status${row.statusCode}` })}</TableCell>
      <TableCell>{row.receivedDate}</TableCell>
      
    </TableRow>
    
    {open && row.details && row.details.map(e => {
      let url = '#'
      if (e.formID && row.formType === 1) {
        url=`${sprUrl}?FlowCode=${flowCodeInstall}&InstanceCode=${e.formID}&ToCode=1`
      } else if (e.formID && row.formType === 2) { 
        url=`${sprUrl}?FlowCode=${flowCodeUninstall}&InstanceCode=${e.formID}&ToCode=1`
      }else if (e.formID && row.formType === 3) {
        url=`${sprUrl}?FlowCode=${flowCodeNative}&InstanceCode=${e.formID}&ToCode=1`
      }
     
      return <TableRow key={e.formID}>
        <TableCell></TableCell>
        <TableCell><a href={url} target="_blank">{e.formID}</a></TableCell>
        <TableCell>{e.category}</TableCell>
        <TableCell>{row.formType && intl.formatMessage({ id: `myRequest.wording.type${row.formType}` })}</TableCell>
        <TableCell>{row.formType && intl.formatMessage({ id: `myRequest.wording.subject${row.formType}` })}</TableCell>
        <TableCell>{row.applicant}</TableCell>
        <TableCell>
          {isEn ? e.formStatusEName : e.formStatusName}
          {!!e.errorMsg && <Tooltip placement="top-start" arrow title={e.errorMsg}>
            <ErrorIcon style={{ marginLeft: '4px', marginBottom: '4px', color: 'orange', fontSize: '16px' }} />
          </Tooltip>}
        </TableCell>
        <TableCell>{e.receivedDate}</TableCell>
      </TableRow>
    })}
  </React.Fragment>
}

const columns = [
  { id: 'formId', label: 'formId', minWidth: 100 },
  { id: 'category', label: 'category', minWidth: 80 },
  { id: 'formType', label: 'type', minWidth: 80 },
  { id: 'subject', label: 'subject', minWidth: 170 },
  { id: 'applicant', label: 'applicant', minWidth: 100 },
  { id: 'statusCode', label: 'status', minWidth: 100 },
  { id: 'receivedDate', label: 'receivingTime', minWidth: 100 },
]

const Title = styled.p`
  white-space: pre;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 24px;
`

const FormStatusWrapper = styled(FormControl)`
  min-width: 200px !important;
  margin-left: 24px !important;
`

const FormWrapper = styled.div`
  display: flex;
  padding: 20px;
`
const MyRequestsTable = props => {
  const { requests, userId, getRequests, total, pageNum, pageSize, intl, isEn } = props

  const [page, setPage] = useState(pageNum-1)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)
  const [rows, setRows] = useState(requests)

  const [selectedStatus, setSelectedStatus] = useState(0)
  const [selectedType, setSelectedType] = useState(0)

  useEffect(() => {
    setRows(requests)
  }, [requests])
  useEffect(() => {
    setPage(pageNum-1)
  }, [pageNum])
  useEffect(() => {
    setRowsPerPage(pageSize)
  }, [pageSize])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    getRequests(newPage+1, pageSize, userId,!!selectedStatus ? selectedStatus : '', !!selectedType ? selectedType : '')
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    getRequests(1, event.target.value, userId,!!selectedStatus ? selectedStatus : '', !!selectedType ? selectedType : '')
  }

  const handleChangeFormStatus = e => {
    setSelectedStatus(e.target.value)
  }
  const handleChangeFormType = e => {
    setSelectedType(e.target.value)
  }
  const handleSearch = () => {
    getRequests(1, pageSize, userId, !!selectedStatus ? selectedStatus : '', !!selectedType ? selectedType : '')
  } 

  return (
    <div>
      <FormWrapper>
        <Title><FormattedMessage id="myRequest.formStatus" /> :</Title>
        <FormStatusWrapper>
          <InputLabel htmlFor="form-status"></InputLabel>
          <Select
            variant="standard"
            value={selectedStatus}
            onChange={handleChangeFormStatus}
            inputProps={{
              name: 'status',
              id: 'form-status',
            }}>
            <MenuItem value={0}><FormattedMessage id="myRequest.select" /></MenuItem>
            <MenuItem value={1}><FormattedMessage id="myRequest.wording.status1" /></MenuItem>
            <MenuItem value={2}><FormattedMessage id="myRequest.wording.status2" /></MenuItem>
          </Select>
        </FormStatusWrapper>
        <Title><FormattedMessage id="myRequest.formType" /> :</Title>
        <FormStatusWrapper>
          <InputLabel htmlFor="form-type"></InputLabel>
          <Select
            variant="standard"
            value={selectedType}
            onChange={handleChangeFormType}
            inputProps={{
              name: 'type',
              id: 'form-type',
            }}>
            <MenuItem value={0}><FormattedMessage id="myRequest.select" /></MenuItem>
            <MenuItem value={1}><FormattedMessage id="myRequest.wording.type1" /></MenuItem>
            <MenuItem value={2}><FormattedMessage id="myRequest.wording.type2" /></MenuItem>
            <MenuItem value={3}><FormattedMessage id="myRequest.wording.type3" /></MenuItem>
          </Select>
        </FormStatusWrapper>
        <Button variant="contained" onClick={handleSearch} style={{ color:'#fff', backgroundColor: '#00A0E9', fontSize: '1rem', margin: 'auto 0 auto auto' }}>
          <Search />{intl.formatMessage({ id: 'myRequest.search' })} 
        </Button>
      </FormWrapper>
      <TableContainer style={{ marginBottom: '50px' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {intl.formatMessage({ id: `myRequest.${column.label}` })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {              
              return <Row key={index} row={row} intl={intl} isEn={isEn}></Row>
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={`${intl.formatMessage({ id: 'myRequest.rowsPerPage' })}:`}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${intl.formatMessage({ id: 'myRequest.pagination' }, { count: count })}`}	
      />
    </div>
  );
}


export default MyRequestsTable
