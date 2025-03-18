/* Common Variable */


export const backServerIP = process.env.REACT_APP_API_URL
export const proecssServerIP = process.env.REACT_APP_API_POCESS_URL

export const rtcPackageID = 469  // rational packageId
export const rtcProdSerIP = process.env.REACT_APP_RTC_GRANT_API_URL// "http://localhost:3020"
export const rtcPA = process.env.REACT_APP_RTC_GRANT_PA_PATTERN
export const rtcTEAM = process.env.REACT_APP_RTC_GRANT_TEAM_PATTERN
export const rtcROLE = process.env.REACT_APP_RTC_GRANT_ROLE_PATTERN
export const rtcAdmin = process.env.REACT_APP_RTC_ADMIN_USER
export const rtcAdminPw = process.env.REACT_APP_RTC_ADMIN_PW
export const smartItDbWebApi = process.env.REACT_APP_SMART_IT_DB_WEB_API_URL

export const samLoginUrl = process.env.REACT_APP_SAM_ADFS_LOGIN_URL
export const samredirectUrl = process.env.REACT_APP_SAM_ADFS_REDIRECT_URL

export const sdpUrl = process.env.REACT_APP_SAM_SDP_URL

export const wProcess = {
	Search: 0,
	SelectSoftware: 1,
	CheckOut: 2,
	SoftwareRequest: 3,
	Installation: 4,
	Grant: 5,
	Closed: 6
}

export const wProcessName = {
	Search: 'Search',
	SelectSoftware: 'Check Software',
	CheckOut: 'Check Out',
	SoftwareRequest: 'Software Use Request',
	Installation: 'Installation',
	Grant: 'Grant',
	Closed: 'Closed'
}

export const wProcessFlowTip = {
	Search: '',
	SelectSoftware: 'Check item if you want to apply.',
	CheckOut: 'Fill in software action.',
	SoftwareRequest: 'Waiting for OA approval...',
	Installation: '',
	Grant: 'Check account license.',
	Closed: 'Sucess apply!'
}

export const workFlowProcess = {
	w1: [0, 1, 2, 3, 4, 6],
	w2: [0, 1, 2, 3, 4, 5, 6],
	w3: [0, 1, 2, 3, 5, 6]
}

export const pageRemindMsg = ['', '', '', 'Waiting for OA approval...', '', 'Starting auto grant process ...', 'Process completed!']

export const showWithDefault = (value, defaultValue) => {
	if (value && value !== null || value === 0) { return value }
	return defaultValue
}


