//云开发实现支付
const cloud = require('wx-server-sdk')
cloud.init();

//1，引入支付的三方依赖
const tenpay = require('tenpay');
//2，配置支付信息  注意：修改后需重新部署云函数
const config = {
  appid: 'xxx', // 小程序appid
  mchid: 'xxx', // 你的微信商户号
  partnerKey: 'xxx', // 你的微信支付安全密钥
  notify_url: 'xxx', //支付回调网址,这里可以先随意填一个网址 如：https://mp.weixin.qq.com
  spbill_create_ip: ''
};

exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    orderid,
    money
  } = event;
  //3，初始化支付
  const api = tenpay.init(config);

  let result = await api.getPayParams({
    out_trade_no: orderid,
    body: 'test',  // 商品简单描述
    total_fee: money, //订单金额(分) 注意最少为1,
    openid: wxContext.OPENID //付款用户的openid
  });
  console.log("cloud getPayParams result",result)
  return result;
}
