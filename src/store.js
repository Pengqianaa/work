import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { all } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { UserReducer, UserSaga } from "./Reducers/UserReducer";
import { ViewReducer, ViewSaga } from "./Reducers/ViewReducer";
import { TaskReducer, TaskSaga } from "./Reducers/TaskReducer";
import { AutoApprovedReducer, AutoApprovedSaga } from "./Reducers/AutoApprovedReducer";
import { PermissionReducer, PermissionSaga } from "./Reducers/PermissionReducer";
import { LicenseApplyReducer, LicenseApplySaga } from "./Reducers/LicenseApplyReducer";
import { LicenseMgtReducer, LicenseMgtSaga } from "./Reducers/LicenseMgtReducer";

// 自定義 sessionStorage 引擎
const sessionStorageEngine = {
  getItem: (key) => {
    return Promise.resolve(sessionStorage.getItem(key));
  },
  setItem: (key, value) => {
    sessionStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    sessionStorage.removeItem(key);
    return Promise.resolve();
  },
};

const localePersistConfig = {
  key: "view",
  storage:sessionStorageEngine,
  whitelist: ["currentLocale", "orgNTenantOrg", "orgNTenantTen"],
};

const userPersistConfig = {
  key: "user",
  storage:sessionStorageEngine,
  whitelist: ["token", "isAuthenticated", "user", "role", "userKey"],
};

const permissionPersistConfig = {
  key: "permission",
  storage:sessionStorageEngine,
  whitelist: ["menuList"],
};

// 清除特定 persistConfig 的数据
// const purgeUserAndPermission = () => {
//   console.log('开始清除用户和权限的持久化数据');
//   purgeStoredState(userPersistConfig);
//   purgeStoredState(permissionPersistConfig);
//   console.log('用户和权限的持久化数据清除完成');
// };

// window.addEventListener('beforeunload', (event) => {
//   const navigationEntries = performance.getEntriesByType('navigation');
//   const navigationType = navigationEntries.length > 0 ? navigationEntries[0].type : 'navigate';
//   console.info(navigationType)
//   if (navigationType === 'reload') {
//     console.log('頁面是刷新');
//   } else {
//     console.log('頁面是關閉或導航到其他頁面');
//     purgeStoredState(userPersistConfig);
//   }
// });

// 根 reducer
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, UserReducer), // 为 user 配置 persist
  view: persistReducer(localePersistConfig, ViewReducer), // 为 view 配置 persist
  taskInfo: TaskReducer,
  licenseApply: LicenseApplyReducer,
  licenseMgt: LicenseMgtReducer,
  autoApproved: AutoApprovedReducer,
  permission: persistReducer(permissionPersistConfig, PermissionReducer),// 为 Permission 配置 persist
});

// 根 saga
function* rootSaga() {
  // 确保每个 saga 函数都被正确调用
  yield all([UserSaga(), LicenseApplySaga(), LicenseMgtSaga(), TaskSaga(), ViewSaga(), PermissionSaga(), AutoApprovedSaga()]); // 如果 UserSaga 是生成器函数数组
  // yield all([...UserSaga]); // 如果 UserSaga 是 effects 的集合
}

const sagaMiddleware = createSagaMiddleware();

// Redux Toolkit 的 configureStore 配置
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }).concat(sagaMiddleware), // 添加 saga middleware
  devTools: process.env.NODE_ENV !== "production", // 仅在开发模式下启用 devTools
});

// 持久化 store 实例
const persistStoreInstance = persistStore(store);

// 启动 saga
sagaMiddleware.run(rootSaga);

export { store, persistStoreInstance };
