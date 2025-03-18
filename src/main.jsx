import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { IntlProvider } from "react-intl";
import { StyledEngineProvider } from "@mui/material/styles";
import { store, persistStoreInstance } from "./store";
import App from "./App";
import getLocaleData from "./i18n/_locale";

const IntlApp = () => {
  // 從 Redux 獲取當前語言
  const currentLocale = useSelector((state) => state.view.currentLocale) || "en";
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    // 當語言切換時加載對應翻譯文件
    const fetchMessages = async () => {
      const msgs = await getLocaleData(currentLocale);
      setMessages(msgs);
    };
    fetchMessages();
  }, [currentLocale]); // 當語言發生變化時觸發

  if (!messages) {
    return <div>Loading translations...</div>; // 加載翻譯時的占位
  }

  return (
    <IntlProvider locale={currentLocale} messages={messages}>
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </IntlProvider>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStoreInstance}>
        <IntlApp />
      </PersistGate>
    </Provider>
);