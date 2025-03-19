import React, { Suspense, memo } from "react";
import { Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";
import adminRoutes from "src/adminRoutes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Content = (layoutProps) => {
  return (
    <main
      className="c-main"
      style={{ paddingLeft: "inherit 0 !important", width: "100%" }}
    >
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {adminRoutes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => {
                      let obj = Object.assign({}, layoutProps, props);
                      return (
                        <CFade>
                          <route.component {...obj} />
                        </CFade>
                      );
                    }}
                  />
                )
              );
            })}
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default memo(Content);
