import React from "react";

const Landing = React.lazy(() =>
  import("./components/AdminComponents/pages/Landing")
);

const adminRoutes = [
  { path: "/admin/", exact: true, name: "Landing", component: Landing },
];
export default adminRoutes;
