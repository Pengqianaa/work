import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const TokenHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // 保存 token 到 Redux store 或其他状态管理工具中
      dispatch({
        type: "STORE_USER",
        payload: { token: token.replace(/["\\]/g, "") },
      });

      // 移除 URL 中的 token 参数
      window.history.replaceState({}, document.title, window.location.pathname);

      // 重定向到主页面
      navigate("/orgNTenant");
    }
  }, [dispatch, navigate]);

  return null;
};

export default TokenHandler;
