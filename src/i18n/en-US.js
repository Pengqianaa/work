import AutoApprovedMgt from "../components/AdminComponents/uiComponents/AutoApprovedMgt";

export default {
  COMMON: {
    BUTTON: {
      SEARCH: "Search",
      ADD: "Add",
      UPDATE: "Update",
      SAVE: "Save",
      DELETE: "Delete",
      CONFIRM: "Confirm",
      CANCEL: "Cancel",
      IMPORT: "Import",
      EXPORT: "Export",
      LOCK: "Lock",
      UNLOCK: "Unlock",
      FETCH: "Fetch",
      LOCK_UPDATE: "Lock Update",
      TEMPLATE: "Template",
    },
  },
  ADMIN: {
    COMMON: {
      BUTTON: {
        DOWNLOAD_SAMPLE_FILE: "Download sample file",
      },
    },
  },
  userProfile: {
    title: "User Profile",
    name: "Name",
    organization: "Organization",
    phone: "Phone",
    computer: "Computer",
    close: "Close",
  },
  adminCommon: {
    search: "Search",
    operate: "Operate",
    all: "ALL",
    save: "Save",
    rowsPerPage: "Rows per page",
  },
  locales: {
    "zh-TW": "繁體中文",
    "en-US": "English",
  },
  //---------new
  taskInfo: {
    id: 'Apply ID',
    applicationStatus: 'Review Status',
    applicantEmail: 'Email',
    applicantName: 'Name',
    licenseType: 'License',
    startDate: 'Start Date',
    endDate: 'End Date',
    applyDate: 'Apply Date'
  },
  permissionMgt: {
    TIPS: "Admin can manage License permissions, IT_Admin can grant access to features.",
    searchRole: "Please Enter Keywords",
  },
  AutoApprovedMgt: {
    applyId: 'Apply ID',
    reviewStatus: 'Review Status',
    name: 'Name',
    email: 'Email',
    license: 'License',
    startDate: 'Start Date',
    endDate: 'End Date',
    applyDate: 'Apply Date'
  },
  licenseMgt: {
    id: 'Apply ID',
    applicationStatus: 'Review Status',
    applicantEmail: 'Email',
    applicantName: 'Name',
    licenseType: 'License',
    startDate: 'Start Date',
    endDate: 'End Date',
    applyDate: 'Apply Date',
    applyReason: 'Apply Reason',
    failedReason: 'Failed Reason'
  },
};
