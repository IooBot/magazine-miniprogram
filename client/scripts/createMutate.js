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
import { create${titleName}, update${titleName}, delete${titleName} } from '../services/${dirName}';

export default {
  namespace: '${dirName}Mutate',

  state: {
    createResult: '',
    updateResult: '',
    deleteResult: '',
  },

  effects: {
    * create({ payload }, { call, put }) {
      const response = yield call(create${titleName}, payload);
      yield put({
        type: 'saveCreateResult',
        payload: response,
      });
    },
    * update({ payload }, { call, put }) {
      const response = yield call(update${titleName}, payload);
      yield put({
        type: 'saveUpdateResult',
        payload: response,
      });
    },
    * delete({ payload }, { call, put }) {
      const response = yield call(delete${titleName}, payload);
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
`;

// process.chdir(`./src/models`); // cd $1
process.chdir(`./draft`); // cd $1

fs.writeFileSync(`${dirName}Mutate.js`, modelTep);

console.log(`models mutate模版${dirName}已创建,请手动修改models`);

process.exit(0);
