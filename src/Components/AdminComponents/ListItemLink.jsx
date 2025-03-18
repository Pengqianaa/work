import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';

function ListItemLink(props) {
  return (
    <ListItem button component={RouterLink} to={props.to} {...props}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText primary={props.primary} />
    </ListItem>
  );
}

export default ListItemLink;