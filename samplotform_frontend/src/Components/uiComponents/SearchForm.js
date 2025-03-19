import React from 'react'
import {
	CButton,
	CInputGroup,
	CInputGroupAppend,
	CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Autocomplete from 'react-autocomplete'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { injectIntl } from 'react-intl'
import { SCREEN } from '../../Common/constants'

const SearchInput = styled.input`
	height: calc(2.0em + 0.75rem + 2px);
	width: 100%;
	border-color: transparent;
  background-color: #fff;
	&:focus {
		outline: none;
	}
`

const ClearKeyword = styled.a`
	padding: 0.5rem;
	cursor: pointer;
`
const SearchButton = styled(CButton)`
	width: 120px;
	border-left: 1px solid #B0B6BA;
	@media screen and (max-width:${SCREEN.LAPTOP}px) {
    width: 60px;
  }
`
const menuStyle = {
	padding: '0',
	position: 'fixed',
	backgroundColor: 'rgba(255, 255, 255, 0.9)',
	maxHeight: '35vh',
	overflowY: 'auto',
	overflowX: 'hidden',
}

class SearchForm extends React.Component {

	render() {
		const {
			intl,
      pageNum,
      pageSize,
			searchSoftware,
			categoriesSelected,
      functionsSelected,
      brandsSelected,
			keyword,
			predictionList,
			setKeyword
		} = this.props

		return (

      <CInputGroup style={{ backgroundColor: '#fff', border: '1px solid #B0B6BA', borderRadius: '5px' }}>
        <Autocomplete
          items={predictionList}
          shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={item => item}
          renderItem={item => {
            return (
              <div key={item}><CListGroupItem style={{ textIndent: '2rem' }} key={item} href="#" onClick={() => {
								setKeyword(item)
                searchSoftware(item, categoriesSelected, functionsSelected, brandsSelected, pageNum, pageSize)
              }}>{item}</CListGroupItem></div>
            )
          }}
          wrapperStyle={{ flex: "1 1 auto" }}
					menuStyle={menuStyle}
          value={keyword}
          onChange={event => { 
						setKeyword(event.target.value)
					}}
          onSelect={value => { 
						setKeyword(value)
						searchSoftware(value, categoriesSelected, functionsSelected, brandsSelected, pageNum, pageSize)
					}}
		  isOptionEqualToValue={(option, value) =>
				value === undefined || value === "" || option.id === value.id
			}
          renderInput={props=> {
            return (
              <SearchInput className="searchinput inpage" type="text" id="input2-group2" name="input2-group2" placeholder={intl.formatMessage({ id: 'search.form'})}
								onKeyUp={(event) => { this.predictionSearch(event) }}
								onKeyPress={event => {
									if (event.code === 'Enter' || event.code === 'NumpadEnter') {
										searchSoftware(keyword, categoriesSelected, functionsSelected, brandsSelected, pageNum, pageSize)
									}
								}} {...props}></SearchInput>
            )
          }}
        />
				<ClearKeyword style={{ visibility: keyword? 'visible':'hidden' }} onClick={() => { searchSoftware('', categoriesSelected, functionsSelected, brandsSelected, pageNum, pageSize) }}><CIcon size="xl" name="cil-x" /></ClearKeyword>
        <CInputGroupAppend>
          <SearchButton style={{ }} type="button" color="success" onClick={() => {
            searchSoftware(keyword, categoriesSelected, functionsSelected, brandsSelected, pageNum, pageSize)
          }}>{intl.formatMessage({ id: 'search.button' })}</SearchButton>
        </CInputGroupAppend>
      </CInputGroup>
        
		)
	}
	predictionSearch = (event) => {
		let isShow = true
		if (event.target.value === "") {
			isShow = false
			this.props.setPredictionValues([])
		}
		this.props.setIshowPrediction(isShow)
		this.props.setKeyword(event.target.value)
		
		if (isShow) {
			this.props.doPredictionSearch(event.target.value)
		}
	}
	setPredictionValue = (event) => {
		this.props.setIshowPrediction(false)
		if (!event || !event.target) { return }
		this.props.setKeyword(event.target.text)
	}
}
SearchForm.defaultProps = {
	pageNum: 1,
	pageSize: 10
}

const mapStateToProps = state => ({
	softwareDetail: state.search.softwareDetail,
	keyword: state.search.keyword,
	categoriesSelected: state.search.categoriesSelected,
  functionsSelected: state.search.functionsSelected,
  brandsSelected: state.search.brandsSelected,
	searchCount: state.search.searchCount,
	prediction: state.search.prediction,
  predictionList: state.search.predictionList
})
const mapDispatchToProps = dispatch => ({
	searchSoftware: (q, categoriesSelected, functionsSelected, brandsSelected, pageNum, pageSize) => dispatch({
    type: 'searchSoftware',
		payload: {q, categoriesSelected, functionsSelected, brandsSelected, pageNum, pageSize}
  }),
	doPredictionSearch: (q) => dispatch({
    type: 'doPredictionSearch',
		payload: {q}
  }),
	setIshowPrediction: isShow => dispatch({
    type: 'SET_IS_SHOW_PREDICTION',
		payload: {prediction: isShow}
  }),
	setPredictionValues: predictionList => dispatch({
    type: 'SET_SEARCH_PREDICTION',
		payload: {predictionList}
  }),
	setKeyword: keyword =>  dispatch({
    type: 'SET_SEARCH_PREDICTION',
		payload: {keyword}
  })
})

export default compose(connect( mapStateToProps, mapDispatchToProps ), injectIntl )(SearchForm)