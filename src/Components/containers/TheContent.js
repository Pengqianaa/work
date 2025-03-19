import React, { useState, useEffect, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";
// routes config
import routes from "../../routes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = (layoutProps) => {
  const { functions } = layoutProps;
  const [enableRoutes, setEnableRoutes] = useState([]);

  useEffect(() => {
    if (functions && Object.keys(functions).length) {
      const { home, search, myApp, myRequest } = functions;
      const userEnables = [home, search, myApp, myRequest].reduce(
        (prev, curr) => ({ ...prev, [curr.fucntionCode]: curr.userEnable }),
        {}
      );
      const enableRouteList = routes.map((route) => ({
        ...route,
        userEnable: route.key === "isLogin" ? true : userEnables[route.key],
      }));
      setEnableRoutes(enableRouteList);
    }
  }, [functions]);

  return (
    <main className="c-main" style={{ paddingLeft: "inherit 0 !important" }}>
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {enableRoutes.length &&
              enableRoutes?.map(
                (route) =>
                  route.component &&
                  route.userEnable && (
                    <Route
                      key={route.key}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props) => (
                        <CFade>
                          <route.component {...{ ...layoutProps, ...props }} />
                        </CFade>
                      )}
                    />
                  )
              )}
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
