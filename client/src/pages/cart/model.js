import Taro from '@tarojs/taro';
import {queryCart, deleteCart, queryCartCount} from '../../services/cart';
import {getGlobalData, setGlobalData} from "../../utils/global_data"

export default {
  namespace: 'cart',

  state: {
    pageType: 'detail',
    cartList: [],
    cartCount: 0,
    selectList: [],
    checkedCount: 0,
    selectedCount: 0,
    totalPrice: 0,
    isSelectAll: false
  },

  effects: {
    * load({payload}, {call, put}) {
      const user_id = getGlobalData('user_id')
      const condition = {user_id}
      const response = yield call(queryCart, condition);
      // console.log("cart/load response", response)
      const cartCount = response && response.length
      // console.log("cart/load cartCount", cartCount)
      setGlobalData('cartCount',cartCount)

      yield put({
        type: 'changeCartList',
        payload: {
          cartList: response,
          cartCount
        },
      });
      yield put({
        type: 'save',
        payload: {
          isSelectAll: false
        }
      });
    },
    *queryCount({}, {call, put}){
      const user_id = getGlobalData('user_id')
      const condition = {user_id}
      const response = yield call(queryCartCount, condition);
      // console.log("cart/queryCount response",response)
      if(response || response === 0) setGlobalData('cartCount',response)

      yield put({
        type: 'save',
        payload: {
          cartCount: response
        }
      });
    },
    * deleteCart({callback}, {call, put, select}) {
      const { selectList } = yield select(state => state.cart);
      const { id: user_id } = yield select(state => state.user);
      // console.log("cart/deleteCart user_id",user_id)

      const deleteIdList = selectList.map(item => item.id)
      const params = {where:{id: {_in: deleteIdList}}}
      const response = yield call(deleteCart, params);

      if(response === 'OK'){
        Taro.showToast({
          title: '删除成功',
          icon: 'none'
        })
        yield put({
          type: 'changeCartPage',
        });

        if(callback) callback()
        yield put({
          type: 'save',
          payload: {
            selectedCount: 0,
            totalPrice: 0
          }
        });
        yield put({
          type: 'load',
          payload: {
            user_id
          }
        });
      }
    }
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
    changeCartList(state, {payload}) {
      const { cartList } = payload;
      const newCartList = cartList.map((item) => {
        item.checked = false
        return item
      })
      return {
        ...state,
        cartList: newCartList
      }
    },
    changeCartPage(state, { payload }) {
      const { pageType } = state;
      const newPageType = pageType === 'detail' ? 'edit' : 'detail'
      return {
        ...state,
        pageType: newPageType
      }
    },
    changeCount(state, { payload }) {
      const { cartList } = state;
      const { i, count } = payload;
      const newCartList = cartList.map((item,index)=>{
        if(index===i){
          item.count = count
          return item
        }else {
          return item
        }
      })

      return {
        ...state,
        cartList: newCartList
      }
    },
    changeCheckedStatus(state, { payload }) {
      const { cartList } = state;
      const { i } = payload;
      const newCartList = cartList.map((item,index)=>{
        if(index===i){
          item.checked=!item.checked
        }
        return item
      })
      const selectList = cartList.filter((item)=> item.checked === true)
      const checkedLength = selectList.length
      const newSelectAll = cartList.length === checkedLength

      return {
        ...state,
        cartList: newCartList,
        selectList,
        isSelectAll: newSelectAll,
      }
    },
    changeCheckedAll(state, { payload }) {
      const { cartList, isSelectAll } = state;
      let newCartList, newSelectAll, selectList;
      if(!isSelectAll){
        newCartList = cartList.map((item)=>{
          item.checked=true
          return item
        })
        newSelectAll=true
        selectList = newCartList
      }else{
        newCartList = cartList.map((item)=>{
          item.checked=false
          return item
        })
        newSelectAll=false
        selectList = []
      }
      return {
        ...state,
        cartList: newCartList,
        isSelectAll: newSelectAll,
        selectList
      }
    }
  }
}
