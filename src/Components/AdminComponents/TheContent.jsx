import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function TheContent() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Router>
        <Routes>
          <Route path="/task-info" element={<div>Task Info Page</div>} />
          <Route path="/license-apply" element={<div>License Apply Page</div>} />
          <Route path="/auto-approved" element={<div>Auto Approved Page</div>} />
          <Route path="/permission-mgt" element={<div>Permission Mgmt Page</div>} />
          <Route path="/license-mgt" element={<div>License Mgmt Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </Router>
    </Box>
  );
}