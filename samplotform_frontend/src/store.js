import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { persistStore as persist, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { UserReducer, UserSaga } from "./Reducers/UserReducer";
import { SearchReducer, SearchSaga } from "./Reducers/SearchReducer";
import { ViewReducer } from "./Reducers/ViewReducer";
import { CartReducer, CartSaga } from "./Reducers/CartReducer";
import {
    PermissionReducer,
    PermissionSaga,
} from "./Reducers/PermissionReducer";
import { VipReducer, VipSaga } from "./Reducers/VipReducer";
import { EFormReducer, EFormSaga } from "./Reducers/EFormReducer";
import { SiteReducer, SiteSaga } from "./Reducers/SiteReducer";
import { QueryReducer, QuerySaga } from "./Reducers/QueryReducer";
import {
    SoftwareInfoReducer,
    SoftwareInfoSaga,
} from "./Reducers/SoftwareInfoReducer";
import { SDPReducer, SDPSaga } from "./Reducers/SDPReducer";
import { SwCollectionReducer, SWSaga } from "./Reducers/SwCollectionReducer";
import { FreewareRevireReducer, FreewareRevireSaga } from './Reducers/FreewareReviewReducer'
import {
    SWCollectionMgtReducer,
    SWCollectionMgtSaga,
} from "./Reducers/admin/SWCollectionMgt";
import {
    SWCollectionReducer,
    SWCollectionSaga,
} from "./Reducers/admin/SWCollection";
import { CostCenterReducer, CostCenterSaga } from "./Reducers/admin";
import { SWAssetReducer, SWAssetSaga } from "./Reducers/SWAssetReducer";
import {
    SAMFunctionReducer,
    SAMFunctionSaga,
} from "./Reducers/SamFunctionMgtReducer";
import {
    AuthorizationMgtReducer,
    AuthorizationMgtSaga,
} from "./Reducers/admin/AuthorizationMgtReducer";

function* rootSaga() {
    yield all([
        ...UserSaga,
        ...SearchSaga,
        ...CartSaga,
        ...PermissionSaga,
        ...VipSaga,
        ...EFormSaga,
        ...SiteSaga,
        ...QuerySaga,
        ...SoftwareInfoSaga,
        ...SDPSaga,
        ...SWSaga,
        ...SAMFunctionSaga,
        ...SWAssetSaga,

        ...SWCollectionMgtSaga,
        ...SWCollectionSaga,
        ...CostCenterSaga,
        ...AuthorizationMgtSaga,
        ...FreewareRevireSaga
    ]);
}

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: "user",
    storage,
    whitelist: ["token"],
};
const localePersist = {
    key: "view",
    storage,
    whitelist: ["currentLocale"],
};

const rootReducer = combineReducers({
    user: persistReducer(persistConfig, UserReducer),
    search: SearchReducer,
    view: persistReducer(localePersist, ViewReducer),
    cart: CartReducer,
    permission: PermissionReducer,
    vip: VipReducer,
    eform: EFormReducer,
    site: SiteReducer,
    query: QueryReducer,
    softwareInfo: SoftwareInfoReducer,
    sdp: SDPReducer,
    swCollection: SwCollectionReducer,
    functions: SAMFunctionReducer,
    swAsset: SWAssetReducer,
    costCenter: CostCenterReducer,
    ...SWCollectionMgtReducer,
    ...SWCollectionReducer,
    authorizationMgt: AuthorizationMgtReducer,
    freewareReview: FreewareRevireReducer
});

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);

const persistStore = persist(store);

sagaMiddleware.run(rootSaga);

export { store, persistStore };