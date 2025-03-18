/* eslint-disable */
// 引入 React 相关的钩子和组件
import React, { useEffect, useState, useRef } from "react";
// 引入 Redux 相关的钩子，用于获取状态和分发 action
import { useSelector, useDispatch } from "react-redux";
// 引入 MUI 相关的组件，用于构建 UI
import {
    Grid,
    FormControl,
    Autocomplete,
    TextField,
    FormHelperText,
    Typography,
    CircularProgress
} from "@mui/material";
// 引入自定义的按钮组件
import { AddButton, AddBrandButton } from "./AdminCommonUis";
// 引入 MUI 的图标组件
import AddIcon from "@mui/icons-material/Add";
// 引入国际化相关的组件
import { FormattedMessage } from "react-intl";

/**
 * ApplyNameQuery 组件，用于处理申请名称或品牌的输入和查询操作
 * @param {string} name - 输入框的名称，可能是 "applyName" 或 "brand"
 * @param {boolean} required - 是否为必填项，默认为 false
 * @param {object} userInfo - 当前用户信息
 * @param {function} setUserInfo - 更新用户信息的函数
 * @param {string} message - 错误提示信息
 * @param {string} keyword - 当前输入框的关键字
 * @param {function} setKeyword - 更新关键字的函数
 * @param {boolean} isLock - 输入框是否锁定
 * @param {function} setError - 设置错误状态的函数
 * @param {boolean} error - 错误状态
 * @param {object} intl - 国际化对象
 * @param {object} collectedValues - 收集的申请名称和品牌的值
 * @param {function} updateCollectedValues - 更新收集值的函数
 * @param {string} defaultValue - 输入框的默认值
 */
const ApplyNameQuery = ({
    name,
    required = false,
    userInfo,
    setUserInfo,
    message,
    keyword,
    setKeyword,
    isLock,
    setError,
    error,
    intl,
    collectedValues,
    updateCollectedValues,
    defaultValue,
}) => {
    // 获取 Redux 的 dispatch 函数，用于分发 action
    const dispatch = useDispatch();
    // 从 Redux 状态中获取当前名称对应的列表数据
    const list = useSelector(
        (state) => state.freewareReview?.[`${name}List`] ?? []
    );
    // 控制是否显示新增品牌输入框的状态
    const [isAddBrand, setIsAddBrand] = useState(false);
    // 新增品牌输入框的错误状态
    const [newBrandError, setNewBrandError] = useState(false);
    // 新增品牌输入框的值
    const [newBrand, setNewBrand] = useState("");
    // 添加加载状态
    const [loading, setLoading] = useState(false);
    // 添加加载超时状态
    const [loadingTimeout, setLoadingTimeout] = useState(false);
    // 添加本地缓存数据状态
    const [localCache, setLocalCache] = useState([]);
    // 添加过滤后的列表状态
    const [filteredList, setFilteredList] = useState([]);
    // 添加控制下拉框显示的状态
    const [isOpen, setIsOpen] = useState(false);

    /**
     * 防抖函数，用于延迟执行某个函数，避免频繁触发
     * @param {function} func - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {function} - 包装后的防抖函数
     */
    const debounce = (func, delay) => {
        let timer;
        return function () {
            const context = this;
            const args = arguments;
            // 清除之前的定时器
            clearTimeout(timer);
            // 设置新的定时器，在延迟时间后执行函数
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    };

    /**
     * 发起查询请求的函数，根据输入的关键字查询相关数据
     * @param {string} keyword - 查询关键字
     */
    const query = (keyword) => {
        setLoading(true); // 开始加载
        setLoadingTimeout(false); // 重置超时状态
        
        // 设置5秒超时
        const timeoutId = setTimeout(() => {
            setLoadingTimeout(true);
            setLoading(false);
        }, 5000);

        dispatch({
            type: `query${name.charAt(0).toUpperCase() + name.slice(1)}`,
            payload: {
                [name]: keyword,
            },
        });

        // 清理超时定时器
        return () => clearTimeout(timeoutId);
    };

    /**
     * 添加免费软件品牌的函数，调用 Redux action 来添加品牌
     * @param {string} brandName - 要添加的品牌名称
     */
    const addFreewareBrand = (brandName) =>
        dispatch({
            type: "addFreewareBrand",
            payload: { brandName },
        });

    /**
     * 设置消息的函数，用于更新 Redux 中的消息状态
     * @param {object} msg - 要设置的消息对象
     */
    const setMsg = (msg) =>
        dispatch({
            type: "setMsg",
            payload: { msg },
        });

    /**
     * 清空列表数据的函数，调用 Redux action 清空当前名称对应的列表数据
     */
    const clearList = () =>
        dispatch({
            type: `SET_QUERY_${name.toUpperCase()}`,
            payload: [],
        });

    // 使用防抖函数包装查询函数，避免频繁查询
    const debouncedHandleQuery = useRef(debounce(query, 900)).current;

    // 当前聚焦的用户信息
    const [focusUser, setFocusUser] = useState({});

    /**
     * 监听 userInfo 的变化，根据 userInfo 更新 focusUser 和 keyword
     */
    useEffect(() => {
        if (!userInfo || Object.keys(userInfo)?.length === 0) {
            // 如果 userInfo 为空，清空 focusUser 和 keyword
            setFocusUser({});
            setKeyword("");
        } else if (
            userInfo &&
            userInfo.fullName?.length > 0 &&
            Object.keys(focusUser)?.length === 0 &&
            keyword?.length === 0
        ) {
            // 如果 userInfo 有值且 focusUser 和 keyword 为空，更新 focusUser 和 keyword
            setFocusUser(userInfo);
            setKeyword(userInfo.fullName);
        } else if (
            userInfo &&
            userInfo.fullName?.length > 0 &&
            focusUser.fullName !== userInfo.fullName
        ) {
            // 如果 userInfo 的 fullName 有变化，更新 focusUser 和 keyword
            setFocusUser(userInfo);
            setKeyword(userInfo.fullName);
        }
    }, [userInfo]);

    /**
     * 初始化默认值
     */
    useEffect(() => {
        if (defaultValue) {
            if (name === "brand") {
                // 对于品牌，假设默认值是品牌名称，这里简单处理
                setUserInfo({ brandName: defaultValue });
                setKeyword(defaultValue);
            } else {
                setUserInfo({ fullName: defaultValue });
                setKeyword(defaultValue);
            }
        }
    }, [defaultValue, name]);

    /**
     * 初始化时获取所有数据
     */
    useEffect(() => {
        if (name) {
            setLoading(true);
            dispatch({
                type: `query${name.charAt(0).toUpperCase() + name.slice(1)}`,
                payload: {
                    [name]: "",
                },
            });
        }
    }, [name]);

    // 监听列表变化，更新本地缓存
    useEffect(() => {
        // 不管是 brand 还是 applyName，都更新本地缓存
        setLocalCache(list);
        setFilteredList(list);
        setLoading(false);
        setLoadingTimeout(false); // 重置超时状态
    }, [list]);

    // 本地过滤函数
    const filterLocalData = (searchValue) => {
        if (!searchValue) {
            return localCache;
        }
        return localCache.filter(item => {
            // 确保正确获取要比较的值
            const itemValue = name === "brand" 
                ? (item.brandName || "") 
                : (item.fullName || item.toString() || "");
            return itemValue.toLowerCase().includes(searchValue.toLowerCase());
        });
    };

    /**
     * 处理查询逻辑，根据关键字进行本地过滤
     * @param {string} searchValue - 查询关键字
     */
    const handleQuery = (searchValue) => {
        // 使用本地过滤
        const filtered = filterLocalData(searchValue);
        setFilteredList(filtered);
        setIsOpen(true); // 确保下拉框打开
    };

    /**
     * 处理输入框聚焦事件
     */
    const handleFocus = () => {
        setIsOpen(true);
        if (keyword) {
            handleQuery(keyword);
        } else {
            setFilteredList(localCache);
        }
    };

    /**
     * 处理键盘抬起事件
     */
    const handleKeyUp = (e) => {
        if (isLock || !e) {
            return;
        }
        const inputValue = e.target.value;
        if (required && inputValue === "") {
            setError(true);
        } else {
            setError(false);
        }
        
        setKeyword(inputValue);
        handleQuery(inputValue);

        // 如果是apply name，更新收集的值
        if (name === "applyName") {
            updateCollectedValues("applyName", inputValue);
        }
    };

    // 从 Redux 状态中获取消息
    const msg = useSelector((state) => {
        return state.swAsset?.msg;
    });

    const msg1 = useSelector((state) => {
        return state.swAsset?.msgType?? 'error';
    });

    /**
     * 处理输入框值变化事件，更新用户信息和错误状态，并发起查询请求
     * @param {object} e - 事件对象
     * @param {any} v - 输入框的值
     */
    const onChange = (e, v) => {
        if (required && (v === "" || v === null || v === undefined)) {
            // 如果是必填项且输入为空，设置错误状态
            setError(true);
        } else {
            // 否则清除错误状态
            setError(false);
        }

        if (name === "brand" && typeof v === "object" && v) {
            // 如果是品牌输入框且值为对象，更新用户信息的品牌 ID
            setUserInfo({ brandId: v.brandId });
            // 更新收集的品牌值为 brandId
            updateCollectedValues("brand", v.brandId);
        } else if (typeof v === "string") {
            // 如果值为字符串，更新用户信息的 fullName
            setUserInfo({ fullName: v });
            if (name === "applyName") {
                // 如果是申请名称输入框，更新收集的申请名称的值
                updateCollectedValues("applyName", v);
                // 如果是新值，触发新增操作
                if (!localCache.some(item => item.fullName === v)) {
                    setNewBrand(v);
                    handleAddBrand({ target: { value: v } });
                }
            }
        } else if (v) {
            // 如果值存在，直接更新用户信息
            setUserInfo(v);
            if (name === "brand" && v.brandId) {
                // 如果是品牌输入框且对象有 brandId，更新收集的品牌值为 brandId
                updateCollectedValues("brand", v.brandId);
            } else if (name === "applyName" && v.fullName) {
                // 如果是申请名称输入框且对象有 fullName，更新收集的申请名称的值
                updateCollectedValues("applyName", v.fullName);
            }
        } else {
            // 如果值为空，清空用户信息
            setUserInfo({});
            if (name === "applyName") {
                // 如果是申请名称输入框，清空收集的申请名称的值
                updateCollectedValues("applyName", "");
            } else if (name === "brand") {
                // 如果是品牌输入框，清空收集的品牌的值
                updateCollectedValues("brand", "");
            }
        }
        // 发起查询请求
        handleQuery(v?.fullName || keyword);
    };

    /**
     * 处理输入框内容变化事件，根据输入框名称更新相应的状态
     * @param {object} e - 事件对象
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "newBrand") {
            // 如果是新增品牌输入框，清除错误状态并更新新品牌的值
            setNewBrandError(false);
            setNewBrand(value);
        } else {
            setKeyword(value);
        }
    };

    /**
     * 处理添加品牌的点击事件，添加品牌并更新收集的值
     * @param {object} e - 事件对象
     */
    const handleAddBrand = (e) => {
        if (!newBrand) {
            // 如果新品牌输入为空，设置错误状态
            setNewBrandError(true);
            return;
        }

        if (name === "brand") {
            // 如果是品牌输入框，调用添加品牌的函数
            addFreewareBrand(newBrand);
        }
        // 更新关键字
        setKeyword(newBrand);
        if (name === "brand") {
            // 如果消息提示品牌已存在，则不进行后续操作
            if (msg1?.includes("error")) {
                return;
            }
            // 如果是品牌输入框，更新用户信息的品牌 ID 和名称
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                brandId: null,
                brandName: newBrand,
            }));
            // 添加品牌后重新获取列表
            setLoading(true);
            dispatch({
                type: `query${name.charAt(0).toUpperCase() + name.slice(1)}`,
                payload: {
                    [name]: "",
                },
            });
        } else {
            // 否则更新用户信息的 fullName
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                fullName: newBrand,
            }));
            // 如果是申请名称输入框，更新收集的申请名称的值
            updateCollectedValues("applyName", newBrand);
        }
    };

    /**
     * 监听消息的变化，处理接口返回结果，更新收集的值
     */
    useEffect(() => {
        if (!msg) {
            // 如果消息为空，不做处理
            return;
        }
        if (msg.flag === 2 && msg.data.code === 0) {
            // 如果消息状态和返回码符合条件，发起查询请求
            debouncedHandleQuery();
            if (msg1?.includes("error")) {
                // 如果有错误信息，不进行后续操作
                return;
            }
            if (name === "brand") {
                // 如果是品牌输入框，模拟输入框值变化事件，更新关键字
                const newBrandObj = {
                    brandId: msg.data.data.brandId,
                    brandName: msg.data.data.brandName
                };
                // 更新用户信息为新的品牌对象
                setUserInfo(newBrandObj);
                // 更新收集的品牌值为新的 brandId
                updateCollectedValues("brand", msg.data.data.brandId);
                // 更新关键字为新的品牌名称
                setKeyword(msg.data.data.brandName);
            }
        }
        // 清空消息状态
        setMsg(null);
    }, [msg, msg1]);

    /**
     * 处理下拉框关闭事件
     */
    const handleClose = () => {
        setIsOpen(false);
    };

    // 高亮匹配字符的函数
    const highlightText = (text, search) => {
        if (!search) return text;
        const regex = new RegExp(search, 'gi');
        const parts = text.split(regex);
        const matches = text.match(regex) || [];
        const result = [];
        for (let i = 0; i < parts.length; i++) {
            if (parts[i]) {
                result.push(<span key={`part-${i}-${parts[i]}`}>{parts[i]}</span>);
            }
            if (matches[i]) {
                result.push(<span style={{ fontWeight: 'bolder' }} key={`match-${i}-${matches[i]}`}>{matches[i]}</span>);
            }
        }
        return result;
    };

    return (
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
            <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
                <FormControl
                    variant="standard"
                    error={error}
                    required={required}
                    style={{ width: "calc(100% - 40px)", marginRight: 8 }}
                >
                    <Autocomplete
                        size="small"
                        freeSolo={name === "applyName"}
                        disableClearable={true}
                        options={filteredList}
                        open={isOpen}
                        onClose={handleClose}
                        onOpen={() => setIsOpen(true)}
                        getOptionLabel={(option) => {
                            if (!option) {
                                return "";
                            }
                            if (option.brandName) {
                                return option.brandName;
                            }
                            if (option.fullName) {
                                return option.fullName;
                            }
                            return option;
                        }}
                        isOptionEqualToValue={(option, value) => {
                            if (!value) return true;
                            if (name === "brand") {
                                if (typeof value === "string") {
                                    return option.brandName === value;
                                }
                                return value === undefined ||
                                    value === "" ||
                                    option.brandId === (value.brandId || value);
                            } else {
                                if (typeof value === "string") {
                                    return option.fullName === value || option === value;
                                }
                                return value === undefined || 
                                    value === "" || 
                                    option.fullName === value.fullName;
                            }
                        }}
                        selectOnFocus
                        clearOnBlur={false}
                        handleHomeEndKeys
                        onChange={onChange}
                        onInputChange={(event, value, reason) => {
                            if (reason === 'input') {
                                handleKeyUp({ target: { value } });
                            }
                        }}
                        onFocus={handleFocus}
                        value={
                            name === "brand" && userInfo.brandId
                               ? list.find((item) => item.brandId === userInfo.brandId) || ""
                                : Object.keys(userInfo)?.length > 0
                               ? userInfo
                                : ""
                        }
                        loading={loading && !loadingTimeout}
                        loadingText={
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                                <CircularProgress size={20} style={{ marginRight: '8px' }} />
                                <Typography>loading...</Typography>
                            </div>
                        }
                        noOptionsText={
                            <Typography style={{ padding: '8px', textAlign: 'center' }}>
                                {loadingTimeout ? 'timeout' : 'no result'}
                            </Typography>
                        }
                        renderOption={(props, option) => {
                            const optionText = option.brandName || option.fullName || option.toString();
                            return (
                                <li {...props} style={{ whiteSpace: 'normal', backgroundColor: 'white' }}>
                                    <Typography
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {highlightText(optionText, keyword)}
                                    </Typography>
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={error}
                                value={keyword}
                                readOnly={isLock}
                                variant="standard"
                                label={intl.formatMessage({
                                    id: `swassetmgt.freewareTab.${name}`,
                                })}
                                required={required}
                                InputLabelProps={{
                                    style: {
                                        fontWeight: "800",
                                    },
                                }}
                                onClick={() => setIsOpen(true)}
                            />
                        )}
                    />
                    {error && (
                        <FormHelperText>
                            {message ??
                                intl.formatMessage({
                                    id: `freewarereview.errorMsg.${name}`,
                                })}
                        </FormHelperText>
                    )}
                </FormControl>
                {/* 点击按钮显示或隐藏新增品牌输入框 */}
                <AddBrandButton onClick={() => setIsAddBrand(!isAddBrand)}>
                    <AddIcon style={{ color: "#69b969" }} />
                </AddBrandButton>
            </Grid>
            <Grid
                item
                xs={6}
                style={{
                    display: isAddBrand ? "flex" : "none",
                    alignItems: "center",
                    marginTop: 16,
                }}
            >
                <FormControl
                    variant="standard"
                    error={newBrandError}
                    style={{ width: "calc(100% - 40px)", marginRight: 8 }}
                >
                    {/* 新增品牌输入框 */}
                    <TextField
                        variant="standard"
                        name="newBrand"
                        error={newBrandError}
                        onChange={(event) => handleChange(event)}
                        placeholder={intl.formatMessage({
                            id: `swassetmgt.freewareTab.${name}`,
                        })}
                        helperText={newBrandError && "can't be empty"}
                    />
                </FormControl>
                {/* 点击按钮添加新品牌 */}
                <AddButton onClick={handleAddBrand}>
                    <FormattedMessage id="adminCommon.add" />
                </AddButton>
            </Grid>
        </Grid>
    );
};

export default ApplyNameQuery;