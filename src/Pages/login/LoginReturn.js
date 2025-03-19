import React from 'react'
import {
	CCard,
	CCardBody,
	CCardHeader,
	CCol,
	CDataTable,
	CRow
} from '@coreui/react'


const fields = ['key', 'value']
class LoginReturn extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			urlSearch: this.formatParam(this.props.location.search)
		}
	}
	formatParam = (search) => {
		let arr = search.split('&')
		let arr2 = arr.map((value, index) => {
			if (index === 0) {
				value = value.substr(1)
			}
			return value
		})
		let data = []
		arr2.forEach(element => {
			let attributeItem = element.split('=')
			data.push({
				key: attributeItem[0],
				value: attributeItem[1]
			})

		})
		return data
	}
	render() {
		return (
			<div>
				<h1>LoginReturn Page</h1>
				<button onClick={this.showState}>show state</button>
				<CRow>
					<CCol xs="12" lg="6">
						<CCard>
							<CCardHeader>
								ADFS Attribute
                            </CCardHeader>
							<CCardBody>
								<CDataTable
									items={this.state.urlSearch}
									fields={fields}
								/>
							</CCardBody>
						</CCard>
					</CCol>
				</CRow>
			</div>
		)
	}
	showState = () => {
		console.log(this.state)
	}
}
export default LoginReturn