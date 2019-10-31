/**
 * models模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];
const titleName =  dirName[0].toUpperCase() + dirName.substring(1);

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

// model文件模版
const modelTep = `
import { queryOne${titleName}, query${titleName} } from '../services/${dirName}';

export default {
  namespace: '${dirName}',

  state: {
    list: [],
    current${titleName}: {},
  },

  effects: {
    * fetchOne({ payload }, { call, put }) {
      const response = yield call(queryOne${titleName}, payload);
      yield put({
        type: 'queryOne',
        payload: response,
      });
    },
    * fetch({ payload }, { call, put }) {
      const response = yield call(query${titleName}, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * appendFetch({ payload }, { call, put }) {
      const response = yield call(query${titleName}, payload);
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
        current${titleName}: action.payload,
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
`;

// process.chdir(`./src/models`); // cd $1
process.chdir(`./draft`); // cd $1

fs.writeFileSync(`${dirName}.js`, modelTep);

console.log(`models模版${dirName}已创建,请手动修改models`);

process.exit(0);
