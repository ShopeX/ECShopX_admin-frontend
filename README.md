# ecshopx-admin

## 安装依赖
npm run install
npm i @shopex/finder --registry=http://registry.npm.ishopex.cn

## 开发
npm run dev

## 打包
npm run build


## 代码prettier
husky install
npx husky add .husky/pre-commit "npx lint-staged --allow-empty"
