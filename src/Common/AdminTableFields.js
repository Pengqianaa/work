import moment from "moment";
import LogoImage from "../Components/uiComponents/LogoImage";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import LinkIcon from "@mui/icons-material/Link";
import { FormattedMessage } from "react-intl";
import { sdpUrl, backServerIP } from "./common";
import { TableCell } from "@mui/material";
import { Chip } from "@mui/material/";

const flowCodeInstall = process.env.REACT_APP_SDP_FLOW_CODE_INSTALL;
const flowCodeUninstall = process.env.REACT_APP_SDP_FLOW_CODE_UNINSTALL;

const sprUrl = process.env.REACT_APP_SAM_PORTAL_SPR_FORM;
const viewCallback = (el) => {
  if (!el) {
    return "-";
  }
  return el;
};
const EFormQueryCols = [
  {
    id: "sourceId",
    label: "Stock ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "softwareName",
    label: "Product Name",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "empCode",
    label: "Employee ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "ntAccount",
    label: "Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "empName",
    label: "Name",
    minWidth: 70,
    viewCallback,
  },
  {
    id: "applyComputer",
    label: "Computer Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sourceInstallId",
    label: "SPR ID",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      let url = `${sprUrl}?FlowCode=${flowCodeInstall}&InstanceCode=${el}&ToCode=1`;
      return (
        <a target="_blank" href={url}>
          {el}
        </a>
      );
    },
  },
  {
    id: "sourceUninstallId",
    label: "SPR ID",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      let url = `${sprUrl}?FlowCode=${flowCodeUninstall}&InstanceCode=${el}&ToCode=1`;
      return (
        <a target="_blank" href={url}>
          {el}
        </a>
      );
    },
  },
  {
    id: "installTime",
    label: "Installation Date",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY/MM/DD");
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
  {
    id: "uninstallTime",
    label: "Uninstallation Date",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY/MM/DD");
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
  {
    id: "areaEname",
    label: "Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bgShortName",
    label: "BG",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "buShortName",
    label: "BU",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "deptEname",
    label: "Department",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "costDeptCode",
    label: "Cost Center",
    minWidth: 100,
    viewCallback,
  },
];
const ExcelCols = [
  {
    id: "sourceId",
    label: "Stock ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "softwareName",
    label: "Product Name",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "empCode",
    label: "Employee ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "ntAccount",
    label: "Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "empName",
    label: "Name",
    minWidth: 70,
    viewCallback,
  },
  {
    id: "applyComputer",
    label: "Computer Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sourceInstallId",
    label: "SPR ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sourceUninstallId",
    label: "SPR ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "excelInstallTime",
    label: "Installation Date",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY-MM-DD");
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
  {
    id: "excelUninstallTime",
    label: "Uninstallation Date",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY-MM-DD");
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
  {
    id: "areaEname",
    label: "Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bgShortName",
    label: "BG",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "buShortName",
    label: "BU",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "deptEname",
    label: "Department",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "costDeptCode",
    label: "Cost Center",
    minWidth: 100,
    viewCallback,
  },
];
const ExcelOngoingCols = [
  {
    id: "sprId",
    label: "SPR ID",
    minWidth: 100,
    viewCallback: (el, obj) => {
      if (!el) {
        return "-";
      }
      return el;
    },
  },
  {
    id: "stockId",
    label: "Stock ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "excelType",
    label: "Type",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "nextHandler",
    label: "Next Handler",
    minWidth: 170,
    viewCallback,
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "productName",
    label: "Product Name",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "empCode",
    label: "Employee ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "account",
    label: "Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "userName",
    label: "Name",
    minWidth: 70,
    viewCallback,
  },
  {
    id: "computerName",
    label: "Computer Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applyDate",
    label: "Apply Date",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY-MM-DD");
    },
  },
  {
    id: "area",
    label: "Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bg",
    label: "BG",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bu",
    label: "BU",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "department",
    label: "Department",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "costCenter",
    label: "Cost Center",
    minWidth: 100,
    viewCallback,
  },
];
const EFormQueryOngoingCols = [
  {
    id: "sprId",
    label: "SPR ID",
    minWidth: 100,
    viewCallback: (el, obj) => {
      if (!el) {
        return "-";
      }
      let url = "";
      if (obj.type === 1) {
        url = `${sprUrl}?FlowCode=${flowCodeInstall}&InstanceCode=${el}&ToCode=1`;
      } else if (obj.type === 2) {
        url = `${sprUrl}?FlowCode=${flowCodeUninstall}&InstanceCode=${el}&ToCode=1`;
      }
      return (
        <a target="_blank" href={url}>
          {el}
        </a>
      );
    },
  },
  {
    id: "stockId",
    label: "Stock ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "type",
    label: "Type",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return <FormattedMessage id={`eformquery.tab${el}`} />;
    },
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "nextHandler",
    label: "Next Handler",
    minWidth: 170,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return (
        <div>
          {el.split(";").map((elem) => {
            return <p style={{ margin: "0", lineHeight: "14px" }}>{elem}</p>;
          })}
        </div>
      );
    },
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "productName",
    label: "Product Name",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "empCode",
    label: "Employee ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "account",
    label: "Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "userName",
    label: "Name",
    minWidth: 70,
    viewCallback,
  },
  {
    id: "computerName",
    label: "Computer Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applyDate",
    label: "Apply Date",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY/MM/DD");
    },
  },
  {
    id: "area",
    label: "Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bg",
    label: "BG",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bu",
    label: "BU",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "department",
    label: "Department",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "costCenter",
    label: "Cost Center",
    minWidth: 100,
    viewCallback,
  },
];

const SoftwareInfoCols = [
  {
    id: "areaName",
    label: "RegionArea",
    minWidth: 100,
    viewCallback,
  },
  {
    id: 'softwareId', label: 'StockID/FreewareID', minWidth: 100, viewCallback
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "productName",
    label: "Product Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "installationPath",
    label: "Installation Path",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "licensesSn",
    label: "Licenses SN",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "modifiedUserName",
    label: "Modified by",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "modifiedTime",
    label: "Modified",
    minWidth: 100,
    viewCallback,
  },
];

const TrialwareInfoCols = [
  {
    id: "regionArea",
    label: "RegionArea",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpId",
    label: "SDP ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "brand",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "productName",
    label: "Product Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "installationPath",
    label: "Installation Path",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "licensesSn",
    label: "Licenses SN",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "model",
    label: "Module",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "effectiveDate",
    label: "Effective Date",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY/MM/DD");
    },
  },
  {
    id: "approvalInfo",
    label: "Approval Info",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "modifiedBy",
    label: "Modified by",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "lastUpdateDate",
    label: "Modified",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY/MM/DD");
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
];

const PermissionMgtCols = [
  {
    id: "account",
    label: "Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "userName",
    label: "Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "roleName",
    label: "Group",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "remark",
    label: "Remark",
    minWidth: 100,
    viewCallback,
  },
];

const VipListMgtCols = [
  {
    id: "userAdAccount",
    label: "Applicant Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "userEmpName",
    label: "Applicant Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "userEmpCode",
    label: "Applicant EmpCode",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "userTerminateDate",
    label: "Applicant Terminate Date",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "agentAdAccount",
    label: "Agent Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "agentEmpName",
    label: "Agent Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "agentEmpCode",
    label: "Agent EmpCode",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "agentTerminateDate",
    label: "Agent Terminate Date",
    minWidth: 100,
    viewCallback,
  },
];

const TechnicianMgtCols = [
  {
    id: "groupName",
    label: "Group",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "factoryCode",
    label: "SiteCode",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpSite",
    label: "SDP Site",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "technician",
    label: "Technician",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpArea",
    label: "SDP Area",
    minWidth: 100,
    viewCallback,
  },
];

const SoftwareInfoTabCols = [
  {
    id: "sourceNumber",
    label: "Stock ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "assetName",
    label: "Product Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "graph",
    label: "Graph",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return (
        <LogoImage
          style={{ width: "20px" }}
          src={`${backServerIP}/image/show/${el}`}
        ></LogoImage>
      );
    },
  },
  {
    id: "assetDescTC",
    label: "Software Desc",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "assetDescEN",
    label: "Software Desc EN",
    minWidth: 200,
    viewCallback,
  },
  {
    id: "assetRefUrlTC",
    label: "Reference Source",
    minWidth: 50,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return (
        <a href={el} target="_blank">
          <LinkIcon />
        </a>
      );
    },
  },
  {
    id: "assetRefUrlEN",
    label: "Reference Source EN",
    minWidth: 50,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return (
        <a href={el} target="_blank">
          <LinkIcon />
        </a>
      );
    },
  },
  {
    id: "referencePrice",
    label: "Reference Price",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "referenceCurrency",
    label: "Reference Currency",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "isPublic",
    label: "Public",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "isValid",
    label: "Availible",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "expectedQty",
    label: "License Quantity",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "installUserQty",
    label: "License User Qty",
    minWidth: 100,
    viewCallback,
  },
];

const SCCMTabCols = [
  {
    id: "viewRegionArea",
    label: "Region Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "StockID",
    label: "Stock ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "ProductName",
    label: "ProductName",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "Brand",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "SCCMName",
    label: "SCCM Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "SCCMFolderPath",
    label: "SCCM Folder Path",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "ModifiedBy",
    label: "Modified By",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "Modified",
    label: "Modified",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY/MM/DD");
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
];

const LicenseTabCols = [
  {
    id: "viewRegionArea",
    label: "Region Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "StockID",
    label: "Stock ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "ProductName",
    label: "Product Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "Brand",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "ServerName",
    label: "ServerName",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "OPTFilePath",
    label: "OPT File Path",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "OPTFileIndexKey",
    label: "OPT File Index Key",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "ModifiedBy",
    label: "Modified By",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "Modified",
    label: "Modified",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return moment(el).format("YYYY/MM/DD");
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
];

const InstallationPathCols = [
  {
    id: "areaName",
    label: "RegionArea",
    minWidth: 100,
    viewCallback,
  },
  // {
  //   id: "stockId",
  //   label: "Stock ID",
  //   minWidth: 100,
  //   viewCallback,
  // },
  {
    id: 'softwareId', label: 'StockID/FreewareID', minWidth: 100, viewCallback
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "productName",
    label: "Product Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "installationPath",
    label: "Installation Path",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "licensesSn",
    label: "Licenses SN",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "modifiedUserName",
    label: "Modified by",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "modifiedTime",
    label: "Modified",
    minWidth: 100,
    viewCallback,
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
];

const SDPManual = [
  {
    id: "eForm",
    label: "E-Form",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "type",
    label: "Type",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "area",
    label: "Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bgbu",
    label: "BGBU",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "department",
    label: "Department",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applicant",
    label: "Applicant",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "reason",
    label: "Reason",
    minWidth: 100,
    viewCallback,
  },
];

const SDPUnprocessed = [
  {
    id: "eForm",
    label: "E-Form",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "closedAll",
    label: "完成度 (Closed / All )",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "type",
    label: "Type",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "area",
    label: "Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bgbu",
    label: "BGBU",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "department",
    label: "Department",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applicant",
    label: "Applicant",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "reason",
    label: "Reason",
    minWidth: 100,
    viewCallback,
  },
];

const SDPProcessed = [
  {
    id: "eForm",
    label: "E-Form",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "type",
    label: "Type",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "area",
    label: "Area",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "bgbu",
    label: "BGBU",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "department",
    label: "Department",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applicant",
    label: "Applicant",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "reason",
    label: "Reason",
    minWidth: 40,
    viewCallback,
  },
];

// Manual
// StockID ProductName Account Computer Name 是否為VIP名單 SCCM是否已打包 是否離職  自動派送結果
const SDPManualSub = [
  {
    id: "stockID",
    label: "StockID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "productName",
    label: "ProductName",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "account",
    label: "Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "computerName",
    label: "Computer Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "isVip",
    label: "是否為VIP名單",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sccmPacked",
    label: "SCCM是否已打包",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "isTerminated",
    label: "是否離職",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "result",
    label: "自動派送結果",
    minWidth: 100,
    viewCallback,
  },
];

// Unprocessed
// SDP_Status SDP_Case_ID Subject Vendor Solution CreatTime UpdateTime SPR Info Operate
const SDPUnprocessedSub = [
  {
    id: "sdpCaseId",
    label: "SDP_Case_ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpStatus",
    label: "SDP_Status",
    minWidth: 80,
    viewCallback,
  },
  {
    id: "subject",
    label: "Subject",
    minWidth: 180,
    viewCallback,
  },
  {
    id: "vendor",
    label: "Vendor",
    minWidth: 180,
    viewCallback,
  },
  {
    id: "solution",
    label: "Solution",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "creatTime",
    label: "CreateTime",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "updateTime",
    label: "UpdateTime",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sprInfo",
    label: "SPR Info",
    minWidth: 100,
    viewCallback,
  },
];
// processed
// StockID ProductName Account ComputerName SDP_Case_ID SDP_Status Vendor Solution ClosedTime SmartItInfo
const SDPProcessedSub = [
  {
    id: "stockID",
    label: "StockID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "productName",
    label: "ProductName",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "account",
    label: "Account",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "computerName",
    label: "ComputerName",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpCaseId",
    label: "SDP_Case_ID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpStatus",
    label: "SDP_Status",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "vendor",
    label: "Vendor",
    minWidth: 180,
    viewCallback,
  },
  {
    id: "solution",
    label: "Solution",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "closedTime",
    label: "ClosedTime",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "smartItInfo",
    label: "SmartItInfo",
    minWidth: 100,
    viewCallback,
  },
];
const SDPProcessedExportCols = [
  {
    id: "formId",
    label: "form_id",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "caseId",
    label: "case_id",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applicantNtAccount",
    label: "applicantNtAccount",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applyComputer",
    label: "applyComputer",
    minWidth: 180,
    viewCallback,
  },
  {
    id: "stockId",
    label: "stockId",
    minWidth: 80,
    viewCallback,
  },
  {
    id: "productName",
    label: "productName",
    minWidth: 180,
    viewCallback,
  },
  {
    id: "applyReason",
    label: "applyReason",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpTitle",
    label: "sdp_title",
    minWidth: 100,
    viewCallback,
    // }, {
    //   id: 'sdpStatus', label: 'sdp_status', minWidth: 100, viewCallback: (el) => {
    //     if (!el) { return '-' }
    //     return el
    //   }
  },
  {
    id: "type",
    label: "type",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "createTime",
    label: "create_time",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "lastUpdateDate",
    label: "last_update_date",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpResolution",
    label: "sdp_resolution",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpHandleStatus",
    label: "sdp_handle_status",
    minWidth: 100,
    viewCallback,
  },
];

const SDPUnprocessedExportCols = [
  {
    id: "formId",
    label: "form_id",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdpCaseId",
    label: "case_id",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "applicantNtAccount",
    label: "applicantNtAccount",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "subject",
    label: "applyComputer",
    minWidth: 180,
    viewCallback,
  },
  {
    id: "stockId",
    label: "stockId",
    minWidth: 80,
    viewCallback,
  },
  {
    id: "productName",
    label: "productName",
    minWidth: 180,
    viewCallback,
  },
  {
    id: "applyReason",
    label: "applyReason",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdp_title",
    label: "sdp_title",
    minWidth: 100,
    viewCallback,
    // }, {
    //   id: 'sdp_status', label: 'sdp_status', minWidth: 100, viewCallback: (el) => {
    //     if (!el) { return '-' }
    //     return el
    //   }
  },
  {
    id: "type",
    label: "type",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "Quantity",
    label: "Quantity",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "create_time",
    label: "create_time",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "last_update_date",
    label: "last_update_date",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdp_resolution",
    label: "sdp_resolution",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sdp_handle_status",
    label: "sdp_handle_status",
    minWidth: 100,
    viewCallback,
  },
];
const SwInfoMaintainTabTabCols = [
  {
    id: "source",
    label: "Source",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "stockId",
    label: "StockID",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "brandName",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "assetName",
    label: "Product Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "referencePriceTWD",
    label: "reference_price(TWD)",
    minWidth: 100,
    viewCallback: (el) => {
      return el;
    },
  },
  {
    id: "referencePriceUSD",
    label: "reference_price(US)",
    minWidth: 100,
    viewCallback: (el) => {
      return el;
    },
  },
  {
    id: "mainFlag",
    label: "MainFlag",
    minWidth: 100,
    viewCallback: (el) => {
      return el ? 1 : 0;
    },
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    viewCallback: (el) => {
      return <Switch checked={el} color="primary" />;
    },
    sortingFunc: (a, b, isASC) => {
      let result = moment(a).isAfter(moment(b));
      return result ? (isASC ? 1 : -1) : isASC ? -1 : 1;
    },
  },
];
const SWAssetFreewareCols = [
  {
    id: "freewareCode",
    label: "Freeware Code",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "name",
    label: "Name",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "edition",
    label: "Edition",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "version",
    label: "Version",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "brand",
    label: "Brand",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "categoryList",
    label: "Category",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }

      return el;
    },
  },
  {
    id: "graph",
    label: "Graph",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return (
        <LogoImage
          style={{ width: "60%" }}
          src={`${backServerIP}/image/show/${el}`}
        ></LogoImage>
      );
    },
  },
  {
    id: "desc",
    label: "Software Desc",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "descEn",
    label: "Software Desc EN",
    minWidth: 100,
    viewCallback,
  },
  {
    id: "sourceURL",
    label: "Source Url",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }
      return (
        <a target="_blank" href={el}>
          {el}
        </a>
      );
    },
  },
  {
    id: "listType",
    label: "List Type",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }else{
        return <FormattedMessage id={`swassetmgt.freewareTab.listType${el}`} />
      }
    },
  },
  {
    id: "reason",
    label: "Reason",
    minWidth: 100,
  },
  {
    id: "installType",
    label: "Install Type",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }else{
        return <FormattedMessage id={`swassetmgt.freewareTab.installType${el}`} />
      }
    },
  },
  {
    id: "applyType",
    label: "Apply Type",
    minWidth: 100,
    viewCallback: (el) => {
      if (!el) {
        return "-";
      }else{
        return <FormattedMessage id={`swassetmgt.freewareTab.applyType${el}`} />
      }
    },
  },
  {
    id: "valid",
    label: "is_valid",
    minWidth: 100,
    viewCallback,
  },
];
const EFormErrorCols = [
  {
    id: "eForm",
    label: "E-Form",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "errorType",
    label: "Error Type",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "cause",
    label: "Cause",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "causeDetail",
    label: "Cause Detail",
    minWidth: 100,
    viewCallback,
    whiteSpace: "pre",
  },
  {
    id: "dateTime",
    label: "Datetime",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
];

export default {
  EFormQueryCols,
  EFormQueryOngoingCols,
  ExcelCols,
  ExcelOngoingCols,
  SoftwareInfoCols,
  TrialwareInfoCols,
  PermissionMgtCols,
  VipListMgtCols,
  TechnicianMgtCols,
  SoftwareInfoTabCols,
  SCCMTabCols,
  LicenseTabCols,
  InstallationPathCols,

  SDPManual,
  SDPUnprocessed,
  SDPProcessed,
  SDPManualSub,
  SDPUnprocessedSub,
  SDPProcessedSub,
  SDPUnprocessedExportCols,
  SDPProcessedExportCols,

  SwInfoMaintainTabTabCols,
  SWAssetFreewareCols,
  EFormErrorCols,
};
