import moment from 'moment'; // 引入 moment

const viewCallback = (el) => {
  if (!el) {
    return "-";
  }
  return el;
};

const ReviewsList = [
  { id: "1", review: 'Approve' },
  { id: "2", review: 'To Be Confirmed' },
  { id: "3", review: 'Disapproved' },
  { id: "4", review: 'In Process' },
  { id: "5", review: 'Completed' },
  { id: "6", review: 'Deleted' },
  { id: "7", review: 'Failed' },
];

const TaskInfoCols = [
  {
    id: "id",
    label: "Apply ID",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "applicationStatus",
    label: "Review Status",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "applicantName",
    label: "Name",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "applicantEmail",
    label: "Email",
    minWidth: 100,
    viewCallback,
    whiteSpace: "pre",
  },
  {
    id: "licenseType",
    label: "License",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 130,
    viewCallback: (lastModified) => {
      // 使用 moment 格式化日期
      return moment(lastModified).format('YYYY-MM-DD');
    },
    whiteSpace: "",
  },
  {
    id: "endDate",
    label: "End Date",
    minWidth: 120,
    viewCallback: (lastModified) => {
      // 使用 moment 格式化日期
      return moment(lastModified).format('YYYY-MM-DD');
    },
    whiteSpace: "",
  },
  {
    id: "applyDate",
    label: "Apply Date",
    minWidth: 130,
    whiteSpace: "",
    viewCallback: (lastModified) => {
      // 使用 moment 格式化日期
      return moment(lastModified).format('YYYY-MM-DD');
    },
  },
];


const PermissionMgtCols = [
  {
    id: "userName",
    label: "Name",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "email",
    label: "Email",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "roleCode",
    label: "Role",
    minWidth: 100,
    whiteSpace: "",
    viewCallback: (role) => {
      // 确保 role 是数组格式
      const rolesArray = Array.isArray(role) ? role : [role];
      return (
        <div>
          {rolesArray.map((singleRole) => (
            <span
              key={singleRole} // 添加 key 属性优化 React 渲染
              style={{
                backgroundColor: 'rgb(188,222,249)', // 设置背景色
                color: 'rgb(66,32,66)', // 字体颜色
                borderRadius: '5px',
                padding: '2px 8px',
                margin: '0 4px', // 添加外边距以分隔角色标签
                display: 'inline-block',
              }}
            >
              {singleRole}
            </span>
          ))}
        </div>
      );
    },
  }

];

const AutoApprovedMgtCols = [
  {
    id: "rpaOrgName",
    label: "Org",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "isAutoApproved",
    label: "Is Auto Approved",
    minWidth: 100,
    viewCallback: (isAutoApproved) => {
      let text = 'N'
      if (isAutoApproved) {
        text = 'Y'
      }
      return text;
    },
    whiteSpace: "",
  },
  {
    id: "lastModifiedBy",
    label: "Last Updated By",
    minWidth: 100,
    whiteSpace: "",
    viewCallback,
  },
  {
    id: "lastModified",
    label: "Last Updated Time",
    minWidth: 100,
    whiteSpace: "",
    viewCallback: (lastModified) => {
      // 使用 moment 格式化日期
      return moment(lastModified).format('YYYY-MM-DD HH:mm:ss');
    },
  }
];

const LicenseMgtCols = [
  {
    id: "id",
    label: "Apply ID",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "applicationStatus",
    label: "Review Status",
    minWidth: 100,
    viewCallback,
    whiteSpace: "",
  },
  {
    id: "applicantName",
    label: "Name",
    minWidth: 100,
    whiteSpace: "",
    viewCallback,
  },
  {
    id: "applicantEmail",
    label: "Email",
    minWidth: 100,
    whiteSpace: "",
    viewCallback,
  },
  {
    id: "licenseType",
    label: "License",
    minWidth: 100,
    whiteSpace: "",
    viewCallback,
  },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 130,
    whiteSpace: "",
    viewCallback: (lastModified) => {
      // 使用 moment 格式化日期
      return moment(lastModified).format('YYYY-MM-DD');
    },
  },
  {
    id: "endDate",
    label: "End Date",
    minWidth: 120,
    whiteSpace: "",
    viewCallback: (lastModified) => {
      // 使用 moment 格式化日期
      return moment(lastModified).format('YYYY-MM-DD');
    },
  },
  {
    id: "applyDate",
    label: "Apply Date",
    minWidth: 130,
    whiteSpace: "",
    viewCallback: (lastModified) => {
      // 使用 moment 格式化日期
      return moment(lastModified).format('YYYY-MM-DD');
    },
  },
  {
    id: "applyReason",
    label: "Apply Reason",
    minWidth: 100,
    whiteSpace: "",
    viewCallback,
  },
  {
    id: "failedReason",
    label: "Failed Reason",
    minWidth: 100,
    whiteSpace: "",
    viewCallback,
  }
];

export default {
  TaskInfoCols,
  AutoApprovedMgtCols,
  PermissionMgtCols,
  LicenseMgtCols
};
