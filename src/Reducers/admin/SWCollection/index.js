import { SWReportReducer, SWReportReducerSaga } from "./SWReportReducer";

const SWCollectionSaga = [...SWReportReducerSaga];

const SWCollectionReducer = {
  SWReport: SWReportReducer,
};

export { SWCollectionReducer, SWCollectionSaga };
