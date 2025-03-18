import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CContainer, CRow } from "@coreui/react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { Table } from "src/Components/admin/common";
import {
  SearchQueries,
  HeaderColumns,
  BodyColumns,
  ModIfyAuthorizationMgtModal,
} from "src/Components/admin/AuthorizationMgt/index";

import { SORTING_DIRECTION } from "src/constants/common";
import { DEFAULT_SORT_COL } from "src/constants/admin/AuthorizationMgt";
import { ACTIONS } from "src/Reducers/admin/AuthorizationMgtReducer";

const AuthorizationMgt = () => {
  const dispatch = useDispatch();
  const { sort, total, pageSize, totalPages } = useSelector(
    (state) => state.authorizationMgt
  );
  const [show, setShow] = useState(false);
  const [isASC, setIsASC] = useState(true);
  const [sortingColumn, setSortingColumn] = useState(DEFAULT_SORT_COL);

  const [params, setParams] = useState({
    keyword: "",
    pageNumber: 0,
    pageSize,
    sort,
  });
  const [editTarget, setEditTarget] = useState({});

  useEffect(() => {
    getAuthorizationMgtList();

    if (params.sort === sort) {
      setIsASC(true);
      setSortingColumn(DEFAULT_SORT_COL);
    }
  }, [params]);

  const getAuthorizationMgtList = () => {
    dispatch({
      type: ACTIONS.GET_AUTHORIZATION_MGT_LIST,
      payload: {
        ...params,
        pageNumber: params.pageNumber + 1,
      },
    });
  };

  const sortHandler = (property) => {
    // 判断点击的属性是否被点击过，第一次点击 sortingColumn和property不相同，asc为true，排序方式为升序，再次点击为降序
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);

    setParams((prev) => ({
      ...prev,
      sort: `${property},${
        asc ? SORTING_DIRECTION.ASC_LOWERCASE : SORTING_DIRECTION.DESC_LOWERCASE
      }`, // 拼接为查询要求格式
      pageNumber: 0,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: newPage,
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    setParams((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      pageNumber: 0,
    }));
  };

  const handleAdd = () => {
    setEditTarget({});
    setShow(true);
  };
  const handleEdit = (user) => {
    setEditTarget(user);
    setShow(true);
  };

  return (
    <CContainer>
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="eformauth.title" />
        </h1>
      </CRow>
      <CRow>
        <Table
          searchQueries={
            <SearchQueries
              params={params}
              setParams={setParams}
              toggle={setShow}
            />
          }
          headerColumns={
            <HeaderColumns
              sortingColumn={sortingColumn}
              direction={isASC ? "asc" : "desc"}
              onClick={sortHandler}
            />
          }
          bodyColumns={<BodyColumns toggle={setShow} />}
          queryResults={{ totalPages: totalPages, total: total }}
          showPagination={true}
          page={params.pageNumber}
          rowsPerPage={params.pageSize}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
        {show && <ModIfyAuthorizationMgtModal show={show} toggle={setShow} />}
      </CRow>
    </CContainer>
  );
};

export default AuthorizationMgt;
