import { queryOneCart, queryCart } from '../services/cart';

export default {
  namespace: 'cartList',

  state: {
    list: [],
    currentCart: {},
  },

  effects: {
    * fetchOne({ payload }, { call, put }) {
      const response = yield call(queryOneCart, payload);
      yield put({
        type: 'queryOne',
        payload: response,
      });
    },
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryCart, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * appendFetch({ payload }, { call, put }) {
      const response = yield call(queryCart, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryOne(state, action) {
      return {
        ...state,
        currentCart: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
