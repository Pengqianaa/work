import React, { useState, useEffect, memo } from "react";
import { FormattedMessage } from "react-intl";
// import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { IconButton, Button, Link } from "@mui/material";
import {
  SearchRounded as SearchRoundedIcon,
  CloudUpload as CloudUploadRoundedIcon,
  CloudDownload as CloudDownloadRoundedIcon,
  BackupRounded as BackupRoundedIcon,
  LockRounded as LockRoundedIcon,
  LockOpenRounded as LockOpenRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  EditRounded as EditRoundedIcon,
  LinkRounded as LinkRoundedIcon,
  AddRounded as AddRoundedIcon,
} from "@mui/icons-material/index";
import { styled } from "@mui/material/styles";

export const BUTTON_TYPES = {
  SEARCH: "SEARCH",
  IMPORT: "IMPORT",
  EXPORT: "EXPORT",
  LOCK: "LOCK",
  UNLOCK: "UNLOCK",
  UPDATE: "UPDATE",
  ADD: "ADD",
  DELETE: "DELETE",
  EDIT: "EDIT",
  SAVE: "SAVE",
  CONFIRM: "CONFIRM",
  CANCEL: "CANCEL",
  FETCH: "FETCH",
  DOWNLOAD_EXAMPLE: "DOWNLOAD_EXAMPLE",
  LOCK_UPDATE:"LOCK_UPDATE",
  TEMPLATE:"TEMPLATE",
};

const BUTTON_COLOR = {
  BLUE: "blue",
  GREEN: "green",
  GRAY: "gray",
  RED: "red",
  YELLOW: "yellow",
  LIGHT_GREEN:"lightGreen"
};

const StyledLink = styled("div")({
  display: "inline-block",
  lineHeight: 2,
  "> button": {
    "&:hover": {
      color: "var(--warning-color)",
    },
    "&[disabled]": {
      color: "rgba(0, 0, 0, 0.40)",
      cursor: "not-allowed",
    },
    svg: {
      marginBottom: "2px",
    },
  },
});

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "btnColor",
})(({ theme, btnColor = BUTTON_COLOR.RED }) => ({
  color: `var(--${btnColor}-icon-bottom)`,
  padding: 0,
  "&:hover": {
    backgroundColor: "transparent",
    color: `var(--${btnColor}-icon-bottom-hover)`,
  },
  "&[disabled]": {
    cursor: "not-allowed",
  },
}));

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "btnColor",
})(({ theme, btnColor = BUTTON_COLOR.BLUE }) => ({
  backgroundColor: `var(--delta-${btnColor})`,
  "&:hover": {
    backgroundColor: `var(--delta-${btnColor}-hover)`,
    borderColor: `var(--delta-${btnColor}-hover)`,
  },
  "&[disabled]": {
    cursor: "not-allowed",
  },
}));

const StyledInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const LockButton = ({ className, style, disabled = false, onClick }) => {
  const text = BUTTON_TYPES.LOCK_UPDATE ;

  const click = () => {
    onClick && onClick();
  };

  return (
    <StyledButton
      variant="contained"
      startIcon={ <LockRoundedIcon />}
      btnColor={BUTTON_COLOR.YELLOW}
      aria-label={text}
      disabled={disabled}
      onClick={click}
      {...(className && { className })}
      {...(style && { style })}
    >
      <FormattedMessage id={`COMMON.BUTTON.${text}`} />
    </StyledButton>
  );
};

const ToggleLockButton = ({ className, style, disabled = false, onClick }) => {
  const [lock, setLock] = useState(false);
  const text = lock ? BUTTON_TYPES.LOCK : BUTTON_TYPES.UNLOCK;

  const click = () => {
    setLock((prev) => !prev);
    onClick && onClick();
  };

  return (
    <StyledButton
      variant="contained"
      startIcon={lock ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}
      aria-label={text}
      disabled={disabled}
      onClick={click}
      {...(className && { className })}
      {...(style && { style })}
    >
      <FormattedMessage id={`COMMON.BUTTON.${text}`} />
    </StyledButton>
  );
};

const UploadButton = ({ className, style, disabled, onUpload }) => {
  const { inputRef, getRootProps, getInputProps, open, acceptedFiles } =
    // useDropzone({
    //   // Disable click and keydown behavior
    //   noClick: true,
    //   noKeyboard: true,
    // });

  useEffect(() => {
    acceptedFiles.map((file) => onUpload(file));
    inputRef.current.value = "";
  }, [acceptedFiles]);

  return (
    <div
      style={{ display: "inline" }}
      {...getRootProps({ className: "dropzone" })}
    >
      <StyledButton
        component="label"
        tabIndex={-1}
        role={undefined}
        btnColor={BUTTON_COLOR.GREEN}
        variant="contained"
        startIcon={<CloudUploadRoundedIcon />}
        aria-label={BUTTON_TYPES.IMPORT}
        disabled={disabled}
        {...(className && { className })}
        {...(style && { style })}
      >
        <FormattedMessage id="COMMON.BUTTON.IMPORT" />
        <StyledInput type="file" {...getInputProps()} />
      </StyledButton>
    </div>
  );
};

const TemplateButton = ({ className, style, disabled, onUpload }) => {
  const { inputRef, getRootProps, getInputProps, open, acceptedFiles } =
    // useDropzone({
    //   // Disable click and keydown behavior
    //   noClick: true,
    //   noKeyboard: true,
    // });

  useEffect(() => {
    acceptedFiles.map((file) => onUpload(file));
    inputRef.current.value = "";
  }, [acceptedFiles]);

  return (
    <div
      style={{ display: "inline" }}
      {...getRootProps({ className: "dropzone" })}
    >
      <StyledButton
        component="label"
        tabIndex={-1}
        role={undefined}
        btnColor={BUTTON_COLOR.LIGHT_GREEN}
        variant="contained"
        startIcon={<CloudUploadRoundedIcon />}
        aria-label={BUTTON_TYPES.TEMPLATE}
        disabled={disabled}
        {...(className && { className })}
        {...(style && { style })}
      >
        <FormattedMessage id="COMMON.BUTTON.TEMPLATE" />
        <StyledInput type="file" {...getInputProps()} />
      </StyledButton>
    </div>
  );
};

const Buttons = ({
  type = BUTTON_TYPES.SEARCH,
  className,
  style,
  disabled = false,
  onClick,
  onUpload,
}) => {
  const isIconButton =
    type === BUTTON_TYPES.DELETE || type === BUTTON_TYPES.EDIT;
  const text = isIconButton ? null : (
    <FormattedMessage id={`COMMON.BUTTON.${type}`} />
  );
  const click = () => {
    onClick && onClick();
  };

  switch (type) {
    case BUTTON_TYPES.DELETE:
    case BUTTON_TYPES.EDIT:
      const isEdit = type === BUTTON_TYPES.EDIT;
      return (
        <StyledIconButton
          size="large"
          aria-label={type}
          btnColor={isEdit ? BUTTON_COLOR.GREEN : BUTTON_COLOR.RED}
          disabled={disabled}
          onClick={click}
          {...(className && { className })}
          {...(style && { style })}
        >
          {isEdit ? <EditRoundedIcon /> : <DeleteRoundedIcon />}
        </StyledIconButton>
      );
    case BUTTON_TYPES.DOWNLOAD_EXAMPLE:
      return (
        <StyledLink onClick={click}>
          <Link
            href="#"
            component="button"
            underline="none"
            color="var(--warning-color)"
            disabled={disabled}
            {...(className && { className })}
            {...(style && { style })}
          >
            <LinkRoundedIcon />
            <FormattedMessage id="ADMIN.COMMON.BUTTON.DOWNLOAD_SAMPLE_FILE" />
          </Link>
        </StyledLink>
      );
    case BUTTON_TYPES.IMPORT:
      return (
        <UploadButton
          disabled={disabled}
          onUpload={onUpload}
          {...(className && { className })}
          {...(style && { style })}
        />
      );
     case BUTTON_TYPES.TEMPLATE:
        return (
          <TemplateButton
            disabled={disabled}
            onUpload={onUpload}
            {...(className && { className })}
            {...(style && { style })}
          />
        );  
    case BUTTON_TYPES.LOCK:
    case BUTTON_TYPES.UNLOCK:
      return (
        <ToggleLockButton
          disabled={disabled}
          onClick={click}
          {...(className && { className })}
          {...(style && { style })}
        />
      );
    case BUTTON_TYPES.LOCK_UPDATE:
      return (
        <LockButton
          disabled={disabled}
          onClick={click}
          {...(className && { className })}
          {...(style && { style })}
        />
      );
    case BUTTON_TYPES.CANCEL:
      return (
        <Button
          component="label"
          variant="outlined"
          aria-label={type}
          disabled={disabled}
          onClick={click}
          {...(className && { className })}
          {...(style && { style })}
        >
          {text}
        </Button>
      );
    // NOTE: add, update, confirm, save, fetch, export, search
    default: {
      let props = null;

      switch (type) {
        case BUTTON_TYPES.ADD:
          props = { startIcon: <AddRoundedIcon /> };
          break;
        case BUTTON_TYPES.SEARCH:
          props = { startIcon: <SearchRoundedIcon /> };
          break;
        case BUTTON_TYPES.EXPORT:
          props = {
            btnColor: BUTTON_COLOR.GREEN,
            startIcon: <CloudDownloadRoundedIcon />,
          };
          break;
        default:
          break;
      }

      return (
        <StyledButton
          variant="contained"
          aria-label={type}
          disabled={disabled}
          onClick={click}
          {...(props && { ...props })}
          {...(className && { className })}
          {...(style && { style })}
        >
          {text}
        </StyledButton>
      );
    }
  }
};

Buttons.propTypes = {
  type: PropTypes.oneOf([...Object.values(BUTTON_TYPES)]).isRequired,
  disabled: PropTypes.bool,
};

export default memo(Buttons);
