import styled from "styled-components";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
export const AddButton = styled(Button)`
  background-color: #0087dc !important;
  color: #fff !important;
  cursor: pointer !important;
  display: block;
  height: 80%;
`;

export const LockButton = styled(Button)`
  background-color: #0087dc;
  color: #fff;
  cursor: pointer !important;
  display: block;
  height: 80%;
`;
// TableHeadContainer {
//   display: flex;
//   align-items: center; /* 垂直居中對齊 */
//   justify-content: space-between; /* 或其他需求，如 flex-start, center */
//   gap: 10px; /* 控制子元素之間的間距 */
//   padding: 10px; /* 根據需要設置內邊距 */
// }

// FilterGroup {
//   display: flex; 
//   align-items: center;
//   justify-content: center; 
// }

export const TableHeadContainer = styled.div`
 display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 10px; 
  padding: 10px; 
`;
export const SearchInput = styled.input`
  height: calc(2em + 0.75rem + 2px);
  width: 100%;
  &:focus {
    outline: none;
  }
`;

export const SubmitButton = styled(Button)`
  background-color: #0087dc !important;
  color: #fff !important;
  cursor: pointer !important;
  height: 80%;
  &.Mui-disabled {
    background-color: #ddd !important;
    color: #aaa !important;
  }

  &:focus {
    outline: none;
  }
`;

export const ExportButton = styled(Button)`
  background-color: green !important;
  color: #fff !important;
  cursor: pointer !important;
  display: block;
  height: 80%;
  margin-left: 8px !important;
  &.Mui-disabled {
    background-color: #ddd !important;
    color: #aaa !important;
  }
`;
export const ImportButton = styled(Button)`
  background-color: #5f5f5f !important;
  color: #fff !important;
  cursor: pointer !important;
  display: block;
  height: 80%;
  margin-left: 8px !important;
  &.Mui-disabled {
    background-color: #ddd !important;
    color: #aaa !important;
  }
`;
export const FilterContainer = styled(FormControl)`
  min-width: 140px !important;
  margin-right: 20px !important;
`;
export const FilterGroup = styled.div`
   display: flex; 
  align-items: center;
  justify-content: center; 
`;
export const TabContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
export const AddBrandButton = styled(IconButton)`
  /* background-color: #becec1!important; */
  border: 2px solid #69b969 !important;
  margin-left: 5px !important;
  padding: 2px !important;
  border-radius: 10% !important;
`;
export const CloseButton = styled(IconButton)`
  color: #00a0e9 !important;
  font-size: 1rem !important;
  padding: 0 !important;
  &:focus {
    outline: none;
  }
`;
export const Divider = styled.hr`
  margin-top: 5px;
`;

export const ItemInfo = styled.p`
  font-size: 12px;
  margin: 4px 8px 4px 8px;
  width: 100%;
  overflow-wrap: break-word;
`;
export const DescDiv = styled.div`
  width: 100px; // 寬度
  overflow: hidden; // 超出的文本隱藏
  text-overflow: ellipsis; // 溢出用省略號
  white-space: nowrap; // 溢出不換行
  /* -webkit-line-clamp:5; //控制顯示的行數 */
  -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式) /
  /* display: -webkit-box; */
`;
export const DescButton = styled(IconButton)`
  color: #00a0e9 !important;
  font-size: 0.7rem !important;
  padding: 0 !important;
  &:focus {
    outline: none;
  }
`;
