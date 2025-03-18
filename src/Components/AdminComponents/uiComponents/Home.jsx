import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, connect } from "react-redux";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ACTIONS } from '../../../Reducers/UserReducer'

const theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#e0e0e0', // 灰色背景
                    color: '#000000', // 黑色文字
                    fontWeight: 'bold', // 粗体
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#ffffff', // 单数行白色背景
                    },
                    '&:nth-of-type(even)': {
                        backgroundColor: '#f5f5f5', // 双数行浅灰色背景
                    },
                },
            },
        },
    },
});

const Home = props => {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0); // 管理当前选中的 Tab
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex); // 更新选中的 Tab 索引
    };
    useEffect(() => {
        // dispatch({
        //     type: ACTIONS.GET_USER,
        //   });
      }, []);
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false}>
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'lightgreen' }}>
                        Home
                    </Typography>
                    {/* 添加 Tabs，调整到右侧 */}
                    <Box display="flex" justifyContent="flex-end">
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabChange}
                            centered={false} // 确保 Tabs 不居中
                            sx={{
                                marginLeft: 'auto', // 推动到右侧
                            }}
                        >
                            <Tab label="Home" />
                            {/* <Tab label="Other Info" /> */}
                        </Tabs>
                    </Box>
                    {/* Tab 内容 */}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

const mapStateToProps = state => ({
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
