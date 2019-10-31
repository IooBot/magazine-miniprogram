import Taro from '@tarojs/taro';
import moment from 'moment'
import { createOrderAddress } from "../../services/orderAddress"
import { createOrder } from "../../services/order"
import { createOrderProduct } from "../../services/orderProduct"
import { getGlobalData } from "../../utils/global_data"

export default {
  namespace: 'orders',

  state: {
    ordersList: [],
    totalPrice: 0,
    ordersType: "",
    createOrderStatus: false
  },

  effects: {
    * createOrderData({payload}, {call, put, all, select}) {
      const { orderAddressData, orderContent, tag } = payload
      const { ordersList, ordersType } = yield select(state => state.orders);
      const createOrderAddressResult = yield call(createOrderAddress, orderAddressData);
      // console.log("createOrderData createOrderAddressResult", createOrderAddressResult)

      const createOrderResult = yield call(createOrder, orderContent);
      // console.log("createOrderData createOrderResult", createOrderResult)
      const user_id = getGlobalData("user_id");

      const createOrderProductResult = yield all(ordersList.map((item,index) => {
        // console.log(`orderProduct${index}`,item)
        const {magazine, count, subMonthCount, subMonth, subYear, spec} = item;
        const {id: magazine_id, name, picture: img, unitPrice: price} = magazine;
        const nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
        const orderProductId =  nowTime.replace(/[^0-9]/ig, "").substr(2) + tag +index
        const unitPay = parseFloat((count * price).toFixed(2))

        const orderProduct = {
          id: orderProductId,
          user_id,
          order_id: orderContent.id,
          magazine_id,
          name,
          img,
          price,
          spec,
          subCount: count,
          subMonthCount,
          subMonth,
          subYear,
          unitPay,
          createdAt: nowTime,
          updatedAt: ""
        }
        // console.log(`orderProduct${index}`,orderProduct)

        return call(createOrderProduct, orderProduct);
      }))
      // console.log("createOrderData createOrderProductResult", createOrderProductResult)

      yield put({
        type: 'save',
        payload: {
          createOrderStatus: false
        },
      });
      if(createOrderAddressResult.result === "OK" && createOrderResult.result === "OK" && createOrderProductResult){
        yield put({
          type: 'pay/save',
          payload: {
            payOrder: orderContent
          }
        })
        // 购物车选择后下单，删除购物车相应内容，直接下单无需删除
        if(ordersType === "cartOrders"){
          const deleteIdList = ordersList.map(item => item.id) || []
          // console.log('createOrderData deleteCart deleteIdList',deleteIdList)
          yield put({
            type: 'cartMutate/delete',
            payload: {
              deleteIdList
            }
          })
        }

        Taro.navigateTo({
          url: `/pages/pay/index`
        })
      }else {
        Taro.showToast({
          title:'订单创建失败，请稍后重试',
          icon: 'none'
        })
      }
    },
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    }
  }
}
