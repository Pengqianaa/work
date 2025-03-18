import React from "react";
import { connect } from "react-redux";
import { CContainer, CRow, CCol, CImg } from "@coreui/react";
import { SearchBar } from "../uiComponents/index";
import {
  banner,
  commercial,
  deltaLibrary,
  openSource,
  trailware,
  patchDriver,
  freeware,
  commercialLibrary,
  deltaSoftwareTool,
} from "../../assets/images";
import { SCREEN } from "../../Common/constants";

// styles
import styled from "styled-components";

const CategoryIcon = styled(CCol)`
  cursor: pointer;
  border-radius: 1rem;
  border: 1px solid transparent;
  &:hover {
    border-color: #b0b6ba;
  }
`;

const CategoryIconDisabled = styled(CCol)`
  cursor: default;
  border-radius: 1rem;
  border: 1px solid transparent;
  filter: grayscale(100%);
`;

const MainPageContainer = styled(CContainer)`
  max-width: 600px;
  margin: 0 auto;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    width: 90vw;
  }
`;

const MainPageTitle = styled(CCol)`
  padding-top: 8px;
`;

const MainPagePic = styled(CImg)`
  width: 100%;
`;

const SearchContainer = styled(CRow)`
  padding: 20px 0 0 0;
`;

const picMap = {
  Commercial: commercial,
  "Delta Library": deltaLibrary,
  "Open source (OSS)": openSource,
  Trialware: trailware,
  "Patch/Driver": patchDriver,
  Freeware: freeware,
  "Commerical Library": commercialLibrary,
  "Delta Software Tool": deltaSoftwareTool,
};

class MainPage extends React.Component {
  render() {
    let { searchSoftware, categories, locale, functions } = this.props;
    const searchEnable = functions?.search?.userEnable;

    return (
      <MainPageContainer>
        <CRow>
          <MainPageTitle>
            <MainPagePic src={banner} />
          </MainPageTitle>
        </CRow>
        {searchEnable && (
          <SearchContainer>
            <CCol>
              <SearchBar {...this.props} />
            </CCol>
          </SearchContainer>
        )}
        <CRow className="searchcategory">
          {categories.map((el) => {
            const { id, isValid, userEnable, categoryNameTC, categoryNameEN } =
              el;
            const Icon =
              !!isValid && userEnable ? CategoryIcon : CategoryIconDisabled;
            return (
              <Icon
                key={id}
                sm={3}
                xs={6}
                {...(isValid &&
                  userEnable && {
                    onClick: () => {
                      searchSoftware(id);
                    },
                  })}
              >
                <CImg src={picMap[categoryNameEN]} />
                <span>
                  {locale.includes("zh") ? categoryNameTC : categoryNameEN}
                </span>
              </Icon>
            );
          })}
        </CRow>
      </MainPageContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.search.categoryList,
  locale: state.view.currentLocale,
  functions: state.functions.map,
});
const mapDispatchToProps = (dispatch) => ({
  searchSoftware: (catId) =>
    dispatch({
      type: "searchSoftware",
      payload: {
        q: "",
        categoriesSelected: [catId],
        functionsSelected: [],
        brandsSelected: [],
        pageNum: 1,
        pageSize: 10,
        nextPage: "/search",
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
