/**
 * models模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');
// console.log("process",process)

const dirName = process.argv[2];
const titleName =  dirName[0].toUpperCase() + dirName.substring(1);

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

// services文件模版
const serviceTep = `
import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const ${dirName}Fields = [
  'id',
];

// find ${dirName} by id
export async function queryOne${titleName}(params = {}) {
  return QL.find_one('${dirName}', params, ${dirName}Fields);
}


// find ${dirName} by other params
export async function query${titleName}(params = {}) {
  return QL.find_many('${dirName}', params, ${dirName}Fields);
}

export async function create${titleName} (params) {
  return QL.insert('${dirName}', deleteEmptyProperty(params), ['result']);
}
export async function update${titleName} ({ condition, data}) {
  return QL.update('${dirName}', condition, deleteEmptyProperty(data) , ['result']);
}
export async function delete${titleName} (params) {
  return QL.remove('${dirName}', params, ['result']);
}
`;

// process.chdir(`./src/services`); // cd $1
process.chdir(`./draft`); // cd $1

fs.writeFileSync(`${dirName}.js`, serviceTep);

console.log(`services模版${dirName}已创建,请手动修改services`);

process.exit(0);
