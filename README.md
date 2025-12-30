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

### Build packages
```
npm run build:b2c
```
