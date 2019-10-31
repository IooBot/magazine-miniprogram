
export default {
  namespace: 'pay',

  state: {
    pay:{},
    payOrder: {}
  },

  effects: {
    * load({ payload }, { call, put }) {

    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
