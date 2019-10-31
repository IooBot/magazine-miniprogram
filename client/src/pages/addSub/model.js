
export default {
  namespace: 'addSub',

  state: {
    subProduct: {},
    subOriginList:[],
    subCount: 1,
    subTime: [],
    subYear: "",
    subMonth: [],
    subTimeValue: ""
  },

  effects: {
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
