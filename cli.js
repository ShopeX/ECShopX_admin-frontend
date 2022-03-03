const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')

const PRODUCT_LIST = [
  { name: '商派ECShopX平台标准版', model: 'platform', saas: false },
  { name: '商派ECShopX平台专业版', model: 'platform', saas: false },
  { name: '商派ECShopX社交零售SaaS版', model: 'standard', saas: true },
  { name: '商派Onex官方商城标准版', model: 'platform', saas: false },
  { name: '商派Onex官方商城专业版', model: 'platform', saas: false },
  { name: '商派Onex官方商城SaaS版', model: 'platform', saas: true },
  { name: '商派Onex云店标准版', model: 'standard', saas: false },
  { name: '商派Onex云店专业版', model: 'standard', saas: false },
  { name: '商派Onex云店集团版', model: 'standard', saas: false },
  { name: '商派Onex云店SaaS版', model: 'standard', saas: true }
]

async function createProject() {
  let { repo } = await inquirer.prompt({
    //在命令行中询问客户问题
    name: 'repo', //获取选择后的结果
    type: 'rawlist',
    message: '请选择配置的商家',
    choices: PRODUCT_LIST
  })

  const product = PRODUCT_LIST.find((item) => item.name == repo)

  const envTemplate = `VUE_APP_SYSTEM_NAME=${product.name}
VUE_APP_IS_SAAS=${product.saas}
VUE_APP_PRODUCT_MODEL=${product.model}
VUE_APP_BASE_API=https://ecshopx1.shopex123.com/api
VUE_APP_PUBLIC_PATH=/
VUE_APP_WXIMG_URL=
VUE_APP_WXAUTHCALL_Url=http://ecshopx-shop.ex-sandbox.com/
VUE_APP_PREFIXES=
VUE_APP_QIANKUN_ENTRY=/newpc/
VUE_APP_OSS_CDN=false
`
  console.log(envTemplate)

  // const content = JSON.stringify(JSON.parse(envTemplate), null, 2)
  fs.writeFileSync(path.join(__dirname, './.env'), envTemplate, 'utf8')
  console.log(chalk.green('.env 替换成功'))
}

createProject()
