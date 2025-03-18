import React from "react";
import { useIntl } from "react-intl";
import { CInputGroup, CListGroupItem } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import Autocomplete from "react-autocomplete";
import { connect } from "react-redux";
import styled from "styled-components";

const SearchInput = styled.input`
  height: calc(2em + 0.75rem + 2px);
  width: 100%;
  border-color: transparent;
  &:focus {
    outline: none;
  }
`;

const ClearKeyword = styled.a`
  padding: 0.5rem;
  cursor: pointer;
`;

const menuStyle = {
  padding: "0",
  position: "fixed",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  maxHeight: "35vh",
  overflowY: "auto",
  overflowX: "hidden",
};

const SearchBar = (props) => {
  let { searchSoftware, keyword, predictionList, setKeyword } = props;
  const intl = useIntl();

  let predictionSearch = (event) => {
    let isShow = true;
    if (event.target.value === "") {
      isShow = false;
      setPredictionValue([]);
    }
    props.setIshowPrediction(isShow);
    props.setKeyword(event.target.value);

    if (isShow) {
      props.doPredictionSearch(event.target.value);
    }
  };
  let setPredictionValue = (event) => {
    props.setIshowPrediction(false);
    if (!event || !event.target) {
      return;
    }
    props.setKeyword(event.target.text);
  };

  let handleSearch = (q) => {
    searchSoftware(q, props.pageNum, props.pageSize);
    let searchStr = "/search?keyword=" + keyword;
    props.history.push(searchStr);
  };

  return (
    <CInputGroup style={{ backgroundColor: "#fff", borderRadius: "1rem" }}>
      <Autocomplete
        items={predictionList}
        shouldItemRender={(item, value) =>
          item.toLowerCase().indexOf(value.toLowerCase()) > -1
        }
        getItemValue={(item) => item}
        renderItem={(item) => {
          return (
            <div key={item} style={{ padding: "0" }}>
              <CListGroupItem
                style={{ textIndent: "0.7rem" }}
                key={item}
                href="#"
                onClick={() => {
                  handleSearch(item);
                }}
              >
                {item}
              </CListGroupItem>
            </div>
          );
        }}
        wrapperStyle={{
          flex: "1 1 auto",
        }}
        menuStyle={menuStyle}
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
        }}
        onSelect={(value) => {
          setKeyword(value);
          handleSearch(value);
        }}
        isOptionEqualToValue={(option, value) =>
          value === undefined || value === "" || option.id === value.id
        }
        renderInput={(props) => {
          return (
            <SearchInput
              className="searchinput search-bar"
              type="text"
              name="input2-group2"
              placeholder={intl.formatMessage({ id: "main.placeHolder" })}
              onKeyUp={(event) => {
                predictionSearch(event);
              }}
              {...props}
              onKeyPress={(event) => {
                if (event.code === "Enter" || event.code === "NumpadEnter") {
                  handleSearch(keyword);
                }
              }}
            ></SearchInput>
          );
        }}
      />
      <ClearKeyword
        style={{ visibility: keyword ? "visible" : "hidden" }}
        onClick={() => {
          setKeyword("");
        }}
      >
        <CIcon size="xl" name="cil-x" />
      </ClearKeyword>
    </CInputGroup>
  );
};

const mapStateToProps = (state) => ({
  softwareDetail: state.search.softwareDetail,
  keyword: state.search.keyword,
  searchCount: state.search.searchCount,
  prediction: state.search.prediction,
  predictionList: state.search.predictionList,
  pageNum: 1,
  pageSize: 10,
});
const mapDispatchToProps = (dispatch) => ({
  searchSoftware: (q, pageNum, pageSize) =>
    dispatch({
      type: "searchSoftware",
      payload: {
        q,
        categoriesSelected: [],
        functionsSelected: [],
        pageNum,
        pageSize,
      },
    }),
  doPredictionSearch: (q) =>
    dispatch({
      type: "doPredictionSearch",
      payload: { q },
    }),
  setIshowPrediction: (isShow) =>
    dispatch({
      type: "SET_IS_SHOW_PREDICTION",
      payload: { prediction: isShow },
    }),
  setPredictionValues: (predictionList) =>
    dispatch({
      type: "SET_SEARCH_PREDICTION",
      payload: { predictionList },
    }),
  setKeyword: (keyword) =>
    dispatch({
      type: "SET_SEARCH_PREDICTION",
      payload: { keyword },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
