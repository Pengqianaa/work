import Error from "@mui/icons-material/Error";
import { styled } from "@mui/material/styles";

export const ErrorIcon = styled(Error)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: "var(--warning-color)",
  fontSize: "20px",
}));
