// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

export default `
body {
  background-color: #f6f7f9;
}
.sp-iframe--mark{
   position:absolute;
    left:0;
  top:0;
  width:100%;
   height:100%;
}
.page-template {
  margin: 0 auto;
  padding: 20px 0;
}
.template-active{
  position:relative
}
.template-active .mark{
  z-index:1000;
  position:absolute;
  justify-content:end;
  align-items:start;
  display:flex ;
  padding:8px;
  width:100%;
  height:100%;
  left:0;
  top:0;
  background:rgba(0,0,0,0.1);
}
.mark{
  display:none;
}
.mark .button-item{
  cursor:pointer;
  box-sizing:content-box;
  padding:4px 8px;
  width:50px;
  line-height: 12px;
  border-radius: 2px;
  font-size: 12px;
  margin-bottom:12px
}
.button-item{
  text-align: center;
  color: #fff;
  text-shadow:1px 1px 1px #333;
  border-radius: 5px;
  margin-right: 20px;
  position: relative;
  overflow: hidden;
  border:1px solid #333;
  box-shadow: 0 1px 2px #8b8b8b inset,0 -1px 0 #3d3d3d inset,0 -2px 3px #8b8b8b inset;
  background: -webkit-linear-gradient(top,#656565,#4c4c4c);
  background: -moz-linear-gradient(top,#656565,#4a4a4a);
  background: linear-gradient(top,#656565,#4a4a4a);
}
.button-primary{
  margin:40px auto;
  width:200px;
  text-align: center;
  color: #fff;
  text-shadow:1px 1px 1px #333;
  height:40px;
  font-size: 22px;
  overflow: hidden;
  line-height: 40px;
  border:1px solid #333;
  box-shadow: 0 1px 2px #8b8b8b inset,0 -1px 0 #3d3d3d inset,0 -2px 3px #8b8b8b inset;
  background: -webkit-linear-gradient(top,#656565,#4c4c4c);
  background: -moz-linear-gradient(top,#656565,#4a4a4a);
  background: linear-gradient(top,#656565,#4a4a4a);
}
.button-item:active{
  transition: opacity 1s ease;
  opacity: 0.8;
}
.template-active:before {
  border: 1px solid #6a97e5 !important;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0;
  box-sizing: border-box;
  z-index: 99;
  cursor: move;
  pointer-events: none;
}
.wgt-hover:before {
  border: 1px dashed #155bd4;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0;
  box-sizing: border-box;
  z-index: 99;
  cursor: move;
}
.wgt-tip {
  position: absolute;
  left: 24px;
  background-color: #fff;
  width: 60px;
  text-align: center;
  border-radius: 2px;
  font-size: 12px;
  padding: 2px 6px;
  box-shadow: 0 2px 4px 0 rgba(1, 1, 1, 0.1);
  box-sizing: border-box;
}
.wgt-tip:after {
  content: ' ';
  top: 50%;
  transform: translateY(-50%);
  right: -10px;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-left-color: #fff;
  position: absolute;
}
`
