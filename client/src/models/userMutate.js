import { createUser, updateUser, deleteUser } from '../services/user';

export default {
  namespace: 'userMutate',

  state: {
    createResult: '',
    updateResult: '',
    deleteResult: '',
  },

  effects: {
    * create({ payload }, { call, put }) {
      const response = yield call(createUser, payload);
      yield put({
        type: 'saveCreateResult',
        payload: response,
      });
    },
    * update({ payload }, { call, put }) {
      const response = yield call(updateUser, payload);
      yield put({
        type: 'saveUpdateResult',
        payload: response,
      });
    },
    * delete({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
      yield put({
        type: 'saveDeleteResult',
        payload: response,
      });
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
