Project : FrontEnd Start of SAM Portal
======================

Sam Portal (Software Asset Management Portal) 前端開發
https://software.deltaww.com
Edit Version: V1.1

1.Git
------
從 Git 庫拉取 code 
### 1-1 git clone ###
git clone http://deltascm.deltaww.com/Corp/Corp/git/SECD/samplotform_frontend

### 1-2 git clone error ###
    1,如果出現 Permission denied
    用瀏覽器打開 http://deltascm.deltaww.com/Corp/Corp/git/SECD/samplotform_frontend
    打不開需要聯繫管理員申請權限
    
    2,Incorrect username or password
    使用 git clone http://XXXXX@deltascm.deltaww.com/Corp/Corp/git/SECD/samplotform_frontend



2.npm install
----------------
在本地 node_modules 文件夾中安裝 package.json 中列為依賴項的所有模塊。

    npm config set registry https://artifact.deltaww.com/repository/npm-group/
    npm install

+   `npm i 和 npm install 的区别 实际使用的区别点主要如下(windows 下)：` 
    在安装命令时候，为了便捷，通常 npm install 会缩写成 npm i，一般认为 npm i 和 npm install 是等价的，但实际上这两个还是有细微的不同。

    1,用 npm i 安装的模块无法用 npm uninstall 删除，用 npm uninstall i 才卸载掉
    
    2,npm i 会帮助检测与当前 node 版本最匹配的 npm 包版本号，并匹配出来相互依赖的 npm 包应该提升的版号
    
    3,部分 npm 包在当前 node 版本下无法使用，必须使用建议版本
    
    4,安装报错时 install 肯定会出现 npm-debug.log 文件，npm i 不一定
    
    

### 2-1 出現版本問題

The react-scripts package provided by Create React App requires a dependency:

使用 npm audit fix --force

### 2-2 出現 npm ERR! cb() never called

+ `删除 Project 內執行 npm install 下载好的 node_modules`
    方法一: 缺點是執行時間長
    ```
    rm node_modules
    ```
    方法二: 全域安裝 rimraf (以 npm install rimraf -g，這樣電腦上其他 Project 也可使用)
    ```
    rimraf node_modules
    ```
+ `先删除 Project 內的 package-lock.json`
   Project 版控上 .gitignore  建議不要加入 package-lock.json 做 commit 排除，原因在於此檔為 developer / deployment 時 npm install 的依據：執行安裝時如有該檔會根據 package-lock.json 的 各 package 版本相依來安裝; 如果沒有該檔，則會執行 package.json 為準
   (因 Package 版本執行有 ^ 符號，會以最接近和相依版本安裝，這有機會造成每個 developer 執行 npm install 後產生不同的 package-lock.json，再先前一個 commit code 環境執行正確，再另一個 clone project 後執行失敗的機會)
+ `清除 npm 緩存`
  ```
  npm cache clean --force
  ```
+ `再次執行 npm install`
  ```
  npm install
  ```
## 3.npm run start

```
执行 npm run start
```

run start:执行 package.json->scripts->start 设置的命令

### 3-1 Module not found: Error: Can't resolve 'webpack/hot/log.js'

 npm install webpack

### 3-2 The 'compilation' argument must be an instance of Compilation

npm uninstall webpack 

npm install webpack@4.44.2

資料來源
--------
1. [Incorrect username or password](https://blog.csdn.net/weixin_44224529/article/details/117867358)
2. [npm i 和 npm install 的区别](https://zhuanlan.zhihu.com/p/411089909)
3. [3-3 解决方案](https://blog.csdn.net/zyj12138/article/details/110232452)


### 參考資料(/引用)
> 引用
> 
> > 出自 ZHUOJUN.YE
> > 日期 2022/05/31
> 
> 更新 1.1 版本
> > 編輯 JENNY.LAN
> > 日期 2022/06/15


