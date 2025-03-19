import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ImportButton as ImportButtonCSS } from "../AdminComponents/uiComponents/AdminCommonUis";
import CloudUpload from "@mui/icons-material/CloudUpload";
import { FormattedMessage } from "react-intl";
const ImportButton = (props) => {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    acceptedFiles.map((file) => props.upload(file));
  }, [acceptedFiles]);

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <ImportButtonCSS variant="contained" disabled={false} onClick={open}>
        {" "}
        <CloudUpload /> <FormattedMessage id="adminCommon.import" />
      </ImportButtonCSS>
    </div>
  );
};

export default ImportButton;
