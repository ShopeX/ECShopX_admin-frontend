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
      <h1 class="license-title">ECShopX 开源许可</h1>
      <!-- 英文版本 -->
      <div class="license-english">
        <h2 class="license-subtitle">EcshopX  Open Source License</h2>
        <!-- 主要内容 -->
        <div class="license-main">
          <div class="license-description">EcshopX is licensed under the Apache License 2.0, with the following additional conditions:</div>
          <div class="license-border"></div>
          <h3>ADDITIONAL TERMS PURSUANT TO SECTION 7 OF APACHE LICENSE 2.0:</h3>
          <!-- 附加条款 -->
          <div class="term-section">
            <h4>1. Branding Retention Requirement</h4>
            <ul>
              <li>You must retain all EcshopX brand identifiers visible in:</li>
              <li>User interfaces (e.g., Front-end Interface, admin consoles, login pages); </li>
              <li>This includes logos, copyright notices, and "Powered by EcshopX" labels.</li>
            </ul>
          </div>
          
          <div class="term-section">
            <h4>2. Commercial License for Branding Removal</h4>
            <ul>
              <li>If you remove or alter EcshopX brand identifiers, you must obtain a commercial license from Shopex.  Contact us at:  <a href="http://www.shopex.cn" target="_blank" class="link">http://www.shopex.cn</a> to purchase a commercial license.  </li>
            </ul>
          </div>

          <div class="term-section">
            <h4>3. In any manner violate any applicable national or international laws or regulations or infringe upon the lawful rights and interests of any third party;</h4>
          </div>
          
          <!-- 4. 执行 -->
          <div class="term-section">
            <h4>4. Enforcement</h4>
            <ul>
              <li>Failure to comply with these additional terms terminates your rights under this license.  </li>
              <li></li>
            </ul>
          </div>
          <div class="copyright">Copyright (c) 2025 Shopex</div>

          <div class="license-border"></div>
          
          <!-- Apache License 信息 -->
          <div class="apache-license">
            <p>Licensed under the Apache License, Version 2.0 (the "License");</p>
            <p>you may not use this software except in compliance with the License. </p>
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
        </div>
      </div>
      <!-- 中文版本 -->
      <div class="license-chinese">
        <h2 class="license-subtitle">EcshopX 开源许可证</h2>
        <div class="license-main">
          <div class="license-description">EcshopX 遵循 Apache 许可证 2.0 版，并附加以下条款：</div>
          <div class="license-border"></div>
          <h3>依据 Apache 许可证 2.0 第 7 节规定的附加条款：</h3>
          <div class="term-section">
            <h4>1. 品牌标识保留要求</h4>
            <ul>
              <li>您必须保留所有可见的 EcshopX 品牌标识，包括但不限于：</li>
              <li>用户界面（例如：前端界面、管理控制台、登录页面）；</li>
              <li>具体涵盖LOGO、版权声明及“Powered by EcshopX”标识等。</li>
            </ul>    
            <div class="term-section">
              <h4>2. 移除品牌标识需获取商业许可</h4>
              <ul>
                <li>
                  若需移除或修改 EcshopX 品牌标识，必须从 Shopex 获取商业许可证。请联系：
                  <a href="http://www.shopex.cn" target="_blank" class="link">http://www.shopex.cn</a> 
                  购买商业许可证。
                </li>
              </ul>
            </div>          
          </div>
        </div>
        <div class="term-section">
          <h4>3. 以任何方式违反任何适用的国家或国际法律或法规或侵犯任何第三方的合法权益；</h4>
        </div>
        <div class="term-section">
          <h4>4. 执行条款</h4>
          <ul>
            <li>若未能遵守上述附加条款，您在本许可证下的权利将自动终止。</li>
          </ul>
        </div>
        <!-- 版权信息 -->
        <div class="copyright">
          <p>版权所有 (c) 2025 Shopex</p>
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
  .license-container {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
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
    h3 {
      font-size: 16px;
      color: #262626;
      margin-bottom: 10px;
    }
    .license-description {
      font-size: 16px;
      color: #262626;
    }
    .license-border {
      margin: 30px 0px;
      border-top: 1px dashed #e1e4e8;
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
    margin-bottom: 50px;
    font-size: 14px;
    p {
      line-height: 1.6;
      color: #262626;
      margin-bottom: 5px;
    }
  }

  .license-chinese {
    margin-bottom: 30px;
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
}


</style>
