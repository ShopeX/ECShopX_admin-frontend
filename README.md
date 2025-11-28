<p align="center"><img width="600" height="416" alt="logo2" src="https://github.com/user-attachments/assets/abf6c4c7-8cb1-477e-aea4-9e526cd8225a" /></p>

### <p align="center">Admin Frontend</p>

# Getting started
Node.js (current LTS) and npm are required to run the project. To be sure about the version compatibility you can enable Node's corepack.

### System Requirements
Required Node.js Version: 16.16.0. If your current version differs, follow the steps below to switch
```
nvm install 16.16.0
nvm use 16.16.0
```
### Configure the .env file
```shell
# The system’s default settings do not require any changes.
VUE_APP_IS_SAAS=false

# Backend API Base URL
VUE_APP_BASE_API=

# The system’s default settings do not require any changes.
VUE_APP_PUBLIC_PATH=/

# The system’s default settings do not require any changes.
VUE_APP_WXIMG_URL=

# The system’s default settings do not require any changes.
VUE_APP_WXAUTHCALL_Url=

# The system’s default settings do not require any changes.
VUE_APP_QIANKUN_ENTRY=/newpc

# Media files OSS Server URL
VUE_APP_OSS_CDN=

# Map Service API Key，Used to configure offline store locations and retrieve store coordinates based on geographic information.
VUE_APP_MAP_KEY=

# Configurations for Hourly Delivery
VUE_APP_LOCAL_DELIVERY_DIRVER=

# Default Language Version（Chinese:zhcn/English:en)
VUE_APP_DEFAULT_LANG=en
```

### Installation
```
cd ECShopX_admin-frontend
npm i
```

### Run project
```shell
# B2C Business Model
npm run dev:b2c
  
# B2B2C Business Model
npm run dev:bbc
```

### Build packages
```shell
# B2C Business Model
npm run build:b2c
  
# B2B2C Business Model
npm run build:bbc
```

## License
Each ECShopX source file included in this distribution is licensed under the Apache License 2.0, together with the additional terms imposed by ShopeX.

Open Software License (Apache 2.0) – Please see LICENSE.txt for the full text of the Apache 2.0 license.

每个包含在本发行版中的 ECShopX 源文件，均依据 Apache 2.0 开源许可证与ShopeX商派附加条款进行授权。

开源软件许可协议（Apache 2.0） —— 请参阅 LICENSE.txt 文件以获取 Apache 2.0 协议的完整文本。
