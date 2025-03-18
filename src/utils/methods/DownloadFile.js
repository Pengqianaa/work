
const FILE_TYPE = {
  CSV: "csv",
  XLSX: "xlsx",
};

/**
 * 用於匯出/下載二進制文件流, 並將資料轉成對應的檔案類型
 * @param {Blob} data api 回傳資料
 * @param {string} name 檔名  (預設為 download), 規則為駝峰式, 如前綴詞有加 SW, SW 須都大寫 (ex: SWRateMgt)
 * @param {string} type 副檔名 (預設為 xlsx)
 */
const DownloadFile = ({
  data = null,
  name = "download",
  type = FILE_TYPE.XLSX,
}) => {
  // fileDownload(data, `${name}_${moment().format("YYYY-MM-DD")}.${type}`);
};

export { FILE_TYPE, DownloadFile };
