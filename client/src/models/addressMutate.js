import Taro from '@tarojs/taro'
import { createAddress, updateAddress, deleteAddress } from '../services/address';

export default {
  namespace: 'addressMutate',

  state: {
    createResult: '',
    updateResult: '',
    deleteResult: '',
  },

  effects: {
    * create({ payload, needToast }, { call, put }) {
      // console.log("addressMutate create payload",payload)

      const response = yield call(createAddress, payload);
      yield put({
        type: 'saveCreateResult',
        payload: {
          createResult: response
        },
      });
      // console.log("addressMutate create response",response)
      if(response.result === 'OK'){
        if(needToast){
          Taro.showToast({
            title: '地址创建成功',
            icon: 'none'
          })
          // Taro.setStorageSync('ordersAddress', payload);
          yield put({
            type: 'address/save',
            payload: {
              ordersAddress: payload,
              haveAddress: true
            },
          });
          Taro.navigateBack({
            delta: 1
          })
        }

        yield put({
          type: 'address/load'
        })
      }else {
        Taro.showToast({
          title: '地址创建失败，请重新创建',
          icon: 'none'
        })
      }
    },
    * update({ payload, needToast }, { call, put }) {
      // console.log("addressMutate update payload",payload)
      // console.log("addressMutate update needToast",needToast)

      const response = yield call(updateAddress, payload);
      yield put({
        type: 'saveUpdateResult',
        payload: {
          updateResult: response
        },
      });
      // console.log("addressMutate update response",response)
      if(response.result === 'OK'){
        if(needToast){
          Taro.showToast({
            title: '地址更新成功',
            icon: 'none'
          })
          // Taro.setStorageSync('ordersAddress', payload);
          yield put({
            type: 'address/save',
            payload: {
              ordersAddress: payload
            },
          });
          Taro.navigateBack({
            delta: 1
          })
        }
        yield put({
          type: 'address/load'
        })
      }else {
        if(needToast){
          Taro.showToast({
            title: '地址更新失败，请稍后重试',
            icon: 'none'
          })
        }
      }
    },
    * delete({ payload }, { call, put }) {
      const response = yield call(deleteAddress, payload);
      // console.log("addressMutate delete response",response)

      yield put({
        type: 'saveDeleteResult',
        payload: {
          deleteResult:response
        },
      });
      if(response === 'OK'){
        yield put({
          type: 'address/load'
        })
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
