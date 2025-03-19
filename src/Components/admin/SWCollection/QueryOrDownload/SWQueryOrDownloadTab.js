import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "../../common";
import SearchQueries from "./SearchQueries";
import HeaderColumns from "./HeaderColumns";
import BodyColumns from "./BodyColumns";
import { ALL } from "src/constants/common";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";
import EditQueryOrDownload from "./EditQueryOrDownload"
import { useIntl } from "react-intl";

const SWQueryOrDownloadTab = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const total = useSelector((state) => state.SWReport.total);
  const pageSize = useSelector((state) => state.SWReport.pageSize);
  const pages = useSelector((state) => state.SWReport.pages);

  const [isASC, setIsASC] = useState(true);
  const [sortingColumn, setSortingColumn] = useState("costCenter");

  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState({});

  const [params, setParams] = useState({
    year: new Date(),
    bg: ALL,
    bu: ALL,
    costCenter: "",
    pageNum: 0,
    pageSize,
    brand: "",
    productName: "",
  });

  useEffect(() => {
    getQueryOrDownloadList();
  }, []);

  const getQueryOrDownloadList = () => {
    const _params = {
      ...params,
      year: params.year.getFullYear(),
      userFlag:1,
      pageNum: params.pageNum + 1,
    };
    dispatch({
      type: ACTIONS.GET_SW_QUERY_OR_DOWNLOAD_LIST,
      payload: _params,
    });
  };

  useEffect(() => {
    getQueryOrDownloadList();
  }, [params.pageNum, params.pageSize]);

  const sortHandler = (property) => {
    // 判断点击的属性是否被点击过，第一次点击 sortingColumn和property不相同，asc为true，排序方式为升序，再次点击为降序
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);

    setParams((prev) => ({
      ...prev,
      sort: `${property},${asc ? "asc" : "desc"}`, // 拼接为查询要求格式
      pageNum: 0,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setParams((prev) => ({
      ...prev,
      pageNum: newPage,
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    setParams((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      pageNum: 0,
    }));
  };

  const handleSave = (prop) => {
    dispatch({
      type: ACTIONS.UPDATE_QUERY_OR_DOWNLOAD,
      payload: prop,
    });
  };

  return (
    <>
      <Table
        searchQueries={
          <SearchQueries
            params={params}
            setParams={setParams}
            setEditTarget={setEditTarget}
            setOpenEdit={setOpenEdit}
            onSearch={getQueryOrDownloadList}
          />
        }
        headerColumns={
            <HeaderColumns
              sortingColumn={sortingColumn}
              direction={isASC ? "asc" : "desc"}
              onClick={sortHandler}
            />
        }
        bodyColumns={<BodyColumns 
          setEditTarget={setEditTarget}
          setOpenEdit={setOpenEdit}
          />}
        queryResults={{ totalPages: pages, total: total }}
        showPagination={true}
        page={params.pageNum}
        rowsPerPage={params.pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <EditQueryOrDownload
        intl={intl}
        show={openEdit}
        toggle={setOpenEdit}
        handleSave={handleSave}
        focusUser={editTarget}
      />
    </>
  );
};

export default SWQueryOrDownloadTab;
