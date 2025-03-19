import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Table } from "../../common";
import SearchQueries from "./SearchQueries";
import HeaderColumns from "./HeaderColumns";
import BodyColumns from "./BodyColumns";
import ModifyRateMgtModal from "./ModifyRateMgtModal";
import { SORTING_DIRECTION } from "src/constants/common";
import { DEFAULT_SORT_COL } from "src/constants/admin/SWCollectionMgt";
import { ACTIONS } from "src/Reducers/admin/SWCollectionMgt/RateMgtReducer";

const RateMgtTab = () => {
  const dispatch = useDispatch();
  const { sort, total, pageSize, totalPages } = useSelector(
    (state) => state.SWRateMgt
  );
  const [show, setShow] = useState(false);
  const [isASC, setIsASC] = useState(true);
  const [sortingColumn, setSortingColumn] = useState(DEFAULT_SORT_COL.RATE_MGT);

  const [params, setParams] = useState({
    keyword: "",
    // keyword: moment().format('YYYY'),
    pageNumber: 0,
    pageSize,
    sort,
  });

  useEffect(() => {
    getRateMgtList();

    if (params.sort === sort) {
      setIsASC(true);
      setSortingColumn(DEFAULT_SORT_COL.RATE_MGT);
    }
  }, [params]);

  const getRateMgtList = () => {
    dispatch({
      type: ACTIONS.GET_RATE_MGT_LIST,
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

  return (
    <>
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
      {show && <ModifyRateMgtModal show={show} toggle={setShow} />}
    </>
  );
};

export default RateMgtTab;
