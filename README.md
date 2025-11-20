<p align="center"><img width="500" height="auto" alt="logo1" src="https://github.com/user-attachments/assets/097cbde6-cedd-42d0-a2d8-a0a0430289b5" /></p>

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
cd ecshopx-admin
npm i
```

### Run project
```
npm run dev:b2c
```

## License
Each ECShopX source file included in this distribution is licensed under Apache 2.0 or the terms and conditions of the applicable Commercial License agreement between Licensee/Customer and shopeX.

Open Software License (Apache 2.0) – Please see LICENSE.txt for the full text of the Apache 2.0 license.

Subject to Licensee's/Customer's payment of fees and compliance with the terms and conditions of the applicable Commercial License agreement between Licensee/Customer and shopeX, the terms and conditions of the applicable Commercial License agreement between Licensee/Customer and shopeX supersede the Apache 2.0 license for each source file.  

每个包含在本发行版中的 ECShopX 源文件，均依据 Apache 2.0 开源许可证 或者 被许可方/客户与商派之间适用的商业授权文件中的条款与条件 进行授权。

开源软件许可协议（Apache 2.0） —— 请参阅 LICENSE.txt 文件以获取 Apache 2.0 协议的完整文本。

在被许可方/客户已支付相关费用并遵守其与shopeX之间适用商业授权文件条款与条件的前提下，
该商业授权文件中的条款与条件将取代 Apache 2.0 协议，成为每个源文件的实际适用许可条款。

### Build packages
```
npm run build:b2c
```
