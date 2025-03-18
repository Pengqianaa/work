import React from "react";
import { CFooter } from "@coreui/react";
import pjson from "../../../package.json";
import moment from "moment";

const Footer = () => (
  <CFooter id="admin-footer" fixed={false}>
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      <span style={{ textAlign: "center", color: "#fff" }}>
        &copy; {moment().format("YYYY")} Delta IT. All Rights Reserved. /
        version {pjson.version}
      </span>
    </div>
  </CFooter>
);

export default React.memo(Footer);
