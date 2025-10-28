<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage class="license-page" bgColor="#f5f5f5">
    <div class="license-container">
      <div class="license-content">
        <!-- 标题 -->
        <h1 class="license-title">License</h1>
        
        <!-- 副标题 -->
        <h2 class="license-subtitle">ECShopX  Open Source License</h2>
        
        <!-- 主要内容 -->
        <div class="license-main">
          <p class="license-description">ECShopX is licensed under the Apache License 2.0, with the following additional conditions:</p>
          <div class="license-border"></div>
          <!-- 附加条款 -->
          <div class="additional-terms">
            <h3>ADDITIONAL TERMS PURSUANT TO SECTION 7 OF APACHE LICENSE 2.0: </h3>
            
            <!-- 1. 品牌保留要求 -->
            <div class="term-section">
              <h4>1. Branding Retention Requirement</h4>
              <ul>
                <li>You must retain all ECShopX brand identifiers visible in: </li>
                <li>User interfaces (e.g., Front-end Interface, admin consoles, login pages);</li>
                <li>This includes logos, copyright notices, and "Powered by ShopeX" labels.</li>
              </ul>
            </div>
            
            <!-- 2. 商业许可证 -->
            <div class="term-section">
              <h4>2. Commercial License for Branding Removal</h4>
              <ul>
                <li>If you remove or alter ECShopX brand identifiers, you must obtain a commercial license from ShopeX.</li>
                <li>Contact us at: ** <a href="http://www.shopex.cn" target="_blank" class="link">http://www.shopex.cn</a>** to purchase a commercial license.</li>
              </ul>
            </div>
            
            <!-- 3. 执行 -->
            <div class="term-section">
              <h4>3. Enforcement</h4>
              <ul>
                <li>Failure to comply with these additional terms terminates your rights under this license.</li>
                <li>Copyright (c) 2025 ShopeX</li>
              </ul>
            </div>
          </div>

          <div class="license-border"></div>
          
          <!-- Apache License 信息 -->
          <div class="apache-license">
            <p>Licensed under the Apache License, Version 2.0 (the "License");</p>
            <p>You may not use this software except in compliance with the License.</p>
            <p>You may obtain a copy of the License at:</p>
            <p class="license-link">
              <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank" class="link">
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>
            <p>Unless required by applicable law or agreed to in writing, software</p>
            <p>distributed under the License is distributed on an "AS IS" BASIS,</p>
            <p>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</p>
            <p>See the License for the specific language governing permissions and</p>
            <p>limitations under the License.</p>
          </div>
          
          <!-- 中文版本 -->
          <div class="chinese-version">
            <p>ECShopX 开源许可证</p>
            <p>ECShopX 遵循 Apache 许可证 2.0 版，并附加以下条款：</p>
            
            <p>依据 Apache 许可证 2.0 第 7 节规定的附加条款：</p>
            
            <div class="chinese-terms">
              <p>品牌标识保留要求</p>
              <p>您必须保留所有可见的 ECShopX 品牌标识，包括但不限于：</p>
              <ul>
                <li>用户界面（例如：前端界面、管理控制台、登录页面）；</li>
                <li>具体涵盖LOGO、版权声明及“Powered by ShopeX”标识等。</li>
              </ul>
              
              <p>移除品牌标识需获取商业许可</p>
              <p>若需移除或修改 ECShopX 品牌标识，必须从 ShopeX 获取商业许可证。</p>
              <p>
                请联系：**
                <a href="http://www.shopex.cn" target="_blank" class="link">http://www.shopex.cn</a> 
                ** 购买商业许可证。
              </p>
            </div>
          </div>
          <div class="chinese-apache mt-40">
            <p>执行条款</p>
            <p>若未能遵守上述附加条款，您在本许可证下的权利将自动终止。</p>
          </div>
          <!-- 版权信息 -->
          <div class="copyright">
            <p>版权所有 (c) 2025 ShopeX</p>
          </div>
        </div>
      </div>
    </div>
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.license-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.license-container {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
}

.license-content {
  padding: 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #262626;
  border-radius: 6px;
}

.license-title {
  font-size: 36px;
  margin: 0 0 8px 0;
  color: #262626;
}

.license-subtitle {
  font-size: 18px;
  margin-bottom: 10px;
  color: #262626;
}

.license-main {
  .license-description {
    font-size: 16px;
    color: #262626;
  }
  .license-border {
    margin: 30px 0px;
    height: 1px;
    background-color: #e1e4e8;
  }
}

.additional-terms {
  h3 {
    font-size: 16px;
    margin: 0 0 20px 0;
    color: #262626;
  }
}

.term-section {
  margin-bottom: 24px;
  
  h4 {
    font-size: 15px;
    margin: 0 0 8px 0;
    color: #262626;
  }
  
  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 8px 0;
    color: #262626;
  }
  
  ul {
    margin: 8px 0 16px 0;
    padding-left: 20px;
    
    li {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 4px;
      color: #262626;
    }
  }
}

.apache-license {
  margin-bottom: 30px;
  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 12px 0;
    color: #262626;

  }
  
  .license-link {
    margin: 16px 0;
  }
}

.chinese-version {
  margin-bottom: 30px;
  h3 {
    font-size: 16px;
    margin: 0 0 16px 0;
    color: #262626;
  }
  
  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 12px 0;
    color: #262626;
  }
}

.chinese-terms {
  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 8px 0;
    color: #262626;
  }
  
  ul {
    margin: 8px 0 16px 0;
    padding-left: 20px;
    
    li {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 4px;
      color: #262626;
    }
  }
}

.chinese-apache {
  margin-top: 20px;
  
  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 8px 0;
    color: #262626;
  }
  
  .license-link {
    margin: 12px 0;
  }
}

.copyright {
  margin-top: 30px;
  p {
    font-size: 14px;
    margin: 0;
    color: #262626;
    
    strong {
      font-weight: 600;
    }
  }
}

.link {
  color: #0366d6;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .license-content {
    padding: 20px;
  }
  
  .license-title {
    font-size: 28px;
  }
  
  .license-subtitle {
    font-size: 16px;
  }
}
</style>
