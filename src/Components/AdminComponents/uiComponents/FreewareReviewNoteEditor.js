import React, { useState, memo, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { BUTTON_TYPES } from "src/Components/common";



const ReviewNoteEditor = memo(
  ({ show, item, onClose, labelText, dialogTitle,onSave,content }) => {
    const [note, setNote] = useState(content ?? "");
    const intl = {
      formatMessage: ({ id }) => {
        const messages = {
          "softwaresdpmgt.noteModal.title": dialogTitle,
          "softwaresdpmgt.noteModal.placeHolder": "输入审核备注",
        };
        return messages[id];
      },
    };
    // 当 item 变化时，重置状态
    useEffect(() => {
      setNote(content ?? "");
    }, [content]);


    const handleNoteChange = (e) => {
      setNote(e.target.value);
    };
    const handleSave = () => {
      onSave({
        note,
        formId: item?.formId ?? "",
      });
    };

    return (
      <Dialog
        open={show}
        onClose={onClose}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: 500,
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            position: "relative",
            paddingRight: 4,
          }}
        >
          {intl.formatMessage({ id: "softwaresdpmgt.noteModal.title" })}
          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey",
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <DialogContentText style={{ marginBottom: "10px" }}>
            Notes for review result：
          </DialogContentText>
          <TextField
            style={{ width: "100%", marginTop: "16px" }}
            id="outlined-multiline-static"
            label={intl.formatMessage({ id: "softwaresdpmgt.noteModal.title" })}
            multiline
            rows={4}
            defaultValue=""
            variant="outlined"
            disabled={labelText !== "revieeNote"}
            placeholder={intl.formatMessage({
              id: "softwaresdpmgt.noteModal.placeHolder",
            })}
            value={note}
            onChange={labelText === "revieeNote" &&handleNoteChange}
            inputProps={{ maxLength: 200 }}
          />
          <div style={{ marginLeft: "90%" }}>
            {note?.length ?? 0}/{200}
          </div>
        </DialogContent>
        <DialogActions style={{ marginLeft: "90%" }}>
          {labelText === "revieeNote" && (
            <Button
              style={{
                backgroundColor: "#00a0e9",
                color: "white",
              }}
              type={BUTTON_TYPES.SAVE}
              onClick={handleSave}
            >
              SAVE
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
);

export default ReviewNoteEditor;
