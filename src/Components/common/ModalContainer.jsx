import React from "react";
import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import MuiDialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
const PREFIX = 'ModalContainer';

const classes = {
  root: `${PREFIX}-root`,
  closeButton: `${PREFIX}-closeButton`
};

const DialogTitle = ((props) => {
  const { children,  onClose, ...rest } = props;
  return (
    <div className={classes.root} style={{margin: 0,
      padding: 14}} {...rest}>
      <Typography variant="h6">{children}</Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
        size="large">
        <CloseIcon />
      </IconButton>
    </div>
  );
});

const StyledDialogTitle = styled(DialogTitle)((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    margin: 0,
    padding: theme.spacing(2),
  },

  [`& .${classes.closeButton}`]: {
    position: "absolute",
    // 升级UI包，先注解
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],

    "&:focus": {
      outline: "none",
    },
  }
}));

const ModalContainer = ({
  open = false,
  setOpen,
  maxWidth = "sm",
  title = "",
  children,
  buttons,
  ...rest
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') { return }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={maxWidth}
      onClose={handleClose}
      BackdropComponent={() => null}
      {...rest}
    >
      <StyledDialogTitle onClose={handleClose} {...rest}>
        <span>{title}</span>
      </StyledDialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </DialogContent>
      <DialogActions>{buttons}</DialogActions>
    </Dialog>
  );
};

export default React.memo(ModalContainer);
