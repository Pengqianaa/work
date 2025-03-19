import { FormattedMessage } from "react-intl";
import { Chip } from "@mui/material/";
import { viewCallback, viewFormatDateCallback } from "src/utils/methods/common";
import { STATUS_TYPE, MOMENT_FORMAT } from "src/constants/common";

const DEFAULT_SORT_COL = "account";

const AuthorizationMgtCols = [
  {
    id: "account",
    label: "ACCOUNT",
    minWidth: 80,
    viewCallback,
  },
  {
    id: "name",
    label: "NAME",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "areaTexts",
    label: "AREA",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "bgbu",
    label: "BG_BU",
    minWidth: 200,
    // viewCallback
    viewCallback: (el) =>
      !el || el.length < 1 ? (
        "-"
      ) : (
        <>
          {el.map((e) => (
            <Chip key={e} size="small" style={{ margin: "2px" }} label={e} />
          ))}
        </>
      ),
  },
  {
    id: "costTexts",
    label: "COST_CENTER",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "brandTexts",
    label: "BRAND",
    minWidth: 100,
    viewCallback,
  },
];

export { DEFAULT_SORT_COL, AuthorizationMgtCols };
