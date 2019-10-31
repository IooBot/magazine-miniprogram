import Taro from '@tarojs/taro';
import { deleteOrder, queryOrder } from "../../services/order"
import { deleteOrderProduct } from "../../services/orderProduct"
import { getGlobalData } from "../../utils/global_data"

export default {
  namespace: 'order',

  state: {
    allOrderList: [],
    displayOrderList: []
  },

  effects: {
    * load({ payload, orderStatus }, { call, put }) {
      // console.log("order/load payload",payload)
      // console.log("order/load orderStatus",orderStatus)
      const user_id = getGlobalData('user_id')
      const condition = { user_id }
      const response = yield call(queryOrder, condition);
      // console.log("order/load response",response)
      yield put({
        type: 'save',
        payload: {
          allOrderList: response
        }
      });
      yield put({
        type: 'getDisplayOrderList',
        payload: {
          orderStatus
        }
      });
    },
    * deleteOrder({payload, orderStatus, callback}, {call, put}) {
      const { condition1, condition2 } = payload
      const deleteOrderResult = yield call(deleteOrder, condition1);
      const deleteOrderProductResult = yield call(deleteOrderProduct, condition2);
      // console.log("order/deleteOrder deleteOrderResult",deleteOrderResult)
      // console.log("order/deleteOrder deleteOrderProductResult",deleteOrderProductResult)

      if(deleteOrderResult === 'OK' && deleteOrderProductResult === 'OK' ){
        Taro.showToast({
          title: '删除成功',
          icon: 'none'
        })
        if(callback) callback()
        yield put({
          type: 'load',
          orderStatus
        });
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    getDisplayOrderList(state, { payload }) {
      const { allOrderList } = state
      const { orderStatus } = payload
      const displayOrderList = allOrderList.filter((item)=> item.orderStatus === orderStatus)
      // console.log("getDisplayOrderList displayOrderList",displayOrderList)
      return {
        ...state,
        displayOrderList
      };
    },
  },
};
