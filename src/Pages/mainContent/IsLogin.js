import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getQueryString } from "../../Common/commonMethod";
import { Actions } from "../../Common/constants";

class IsLogin extends React.Component {
  search = this.props.location.search;

  componentDidMount() {
    const samlToken = this.search
      ? getQueryString(this.search, "SAMLResponse")
      : "";
    if (samlToken) {
      this.props.storeUser(decodeURIComponent(samlToken));
    }
  }

  render() {
    const nextUrl = this.search
      ? getQueryString(this.search, "nextUrl")
      : "../";
    return <Redirect to={`${nextUrl}`} />;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  storeUser: (token) =>
    dispatch({
      type: Actions.STORE_USER,
      payload: { token },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(IsLogin);
