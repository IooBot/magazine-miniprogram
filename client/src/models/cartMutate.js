import Taro from '@tarojs/taro'
import { createCart, updateCart, deleteCart } from '../services/cart';

export default {
  namespace: 'cartMutate',

  state: {
    createResult: '',
    updateResult: '',
    deleteResult: '',
  },

  effects: {
    * create({ payload }, { call, put }) {
      // console.log("create payload",payload)
      const response = yield call(createCart, payload);
      yield put({
        type: 'saveCreateResult',
        payload: response,
      });
      // console.log("cartMutate create response",response)
      if(response.result === 'OK'){
        Taro.showToast({
          title: '成功添加至购物车',
          icon: 'none'
        })
        yield put({
          type: 'cart/load'
        });
      }
    },
    * update({ payload }, { call, put }) {
      const response = yield call(updateCart, payload);
      yield put({
        type: 'saveUpdateResult',
        payload: response,
      });
      if(response.result === 'OK'){
        yield put({
          type: 'cart/load'
        });
      }
    },
    * delete({ payload }, { call, put }) {
      const { deleteIdList } = payload
      const params = {where:{id: {_in: deleteIdList}}}
      const response = yield call(deleteCart, params);

      yield put({
        type: 'saveDeleteResult',
        payload: {
          deleteResult: response
        },
      });
      if(response === 'OK'){
        yield put({
          type: 'cart/load'
        });
      }
    },
  },

  reducers: {
    saveCreateResult(state, action) {
      return {
        ...state,
        createResult: action.payload,
      };
    },
    saveUpdateResult(state, action) {
      return {
        ...state,
        updateResult: action.payload,
      };
    },
    saveDeleteResult(state, action) {
      return {
        ...state,
        deleteResult: action.payload,
      };
    },
  },
};
