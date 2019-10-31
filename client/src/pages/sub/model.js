import { querySlideshow } from '../../services/slideshow';
import { queryMagazine } from "../../services/magazine"

export default {
  namespace: 'sub',

  state: {
    bannerList: [],
    productList: [],
    product:{}
  },

  effects: {
    * load({ payload }, { call, put }) {
      const response1 = yield call(querySlideshow, payload);
      const productList = yield call(queryMagazine, {status: "1"});
      // console.log("sub/load bannerList",response1)
      // console.log("sub/load productList",response2)
      let bannerList = []
      response1.forEach((item) => {
        bannerList.push(item.imgUrl)
      })

      yield put({
        type: 'save',
        payload: {
          bannerList,
          productList
        },
      });
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
