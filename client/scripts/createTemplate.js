/**
 * node c componentName
 * @componentName {String} 组件名
 */

const fs = require('fs');
const path = require('path');

// 获取到组件名
// const args = process.argv.splice(2);
// const componentName = args[0];
const componentName = process.argv[2];
// console.log("componentName",componentName)
const ComponentName = componentName[0].toUpperCase() + componentName.substring(1);
// console.log("ComponentName",ComponentName)

console.log('prepare to creat a ' + componentName + ' component');

// let root = './src/models/';
let root = './draft/';
// console.log("__dirname",__dirname)

// 读取模板文件，并修改内容
// let template = fs.readFileSync(path.join(__dirname, `./${componentName}.js`), 'utf8');
let template = fs.readFileSync(path.join(__dirname, `./models.js`), 'utf8');
let content = template.replace(/componentName/g, componentName); // target file content
content = content.replace(/ComponentName/g, ComponentName); // target file content

// console.log("content",content)

// 目标文件夹和目标文件的路径
// let targetDirPath = path.join(__dirname, root, componentName);
let targetFilePath = path.join(root, componentName + '.js');

// mkdirSync
// if (!fs.existsSync(targetDirPath)) {
//   fs.mkdirSync(targetDirPath);
//   console.log('The ' + targetDirPath + ' folder has been created!');
// }

// writeFile async
if (!fs.existsSync(targetFilePath)) {
  fs.writeFile(targetFilePath, content, (err) => {
    if (err) throw err;
    console.log('The ' + targetFilePath + ' has been created!');
  });
} else {
  console.error('error!\n' + targetFilePath + ' has already been existed!');
}
