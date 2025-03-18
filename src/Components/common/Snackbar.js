import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { isJSON } from 'src/utils/methods/common';
import { Actions } from 'src/constants/common';

const Content = ({ data }) => (
	<>
		<span>{data.join(' ')}</span>
		<br />
	</>
);

const RenderContent = ({ data }) => {
	let _data = data;
	if (typeof data === 'string' && isJSON(data)) {
		_data = JSON.parse(data);
	}

	const type = typeof _data;

	if (type !== 'object') {
		return _data;
	}

	_data = Array.isArray(_data) ? _data : Object.entries(_data);

	return _data.map((d) => {
		if (typeof d !== 'object') {
			return <span>{d}</span>;
		}

		if (Array.isArray(d)) {
			return <Content key={d.join('')} data={d} />;
		}

		return Object.entries(d).map((_d) => (
			<Content key={_d.join('')} data={_d} />
		));
	});
};

const Snackbar = () => {
	const dispatch = useDispatch();
	const show = useSelector((state) => state.view.snackbarShow);
	const { message, autoHideDuration, msgType } = useSelector(
		(state) => state.view.snackbarProps
	);

	// msgType
	// 1,success 2,info 3,warming 4,error
	const toggle = (toggle) =>
		dispatch({
			type: Actions.TOGGLE_SNACKBAR,
			payload: toggle,
		});

	return (
		<MuiSnackbar
			open={show}
			autoHideDuration={autoHideDuration}
			onClose={() => toggle(false)}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}>
			<Alert
				onClose={() => toggle(false)}
				severity={msgType}
				sx={{ width: '100%' }}>
				<RenderContent data={message} />
			</Alert>
		</MuiSnackbar>
	);
};

export default Snackbar;
