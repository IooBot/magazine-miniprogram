import moment from 'moment'
import { createUser, queryUser } from '../../services/user';
import { idGen } from "../../utils/common"
import { setGlobalData } from "../../utils/global_data"

export default {
  namespace: 'user',

  state: {
   user:{}
  },

  effects: {
    * load({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      // console.log("response",response)
      yield put({
        type: 'save',
        payload: {
          user: response[0]
        },
      });
    },
    * findAndCreate({ payload }, { call, put}){
      // console.log("user/findAndCreate payload",payload)
      const queryUserResult = yield call(queryUser, payload);
      // console.log("user/findAndCreate queryUserResult",queryUserResult)
      if(queryUserResult.length){
        setGlobalData('user_id', queryUserResult[0].id)
        yield put({
          type: 'save',
          payload: {
            user: queryUserResult[0]
          },
        });
      }else {
        const id =  idGen('user');
        const user={
          id,
          openid: payload.openid,
          username :'',
          telephone :'',
          createdAt:moment().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt :''
        }
        const createUserResult = yield call(createUser, user);
        // console.log("user/findAndCreate createUserResult",createUserResult)
        if(createUserResult.result === 'OK'){
          setGlobalData('user_id', id)
          yield put({
            type: 'save',
            payload: {
              user
            }
          });
        }
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
