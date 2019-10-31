import Taro, { Component } from '@tarojs/taro';
import '@tarojs/async-await';
import { Provider } from '@tarojs/redux';
// import * as QL from 'shortql/graphql_cache.core'
import QL from 'graphql-cache'
import dva from './utils/dva';
import models from './models';
import Sub from './pages/sub'
// import {graphqlEndpoint} from "./config";
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/sub/index',
      'pages/cart/index',
      'pages/addSub/index',
      'pages/orders/index',
      'pages/user/index',
      'pages/address/index',
      'pages/address/edit/index',
      'pages/pay/index',
      'pages/order/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({env: "mock-fc-test",traceUser: true})
      // Taro.cloud.init({env: "ecommerce-1d65f5", traceUser: true})
    }
    // init connect with wx cloud db
    const db = wx.cloud.database();
    const schema = "enum Sort_by {asc, desc}  type address { address : String!   updatedAt : String!   isDefault : Boolean!   school : String!   telephone : String!   city : String!   username : String!   createdAt : String!   grade : Int!   id : String!   classValue : Int!   schoolType : String!   province : String!   user : user!   district : String! }  type cart { subMonthCount : Int!   updatedAt : String!   subYear : Int!   subMonth : [Int]   createdAt : String!   spec : String!   id : String!   count : Int!   magazine : magazine!   user : user! }  type orderProduct { subCount : Int!   subMonthCount : Int!   updatedAt : String!   subYear : Int!   unitPay : Float!   name : String!   subMonth : [Int]   createdAt : String!   spec : String!   id : String!   order : order!   magazine : magazine!   price : Float!   user : user!   img : String! }  type school { address : String!   type : String!   status : String!   area : area!   id : String!   name : String! }  type payRecord { transaction_id : String!   trade_no : String!   time : String!   total_fee : String!   openid : String!   cash_fee : String! }  type orderAddress { address : String!   updatedAt : String!   school : String!   telephone : String!   city : String!   username : String!   createdAt : String!   grade : Int!   id : String!   order : [order]   classValue : Int!   schoolType : String!   province : String!   user : user!   district : String! }  type slideshow { imgUrl : String!   id : String!   briefIntro : String! }  type order { updatedAt : String!   orderProduct : [orderProduct]   expressStatus : String!   totalPrice : Float!   createdAt : String!   orderStatus : String!   expressContent : String!   orderAddress : orderAddress!   id : String!   orderProductCount : Int!   user : user!   expressNumber : String! }  type area { city : String!   id : String!   province : String!   district : String!   school : [school] }  type magazine { magazineIntro : String!   suitableGrade : [String]   orderProduct : [orderProduct]   cart : [cart]   name : String!   specList : [String]   status : String!   id : String!   picture : String!   unitPrice : Float!   enableSub : [Int] }  type user { updatedAt : String!   orderProduct : [orderProduct]   cart : [cart]   telephone : String!   username : String!   createdAt : String!   orderAddress : [orderAddress]   address : [address]   openid : String!   id : String!   order : [order] }"
    const key_info = JSON.parse("{\"orderProduct\":{\"key\":\"id\",\"type\":\"String\"},\"area\":{\"key\":\"id\",\"type\":\"String\"},\"cart\":{\"key\":\"id\",\"type\":\"String\"},\"user\":{\"key\":\"id\",\"type\":\"String\"},\"orderAddress\":{\"key\":\"id\",\"type\":\"String\"},\"magazine\":{\"key\":\"id\",\"type\":\"String\"},\"address\":{\"key\":\"id\",\"type\":\"String\"},\"order\":{\"key\":\"id\",\"type\":\"String\"},\"slideshow\":{\"key\":\"id\",\"type\":\"String\"},\"payRecord\":{\"key\":\"transaction_id\",\"type\":\"String\"},\"school\":{\"key\":\"id\",\"type\":\"String\"}}")
    const visual_info = JSON.parse("{\"address\":{\"user\":\"user_id\"},\"cart\":{\"magazine\":\"magazine_id\",\"user\":\"user_id\"},\"orderProduct\":{\"magazine\":\"magazine_id\",\"order\":\"order_id\",\"user\":\"user_id\"},\"school\":{\"area\":\"area_id\"},\"orderAddress\":{\"user\":\"user_id\"},\"order\":{\"orderAddress\":\"orderAddress_id\",\"user\":\"user_id\"}}")
    const reverse_info = JSON.parse("{\"orderAddress\":[\"order\"],\"order\":[\"orderProduct\"],\"area\":[\"school\"],\"magazine\":[\"orderProduct\",\"cart\"],\"user\":[\"order\",\"orderAddress\",\"orderProduct\",\"cart\",\"address\"]}");
    const option = {schema, key_info, visual_info, reverse_info ,enable_log: false};
    QL.init(db, null, option);

    // QL.init(graphqlEndpoint, Taro.request, {enable_log : false});
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Sub />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
