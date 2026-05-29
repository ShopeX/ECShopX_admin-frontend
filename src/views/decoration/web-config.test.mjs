import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (filePath) => readFileSync(path.resolve(root, filePath), 'utf8')

test('web config page contains mall logo, login page, and SEO settings', () => {
  const source = read('src/views/decoration/web-config.vue')

  assert.match(source, /商城全局配置/)
  assert.match(source, /component:\s*'Divider'/)
  assert.match(source, /商城 Logo/)
  assert.match(source, /登录页/)
  assert.match(source, /SEO 配置/)
  assert.match(source, /fieldName:\s*'logo_light'/)
  assert.match(source, /fieldName:\s*'logo_dark'/)
  assert.doesNotMatch(source, /fieldName:\s*'login_logo'/)
  assert.match(source, /fieldName:\s*'login_background'/)
  assert.match(source, /fieldName:\s*'title'/)
  assert.match(source, /fieldName:\s*'mate_description'/)
  assert.match(source, /fieldName:\s*'mate_keywords'/)
  assert.match(source, /component:\s*'Textarea'/)
})

test('web config page loads and saves mall global plus SEO settings through two APIs', () => {
  const source = read('src/views/decoration/web-config.vue')

  assert.match(source, /getLoginPageSetting/)
  assert.doesNotMatch(source, /getGlobalSetting/)
  assert.match(source, /getTdkglobalset/)
  assert.match(source, /saveLoginPageSetting/)
  assert.doesNotMatch(source, /saveGlobalSetting/)
  assert.match(source, /saveTdkglobalset/)
  assert.match(source, /logo_light:\s*loginPageSetting\.logo_light/)
  assert.match(source, /logo_dark:\s*loginPageSetting\.logo_dark/)
  assert.match(source, /login_background:\s*loginPageSetting\.background/)
  assert.match(source, /logo_light:\s*values\.logo_light/)
  assert.match(source, /logo_dark:\s*values\.logo_dark/)
  assert.doesNotMatch(source, /login_logo/)
  assert.match(source, /background:\s*values\.login_background/)
  assert.match(source, /title:\s*tdkSetting\.title/)
  assert.match(source, /mate_description:\s*tdkSetting\.mate_description/)
  assert.match(source, /mate_keywords:\s*tdkSetting\.mate_keywords/)
  assert.match(source, /title:\s*values\.title/)
  assert.match(source, /mate_description:\s*values\.mate_description/)
  assert.match(source, /mate_keywords:\s*values\.mate_keywords/)
  assert.doesNotMatch(source, /seo_title/)
  assert.doesNotMatch(source, /seo_keywords/)
  assert.doesNotMatch(source, /seo_description/)
})

test('web config API and routes are wired to the new page', () => {
  const api = read('src/api/webtemplate.js')
  const moduleRoute = read('src/router/routes/modules/decoration.js')
  const legacyRoute = read('src/router/src/route-template.js')

  assert.match(api, /getLoginPageSetting/)
  assert.match(api, /saveLoginPageSetting/)
  assert.match(api, /\/pctemplate\/loginPage\/setting/)
  assert.doesNotMatch(api, /\/pctemplate\/global\/setting/)
  assert.match(moduleRoute, /商城全局配置/)
  assert.equal((moduleRoute.match(/@\/views\/decoration\/web-config/g) || []).length, 2)
  assert.equal((legacyRoute.match(/@\/views\/decoration\/web-config/g) || []).length, 2)
})

test('SpFormPlus provides Divider and Textarea field components', () => {
  const field = read('src/components/sp-form-plus/form-field.js')
  const form = read('src/components/sp-form-plus/index.vue')
  const styles = read('src/components/sp-form-plus/form-field.scss')
  const useForm = read('src/composables/useForm.js')

  assert.match(field, /renderDivider/)
  assert.match(field, /renderTextarea/)
  assert.match(field, /divider:\s*\(props\)\s*=>\s*this\.renderDivider\(props\)/)
  assert.match(field, /imagepicker:\s*\(props\)\s*=>\s*this\.renderImagePicker\(props\)/)
  assert.match(field, /textarea:\s*\(props\)\s*=>\s*this\.renderTextarea\(props,\s*hFn\)/)
  assert.match(form, /\['group', 'divider'\]\.includes\(item\.component\.toLowerCase\(\)\)/)
  assert.match(styles, /\.form-field-divider/)
  assert.doesNotMatch(styles, /\.form-field-group/)
  assert.match(styles, /background-color:\s*#298dff/)
  assert.match(styles, /padding:\s*6px 0 6px 8px/)
  assert.match(styles, /font-weight:\s*500/)
  assert.match(styles, /font-size:\s*16px/)
  assert.match(useForm, /formData:\s*\{\s*\.\.\.\(this\.value \|\| \{\}\)\s*\}/)
  assert.match(useForm, /value:\s*this\.formData/)
  assert.doesNotMatch(useForm, /value:\s*this\.value/)
})
