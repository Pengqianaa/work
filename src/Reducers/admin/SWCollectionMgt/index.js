import { RateMgtReducer, RateMgtSaga } from "./RateMgtReducer";
import { OrgMgtReducer, OrgMgtSaga } from "./OrgMgtReducer";
import {
  SWCollectionPlanReducer,
  SWCollectionPlanSaga,
} from "./SWCollectionPlanReducer";
import { SWAuthorityMgtReducer, AuthoritySaga } from "./SWAuthorityMgtReducer";
import {
  SWInfoMaintainReducer,
  SWInfoMaintainSaga,
} from "./SWInfoMaintainReducer";
const SWCollectionMgtSaga = [
  ...RateMgtSaga,
  ...OrgMgtSaga,
  ...AuthoritySaga,
  ...SWCollectionPlanSaga,
  ...SWInfoMaintainSaga,
];

const SWCollectionMgtReducer = {
  SWRateMgt: RateMgtReducer,
  SWOrgMgt: OrgMgtReducer,
  SWAuthMgt: SWAuthorityMgtReducer,
  SWCollectionPlan: SWCollectionPlanReducer,
  SWInfoMaintain: SWInfoMaintainReducer,
};

export { SWCollectionMgtReducer, SWCollectionMgtSaga };
