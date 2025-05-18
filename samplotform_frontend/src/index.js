import 'process/browser';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "./CSS/vars.scss";
import "./CSS/coreuiStyle.scss";
import "./CSS/custom.scss";
import "./CSS/admin.scss";
import { Actions } from "./Common/constants";
import Api from "./Common/api";
import { LastLocationProvider } from "react-router-last-location";
import Logger from "./Components/Logger";

// icons
import icons from "./assets/icons";

import BaseLayout from "./Components/BaseLayout";
import AdminLayout from "./Components/AdminLayout";
import Snackbar from "./Components/common/Snackbar";

// Pages
const Login = React.lazy(() => import("./Pages/login/Login"));
const LoginReturn = React.lazy(() => import("./Pages/login/LoginReturn"));
const Page403 = React.lazy(() => import("./Pages/page403/Page403"));
const Page404 = React.lazy(() => import("./Pages/page404/Page404"));
const Page500 = React.lazy(() => import("./Pages/page500/Page500"));
const IsLogin = React.lazy(() => import("./Pages/mainContent/IsLogin"));

React.icons = icons;

// coreui Contains
import { IntlProvider } from "react-intl";
import { Provider, useSelector } from "react-redux";
import { store, persistStore } from "./store";
import getLocaleData from "./i18n/_locale";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Root = () => {
  const locale = useSelector((state) => state.view.currentLocale);
  const [messages, setMessages] = useState(getLocaleData(navigator.language));

  useEffect(() => {
    store.dispatch({ type: Actions.SET_ISLOGPAGE, payload: false });
    setMessages(getLocaleData(locale));
  }, [locale]);
  useEffect(() => {
    let currentLocale = store.getState().view.currentLocale;
    if (!currentLocale) {
      store.dispatch({ type: Actions.SET_LOCALE, payload: navigator.language });
    }
  }, []);

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      defaultLocale="en"
      messages={messages}
    >
      <Router>
        <LastLocationProvider>
          <Logger />
          <React.Suspense fallback={loading}>
            <Switch>
              <Route
                exact
                path="/login"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/loginreturn"
                name="Login Return Page"
                render={(props) => <LoginReturn {...props} />}
              />
              <Route
                exact
                path="/403"
                name="Page 403"
                render={(props) => <Page403 {...props} />}
              />
              <Route
                exact
                path="/404"
                name="Page 404"
                render={(props) => <Page404 {...props} />}
              />
              <Route
                exact
                path="/500"
                name="Page 500"
                render={(props) => <Page500 {...props} />}
              />
              <Route
                exact
                path="/isLogin"
                name="isLogin Page"
                render={(props) => <IsLogin {...props} />}
              />
              <Route
                path="/admin"
                name="AdminLayout"
                render={(props) => <AdminLayout {...props} />}
              />
              {/* <Route path="/" name="TheLayout" render={props => <TheLayout {...props} />} /> */}
              <Route
                path="/"
                name="BaseLayout"
                render={(props) => <BaseLayout {...props} />}
              />
            </Switch>
          </React.Suspense>
          <Snackbar />
        </LastLocationProvider>
      </Router>
    </IntlProvider>
  );
};
// Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17
// ReactDOM.render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistStore}>
//       <Root />
//     </PersistGate>
//   </Provider>,
//   document.getElementById("root")
// );
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore}>
        <Root />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
