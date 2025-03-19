import Api from "../Common/api";
import { Actions } from "../Common/constants";
import { call, put, select, takeEvery } from "redux-saga/effects";

const mappingSubCategories = (categories, mappingObj) => {
  const { id, categoryNameEN, categoryList: subCategories } = categories;
  // let label1 = null;
  // let label2 = null;
  let label = {}
  if (subCategories && subCategories?.length) {
    subCategories.sort((a, b) => {
      // order by id
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    // label1 = subCategories[0];
    // label2 = subCategories[1];
    subCategories?.forEach((el, index) => {
      let label1 = "label" + index
      label[label1] = el;
    })
  }
  let labelArray = {}
  for (let i = 0; i < subCategories.length; i++) {
    let labelEN = "label" + (i + 1) + "EN", labelTC = "label" + (i + 1) + "TC"
    labelArray[labelEN] = label["label" + i].categoryNameEN
    labelArray[labelTC] = label["label" + i].categoryNameTC
  }
  mappingObj[categoryNameEN] = {
    ...labelArray,
    id: id,
    // label1EN: label1?.categoryNameEN ?? "",
    // label1TC: label1?.categoryNameTC ?? "",
    // label2EN: label2?.categoryNameEN ?? "",
    // label2TC: label2?.categoryNameTC ?? "",
  };
};

const initialState = {
  softwareDetail: {
    data: {
      categoryList: [],
      list: [],
    },
  },
  keyword: "",
  // catId: '',
  // functionId: '',
  // brand: '',
  categoriesSelected: [],
  functionsSelected: [],
  brandsSelected: [],
  searchCount: "",

  prediction: false,
  predictionList: [],

  functionFilterList: [],
  categoryFilterList: [],
  brandFilterList: [],
  categoryListAndSubCategory: [],
  functionHierarchies: [],

  categoryList: [],
  categoryMap: {
    Commercial: {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
    "Delta Library": {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
    "Open source (OSS)": {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
    Trialware: {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
    "Patch/Driver": {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
    Freeware: {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
    "Commerical Library": {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
    "Delta Software Tool": {
      id: null,
      label1EN: "",
      label1TC: "",
      label2EN: "",
      label2TC: "",
    },
  },
};

const SearchReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_SOFTWARE_DETAIL:
      return { ...state, ...payload };
    case Actions.SET_IS_SHOW_PREDICTION:
      let { prediction } = payload;
      return { ...state, prediction };
    case Actions.SET_SEARCH_PREDICTION:
      return { ...state, ...payload };
    case Actions.SET_CATEGORY_LIST:
      return {
        ...state,
        categoryList: [...payload.list],
        categoryMap: { ...payload.mappingObj },
      };

    // ==== FILTER LISTS
    case Actions.SET_FILTER_LISTS:
      let { functionFilterList, categoryFilterList, brandFilterList, categoryListAndSubCategory } = payload;
      let hierarchies = [];
      if (functionFilterList && functionFilterList.length > 0) {
        hierarchies = analyzeTree(functionFilterList);
      }

      return {
        ...state,
        functionFilterList: [...functionFilterList],
        categoryFilterList: [...categoryFilterList],
        brandFilterList: [...brandFilterList],
        functionHierarchies: hierarchies,
        categoryListAndSubCategory: categoryListAndSubCategory
      };

    // === FILTER SETTERS
    case Actions.SET_SEARCH_PARAMS:
      let {
        keyword,
        categoriesSelected,
        functionsSelected = [],
        brandsSelected = [],
      } = payload;
      return {
        ...state,
        keyword,
        categoriesSelected: [...categoriesSelected],
        functionsSelected: [...functionsSelected],
        brandsSelected: [...brandsSelected],
      };
    default:
      return state;
  }
};

function* getAllCategoryInfo() {
  let res = yield call(Api.getFilterItems, {
    q: "",
    catId: "1",
    brandId: "",
    isPublic: true,
    isAvailable: true,
  });

  if (!res?.data?.data) {
    return;
  }

  const { categoryList } = res.data.data?.category;
  const mappingObj = initialState.categoryMap;
  const childs = yield select((state) => state.functions.map?.home?.childs);
  const enableCategories = childs ? Object.values(childs) : [];

  const categoryFilterList = categoryList?.map((category) => {
    const enableCategory = enableCategories.filter(
      (el) => el.categoryId === category.id
    );
    const userEnable = enableCategory[0]?.userEnable;
    mappingSubCategories(category, mappingObj);
    return {
      ...category,
      userEnable,
    };
  });

  yield put({
    type: Actions.SET_CATEGORY_LIST,
    payload: {
      list: categoryFilterList,
      mappingObj,
    },
  });
}

function* searchSoftware({ payload }) {
  const {
    q,
    categoriesSelected,
    functionsSelected = [],
    brandsSelected = [],
    pageNum,
    pageSize,
  } = payload;
  if (typeof q === "undefined" || q === null) {
    q = "";
  }
  let cateParamList = [...functionsSelected, ...brandsSelected];
  // let isDetlaLib = categoriesSelected[0] === CATEGORY.DELTA_LIBRARY
  // let functionParamName = isDetlaLib ? 'componentTypeId' : 'functionId'
  // let brandParamName = isDetlaLib ? 'domainId' : 'brandId'

  let req = {
    q: q,
    catId:
      cateParamList.length > 0
        ? cateParamList.join(",")
        : categoriesSelected.join(","),
    pageNum: pageNum,
    pageSize: pageSize,
    // [functionParamName]: typeof functionsSelected !== 'undefined' ? functionsSelected.join(',') : '',
    // [brandParamName]: typeof brandsSelected !== 'undefined' ? brandsSelected.join(',') : ''
    isPublic: true,
    isAvailable: true,
  };
  let response = yield call(Api.searchSoftware, req);
  yield put({
    type: Actions.SET_SOFTWARE_DETAIL,
    payload: {
      softwareDetail: response.data,
      searchCount: response.data.data.total,
    },
  });
  yield put({
    type: Actions.SET_SEARCH_PARAMS,
    payload: {
      keyword: q,
      categoriesSelected,
      functionsSelected,
      brandsSelected,
    },
  });

  {
    let categoryListAndSubCategory = yield select(state => state.search.categoryListAndSubCategory)
    let response = yield call(Api.getFilterItems, {
      q: q,
      catId:
        cateParamList.length > 0
          ? cateParamList.join(",")
          : categoriesSelected.join(","),
      // [functionParamName]: typeof functionsSelected !== 'undefined' ? functionsSelected.join(',') : '',
      // brandId: typeof brandsSelected !== 'undefined' ? brandsSelected.join(',') : ''
      isPublic: true,
      isAvailable: true,
    });
    if (response && response.data && response.data.data) {
      let categoryFilterList = response.data.data.category.categoryList;
      let functionFilterList = [];
      let brandFilterList = [...response.data.data.brand];
      if (cateParamList.length === 0) {
        let AllCategoryListAndSubCategory = categoryFilterList.map(el => {
          el = { ...el }
          el.largeCategory = el.categoryList// 品牌or产品类别
          el.largeCategory.map(elem => {
            elem.subCategory = []
            elem.categoryList.forEach(ele => {
              if (ele.count > 0) { elem.subCategory.push(ele) }
            })
            return elem
          })
          return el
        })
        AllCategoryListAndSubCategory.forEach(el => {
          if (el.id === categoriesSelected[0]) {
            categoryListAndSubCategory = el
          }
        })
      }
      yield put({
        type: Actions.SET_FILTER_LISTS,
        payload: {
          functionFilterList,
          categoryFilterList,
          brandFilterList,
          categoryListAndSubCategory
        },
      });
    }
  }

  if (payload.nextPage) {
    // payload.nextPage()
    yield put({
      type: Actions.GO_TO_PAGE,
      payload: payload.nextPage,
    });
  }
}

function* doPredictionSearch({ payload }) {
  let { q } = payload;
  let response = yield call(Api.getSuggestList, { q });

  let list = response.data.data;
  if (list[0] && list[0] !== q) {
    list.unshift(q);
  }

  yield put({
    type: "SET_SEARCH_PREDICTION",
    payload: {
      predictionList: list,
    },
  });
}

// const handleFunctionList = (list, newList, level) => {
//   list.forEach(elem => {
//     let functionObj = {
//       functionId: elem.functionId,
//       typeName: elem.typeName,
//       parentId: elem.parentId,
//       checked: false,
//       count: 0,
//       level
//     }
//     newList.push(functionObj)
//     if (elem.childrenFunction && elem.childrenFunction.length > 0) {
//       handleFunctionList(elem.childrenFunction, newList, level + 1) // !!! notice: recursive call !!!
//     }
//   })
// }

const analyzeTree = (list) => {
  let levels = new Set([]);
  list.forEach((elem) => {
    levels.add(elem.level);
  });
  let hierarchies = [];
  let level1 = new Set([]);
  let array = [...levels];
  array.sort().forEach((level) => {
    if (level === 0) {
      list.forEach((elem) => {
        if (elem.level === 0 && !level1.has(elem.id)) {
          level1.add(elem.id);
          hierarchies.push([elem.id]);
        }
      });
    } else {
      list.forEach((elem) => {
        if (elem.level === level) {
          hierarchies.forEach((array) => {
            if (array.includes(elem.parentId)) {
              array.push(elem.id);
            }
          });
        }
      });
    }
  });
  return hierarchies;
};

const SearchSaga = [
  takeEvery("searchSoftware", searchSoftware),
  takeEvery("doPredictionSearch", doPredictionSearch),
  takeEvery("getAllCategoryInfo", getAllCategoryInfo),
];

export { SearchReducer, SearchSaga };
