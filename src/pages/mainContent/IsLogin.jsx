import React from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getQueryString } from "../../Common/commonMethod";
import { Actions } from "../../Common/constants";

const IsLogin = ({ storeUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = location.search;
  React.useEffect(() => {
    const samlToken = search ? getQueryString(search, "SAMLResponse") : "";
    const nextUrl = search ? getQueryString(search, "nextUrl") : "../";
    if (samlToken) {
      storeUser(decodeURIComponent(samlToken));
    }
    setTimeout(() => {
      navigate(nextUrl);
    }, 100); // 确保 Redux 状态更新后再跳转
  }, [search, storeUser, navigate]);

  return null; // 无需渲染内容
};

const mapDispatchToProps = (dispatch) => ({
  storeUser: (token) => {
    dispatch({
      type: Actions.STORE_USER,
      payload: { token },
    });
  },
});


export default connect(null, mapDispatchToProps)(IsLogin);
