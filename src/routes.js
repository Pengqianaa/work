import React from "react";

const IsLogin = React.lazy(() => import("./Pages/mainContent/IsLogin"));
const MainPage = React.lazy(() =>
  import("./Components/pageComponents/MainPage")
);
const SearchPage = React.lazy(() =>
  import("./Components/pageComponents/SearchPage")
);
const MyApps = React.lazy(() => import("./Components/pageComponents/MyApps"));
const MyRequests = React.lazy(() =>
  import("./Components/pageComponents/MyRequests")
);

// console.log("process backend api url=" + process.env.REACT_APP_API_URL);
// console.log("process rtc api url=" + process.env.REACT_APP_RTC_GRANT_API_URL);

// key is defined in constant.js which is the function_code from SAM Function Mgt
const routes = [
  {
    key: "isLogin",
    path: "/isLogin",
    name: "Check Login Page",
    component: IsLogin,
  },
  {
    key: "home",
    path: "/",
    exact: true,
    name: "Main Page",
    component: MainPage,
  },
  {
    key: "search",
    path: "/search",
    name: "Search Content",
    component: SearchPage,
  },
  { key: "myApp", path: "/myapp", name: "My Apps", component: MyApps },
  {
    key: "myRequest",
    path: "/myrequest",
    name: "My Requests",
    component: MyRequests,
  },
];
export default routes;
