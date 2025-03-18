import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import pjson from '../../../package.json';
import moment from 'moment';

const TheFooter = (props) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: (theme) => theme.palette.background.paper, // 您可以根据需要更改背景颜色
        color: 'text.primary', // 使用主题中的文本颜色
        padding: '1rem', // 页脚内边距
      }}
      component="footer" // 确保这是一个 <footer> 元素
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" component="div">
          © {moment().format('YYYY')} Delta IT. All Rights Reserved. / version {pjson.version}
        </Typography>
      </Container>
    </Box>
  );
};

export default React.memo(TheFooter);