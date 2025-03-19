import {
  CInputGroup
} from '@coreui/react'
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import SearchIcon from '@mui/icons-material/Search'
import moment from 'moment'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect } from 'react-redux'
import AdminTableFields from '../../../Common/AdminTableFields'
import { ALL } from '../../../Common/constants'
import { sortingFunction } from '../../../Common/TableSorting'
import { FilterContainer, FilterGroup, SearchInput, SubmitButton, TableHeadContainer } from '../uiComponents/AdminCommonUis'
import AdminPagination from '../uiComponents/AdminPagination'
import EditSDPInfo from './EditSDPInfo'
import { sdpUrl } from '../../../Common/common'

const PREFIX = 'SdpManualTab';

const SDPContext = createContext()

const classes = {
  arrow: `${PREFIX}-arrow`,
  tooltip: `${PREFIX}-tooltip`
};

const HtmlTooltip = withStyles((theme) => ({
  arrow: {
    "&:before": {
      border: "1px solid #58E06F"
    },
    color: '#58E06F'
  },
  tooltip: {
    backgroundColor: 'rgb(212, 245, 213)',
    border: '2px solid #60E001',
    color: 'rgba(0, 0, 0, 0.87)',
    width: 200,
    height: 200,
    fontSize: 14,
    fontWeight: 'bold'
  },
}))(Tooltip)

const sprUrl = process.env.REACT_APP_SAM_PORTAL_SPR_VIEW
const columns = [...AdminTableFields.SDPManual]
const subColumns = [...AdminTableFields.SDPManualSub]

const ALL_STR = '-1'

const SdpManualRow = props => {

  const { item, createAll } = props

  const {
    isClientTeam
  } = useContext(SDPContext)

  const handleCreateAll = () => {
    let spds = []
    item.subList.forEach(el => {
      if (el.sdpSubExecute  === 'E') {
        spds.push(el.subID)
      }
    })
    createAll(spds, item.eForm)
  }

  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Button disabled={!isClientTeam} variant="contained" size="small" style={isClientTeam ? { backgroundColor: '#67C3D0', color: '#fff' } : {}}
            onClick={handleCreateAll}><FormattedMessage id="softwaresdpmgt.createSDP" /></Button>
        </TableCell>
        <TableCell>
            <a target="_blank" href={`${sprUrl}#/?InstanceCode=${item.eForm}&FlowCode=0`}>{item.eForm}</a>
        </TableCell>
        <TableCell>
          {item.quantity}
        </TableCell>
        <TableCell>
          <FormattedMessage id={`adminCommon.type${item.type}`} />
        </TableCell>
        <TableCell>
          <span style={{ color: 'green' }}>{item.status}</span>
        </TableCell>
        <TableCell>
          {item.area}
        </TableCell>
        <TableCell>
          {item.bgbu}
        </TableCell>
        <TableCell>
          {item.department}
        </TableCell>
        <TableCell>
          {item.applicant}
        </TableCell>
        <TableCell>
          <HtmlTooltip
            open={showTooltip}
            title={<ReasonTootip desc={item.reason} interactive />}
            aria-label="add"
            arrow>
            <Button onClick={() => { setShowTooltip(!showTooltip) }} onBlur={() => { setShowTooltip(false) }} variant="contained" size="small" 
              style={{ backgroundColor: '#67C3D0', color: '#fff' }}>Reason</Button>
          </HtmlTooltip>
        </TableCell>
      </TableRow>
      <TableRow >
      <TableCell colSpan={AdminTableFields.SDPManual.length + 1}>
          <div style={{ padding: '20px 4px 4px 80px' }}>
            <SdpManualSubTable list={item.subList}></SdpManualSubTable>
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const ReasonTootip = props => {
  const { desc } = props
  return <div style={{ padding: '16px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div>{desc}</div>
    </div>
  </div>
}

const SdpManualSubTable = props => {

  const [list, setList] = useState([])

  useEffect(() => {
    setList(props.list)
  }, [props.list])

  const [sortingColumn, setSortingColumn] = useState('stockID')
  const [isASC, setIsASC] = useState(false)
  let direction = isASC ? 'asc' : 'desc'

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true
    setIsASC(asc)
    setSortingColumn(property)
    let newList = sortingFunction(list, { sortingColumn, isASC }, subColumns, 'stockID')
    setList(newList)
  }

  return <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
      <TableRow>
        <TableCell style={{ backgroundColor: '#C8E6C9' }}><FormattedMessage id="adminCommon.operate" /></TableCell>
        {subColumns.map(column => {
          return <TableCell key={column.id} style={{ backgroundColor: '#C8E6C9' }}>
            <TableSortLabel
              onClick={() => { sortHandler(column.id) }}
              active={sortingColumn === column.id}
              direction={direction}
              hideSortIcon={sortingColumn !== column.id}>
              <FormattedMessage id={`adminCols.softwaresdpmgt.manualSub.${column.id}`} />
            </TableSortLabel>
          </TableCell>
        })}
        </TableRow>
      </TableHead>
      <TableBody>
        {list.map((el, index) => {
          return <SdpManualSubRow key={index} subItem={el}></SdpManualSubRow>
        })}
      </TableBody>
    </Table>
  </TableContainer>
}

const SendResult = props => {

  const { statusADGroup, statusSCCMFile, statusSCCMServer, statusLicenseOpt } = props

  const styleStrs = { Y: '', N: 'red' }

  return <div style={{ padding: '16px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div><FormattedMessage id="softwaresdpmgt.toolTip.field7" /></div>
      <div style={{ color: styleStrs[statusADGroup], textAlign: 'right' }}><FormattedMessage id={`softwaresdpmgt.str${statusADGroup}`} /></div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div><FormattedMessage id="softwaresdpmgt.toolTip.field8" /></div>
      <div style={{ color: styleStrs[statusSCCMFile], textAlign: 'right' }}><FormattedMessage id={`softwaresdpmgt.str${statusSCCMFile}`} /></div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div><FormattedMessage id="softwaresdpmgt.toolTip.field8" /></div>
      <div style={{ color: styleStrs[statusSCCMServer], textAlign: 'right' }}><FormattedMessage id={`softwaresdpmgt.str${statusSCCMServer}`} /></div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div><FormattedMessage id="softwaresdpmgt.toolTip.field10" /></div>
      <div style={{ color: styleStrs[statusLicenseOpt], textAlign: 'right' }}><FormattedMessage id={`softwaresdpmgt.str${statusLicenseOpt}`} /></div>
    </div>
  </div>
}

const SdpManualSubRow = props => {
  const { subItem } = props

  const {
    isClientTeam,
    handleEditSdpInfo
  } = useContext(SDPContext)

  const [showTooltip, setShowTooltip] = useState(false)

  // sdpSubExecute === 'E'
  return (
    <TableRow>
      <TableCell> 
        {subItem.sdpSubExecute === 'E' &&<Button disabled={!isClientTeam} onClick={() => handleEditSdpInfo(subItem)} variant="contained" size="small"
          style={isClientTeam ? { backgroundColor: '#67C3D0', color: '#fff' } : {}}><FormattedMessage id="softwaresdpmgt.editSDP" /></Button>}
        {/* {subItem.sdpSubExecute !== 'E' && <span style={{ color: 'green' }}><FormattedMessage id={`adminCommon.success`} /></span>} */}
        {subItem.sdpSubExecute !== 'E' && <a target="_blank" href={`${sdpUrl}${subItem.caseId}`}>{subItem.caseId}</a>}
      </TableCell>
      <TableCell>
        {subItem.stockID}
      </TableCell>
      <TableCell>
        {subItem.productName}
      </TableCell>
      <TableCell>
        {subItem.account}
      </TableCell>
      <TableCell>
        {subItem.computerName}
      </TableCell>
      <TableCell>
        {subItem.isVip === 1 && <span style={{ color: 'red' }}><FormattedMessage id="softwaresdpmgt.yes" /></span>}
        {subItem.isVip === 0 && <FormattedMessage id="softwaresdpmgt.no" />}
      </TableCell>
      <TableCell>
        {subItem.sccmPacked === 'N' && <span style={{ color: 'red' }}><FormattedMessage id={`softwaresdpmgt.sccm${subItem.sccmPacked}`} /></span>}
        {subItem.sccmPacked !== 'N' && <FormattedMessage id={`softwaresdpmgt.sccm${subItem.sccmPacked}`} />}
      </TableCell>
      <TableCell>
        {subItem.isTerminated === 1 && <span style={{ color: 'red' }}><FormattedMessage id="softwaresdpmgt.yes" /></span>}
        {subItem.isTerminated === 0 && <FormattedMessage id="softwaresdpmgt.no" />}
      </TableCell>
      <TableCell>
        <HtmlTooltip
          open={showTooltip}
          title={<SendResult {...subItem} interactive />}
          aria-label="add"
          arrow>
          <Button onClick={() => { setShowTooltip(!showTooltip) }} onBlur={() => { setShowTooltip(false) }} variant="contained" size="small" style={{ backgroundColor: '#67C3D0', color: '#fff' }}>Smart IT</Button>
        </HtmlTooltip>
      </TableCell>
    </TableRow>
  );
}

const SdpManualTab = props => {

  const { manualInfo, initData, autoCreateAllSDPInfo, isClientTeam, initA18nData } = props

  const { sdpTotal } = manualInfo
  useEffect(() => {
    initA18nData(getMessageFromI18n())
    handleSearch()
  }, [])
  const intl = useIntl()
  const [type, setType] = useState(ALL)
  
  const handleTypeChange = e => {
    setType(e.target.value)
  }
  const [startDate, setStartDate] = useState(moment().subtract(90, 'days').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
  const [searchStartDate, setSearchStartTime] = useState(startDate)
  const [searchEndDate, setSearchEndTime] = useState(endDate)
  const [searchType, setSearchType] = useState(type)
  const [keyword, setKeyword] = useState('')




  const getMessageFromI18n = ()=>{
    let messageObj = {}
    messageObj.title = intl.formatMessage({ id: `common.title` })
    messageObj.createSdpFail = intl.formatMessage({ id: `softwaresdpmgt.createSdpFail` })
    messageObj.createSdpFail2 = intl.formatMessage({ id: `softwaresdpmgt.createSdpFail2` })
    messageObj.bindSdpSuccess = intl.formatMessage({ id: `softwaresdpmgt.bindSdpSuccess` })
    messageObj.bindSdpFail = intl.formatMessage({ id: `softwaresdpmgt.bindSdpFail` })
    messageObj.createSdpSuccess = intl.formatMessage({ id: `softwaresdpmgt.createSdpSuccess` })
    return messageObj
  }
  useEffect(() => {
    let mEnd = moment(`${endDate} 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
    let mStart = moment(`${startDate} 00:00:00`).format('YYYY-MM-DD HH:mm:ss')
    let formType = type === ALL ? ALL_STR : type
    setSearchStartTime(mStart)
    setSearchEndTime(mEnd)
    setSearchType(formType)
  }, [startDate, endDate, type])

  const handleStartDateChange = e => {
    let mEnd = moment(`${endDate} 23:59:59`)
    let mStart = moment(`${e.target.value} 00:00:00`)
    if (!mEnd.isAfter(mStart)) {
      return
    }
    setStartDate(e.target.value)
  }
  const handleEndDateChange = e => {
    let mEnd = moment(`${e.target.value} 23:59:59`)
    let mStart = moment(`${startDate} 00:00:00`)
    if (!mEnd.isAfter(mStart)) {
      return
    }
    setEndDate(e.target.value)
  }

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortingColumn, setSortingColumn] = useState('eForm')
  const [isASC, setIsASC] = useState(false)
  let direction = isASC ? 'asc' : 'desc'

  const sortHandler = (property) => {
    // const asc = sortingColumn === property ? !isASC : true
    // setIsASC(asc)
    // setSortingColumn(property)
    // sdpManualController(0, rowsPerPage, keyword, property, asc)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    // sdpManualController(newPage, rowsPerPage, keyword, sortingColumn, isASC)
    initData(newPage, rowsPerPage, keyword, searchEndDate, searchStartDate, searchType)
  }

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10)
    setRowsPerPage(newPageSize)
    // sdpManualController(0, newPageSize, keyword, sortingColumn, isASC)
    initData(0, newPageSize, keyword, searchEndDate, searchStartDate, searchType)
    setPage(0)
  }

  const handleSearch = e => {
    let mEnd = moment(`${endDate} 23:59:59`)
    let mStart = moment(`${startDate} 00:00:00`)
    if (!mEnd.isAfter(mStart)) {
      alert('Invalid date range') // TODO date vaidation
      return
    }

    let endStr = mEnd.format('YYYY-MM-DD HH:mm:ss')
    let startStr = mStart.format('YYYY-MM-DD HH:mm:ss')

    let formType = type === ALL ? ALL_STR : type

    // initData(page + 1, rowsPerPage, endStr, startStr, formType)
    initData(0, rowsPerPage, keyword, endStr, startStr, formType)
    setPage(0)
  }

  const [showEditSDP, setShowEditSDP] = useState(false)
  const [currentObj, setCurrentObj] = useState({})
  const handleInput = e => {
    setKeyword(e.target.value)
  }

  useEffect(() => {
    let mEnd = moment(`${endDate} 23:59:59`)
    let mStart = moment(`${startDate} 00:00:00`)
    if (!mEnd.isAfter(mStart)) {
      alert('Invalid date range') // TODO date vaidation
      return
    }
    let endStr = mEnd.format('YYYY-MM-DD HH:mm:ss')
    let startStr = mStart.format('YYYY-MM-DD HH:mm:ss')

    let formType = type === ALL ? ALL_STR : type
    initData(0, rowsPerPage, keyword, endStr, startStr, formType)
    setPage(0)
  }, [keyword])

  const handleEditSdpInfo = (sdp) => {
    setShowEditSDP(true)
    setCurrentObj(sdp)
  }

  const sdpContextValue = {
    isClientTeam,
    handleEditSdpInfo
  }

  return (
    // <ThemeProvider theme={defaultTheme}>
    <SDPContext.Provider value={sdpContextValue}><React.Fragment>
      <TableContainer component={Paper}>
        <TableHeadContainer>

          <FilterGroup>
            <FilterContainer>
              <InputLabel id="formtype-select-label"><FormattedMessage id="eformquery.type" /></InputLabel>
              <Select
                variant="standard"
                labelId="formtype-select-label"
                id="formtype-select"
                value={type}
                onChange={handleTypeChange}>
                <MenuItem value={ALL}>{intl.formatMessage({ id: `adminCommon.all` })}</MenuItem>
                <MenuItem value={1}>{intl.formatMessage({ id: `eformquery.tab1` })}</MenuItem>
                <MenuItem value={2}>{intl.formatMessage({ id: `eformquery.tab2` })}</MenuItem>
              </Select>

            </FilterContainer>
            <FilterContainer>
              <TextField
                variant="standard"
                id="dateStart"
                label={intl.formatMessage({ id: `eformquery.start` })}
                type="date"
                onChange={handleStartDateChange}
                value={startDate}
                InputLabelProps={{
                  shrink: true,
                }} />
            </FilterContainer>
            <FilterContainer>
              <TextField
                variant="standard"
                id="dateEnd"
                label={intl.formatMessage({ id: `eformquery.end` })}
                type="date"
                onChange={handleEndDateChange}
                value={endDate}
                InputLabelProps={{
                  shrink: true,
                }} />
            </FilterContainer>
          </FilterGroup>
          <FilterGroup>
            <SubmitButton onClick={handleSearch}> <SearchIcon /><FormattedMessage id="adminCommon.search" /></SubmitButton>
          </FilterGroup>
        </TableHeadContainer>
        <TableHeadContainer>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FACB16', borderRadius: '1rem', padding: '6px' }}>
            <ErrorOutlineIcon />
            <div style={{ marginLeft: '2px', fontSize: '16px' }}>
              <span><FormattedMessage id="softwaresdpmgt.sprQuantity" /></span><span style={{ color: 'red' }}>{`${sdpTotal}  `}</span>
            </div>
          </div>
          <CInputGroup style={{ minWidth: '250px', width: '250px' }}>
            <SearchInput value={keyword} onChange={handleInput}
              className="searchinput" placeholder={intl.formatMessage({ id: `adminCommon.keyword` })}></SearchInput>
          </CInputGroup>
        </TableHeadContainer>
        <Table>
          <TableHead>
          <TableRow>
            <TableCell><FormattedMessage id="adminCommon.operate" /></TableCell>
            {columns.map(column => {
              return  <TableCell key={column.id}>
                <TableSortLabel
                  key={column.id}
                  onClick={() => { sortHandler(column.id) }}
                  active={sortingColumn === column.id}
                  direction={direction}
                  hideSortIcon={sortingColumn !== column.id}><FormattedMessage id={`adminCols.softwaresdpmgt.manual.${column.id}`} /></TableSortLabel>
               </TableCell>
            })}
            </TableRow>
          </TableHead>
          <TableBody>
            {manualInfo.viewList.map((el, index) => {
              return <SdpManualRow key={index} item={el} createAll={autoCreateAllSDPInfo}></SdpManualRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <AdminPagination
          queryResults={manualInfo}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
        ></AdminPagination>
      </TableContainer>
      <EditSDPInfo show={showEditSDP} toggleFunc={setShowEditSDP} item={currentObj} setterFunc={setCurrentObj}></EditSDPInfo>
    </React.Fragment></SDPContext.Provider>
  );
}

const mapStateToProps = state => ({
  manualInfo: state.sdp.manual
})
const mapDispatchToProps = dispatch => ({
  initData: (pageNum, pageSize,keyword, applicationRangeE, applicationRangeS, formType) => dispatch({
    type: 'initSDPManualData',
    payload: { pageNum: pageNum + 1, pageSize, keyword, applicationRangeE, applicationRangeS, formType }
  }),
  sdpManualController: (currentPage, pageSize, keyword, sortingColumn, isASC) => dispatch({
    type: 'sdpManualController',
    payload: { currentPage, pageSize, keyword, sortingColumn, isASC }
  }),
  autoCreateAllSDPInfo: (sdps, eForm) => dispatch({
    type: 'autoCreateAllSDPInfo',
    payload: { sdps, eForm }
  }),
  initA18nData: (intlMetaData) => dispatch({
    type: 'initA18nData',
    payload: { intlMetaData }
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(SdpManualTab)
