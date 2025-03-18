import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { isJSON } from '../../utils/methods/common';
import { Actions } from '../../Common/constants';

const Content = React.memo(({ data }) => (
    <>
        <span>{data.join(' ')}</span>
        <br />
    </>
));

const RenderContent = React.memo(({ data }) => {
    if (!data) return null;

    let _data = data;
    if (typeof data === 'string' && isJSON(data)) {
        try {
            _data = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            return <span>{data}</span>;
        }
    }

    const type = typeof _data;
    if (type !== 'object') {
        return <span>{_data}</span>;
    }

    _data = Array.isArray(_data) ? _data : Object.entries(_data);
    return _data.map((d, index) => {
        if (typeof d !== 'object') {
            return <span key={index}>{d}</span>;
        }
        if (Array.isArray(d)) {
            return <Content key={index} data={d} />;
        }
        return Object.entries(d).map((_d, subIndex) => (
            <Content key={`${index}-${subIndex}`} data={_d} />
        ));
    });
});

const getSeverity = (msgType) => {
    switch (msgType) {
        case 1:
            return 'success';
        case 2:
            return 'info';
        case 3:
            return 'warning';
        case 4:
            return 'error';
        default:
            return 'info';
    }
};

const useSnackbar = () => {
    const dispatch = useDispatch();
    const toggleSnackbar = (toggle) => {
        dispatch({
            type: Actions.TOGGLE_SNACKBAR,
            payload: toggle,
        });
    };
    return toggleSnackbar;
};

const Snackbar = ({ position = { vertical: 'top', horizontal: 'center' }, defaultAutoHideDuration = 6000 }) => {
    const toggleSnackbar = useSnackbar();
    const show = useSelector((state) => state.view.snackbarShow);
    const { message, autoHideDuration, msgType } = useSelector((state) => state.view.snackbarProps);

    const handleClose = (event, reason) => {
        // 如果 autoHideDuration 是 null，並且關閉原因是點擊控件以外的地方，則不關閉
        if (autoHideDuration === null && reason === 'clickaway') {
            return;
        }
        // 否則，關閉 Snackbar
        toggleSnackbar(false);
    };

    return (
        <MuiSnackbar
            open={show}
            autoHideDuration={autoHideDuration === null ? undefined : autoHideDuration} // 如果 autoHideDuration 是 null，則不設置自動隱藏
            onClose={handleClose} // 自定義關閉邏輯
            anchorOrigin={position}
        >
            <Alert
                onClose={() => toggleSnackbar(false)} // Alert 的關閉按鈕仍然可以關閉 Snackbar
                severity={getSeverity(msgType)}
                sx={{ width: '100%' }}
            >
                <RenderContent data={message} />
            </Alert>
        </MuiSnackbar>
    );
};

export default Snackbar;