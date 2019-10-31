import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const orderFields = [
  'id',
  'user{id}',
  'orderAddress{id,username,telephone,address,grade,classValue}',
  'orderProduct{id,name,img,spec,subYear,subMonth,subCount,magazine{name,picture,unitPrice},order{id}}',
  'orderStatus',
  'orderProductCount',
  'totalPrice',
  'expressStatus',
  'expressContent',
  'expressNumber',
  'createdAt',
  'updatedAt'
];

// find order by id
export async function queryOneOrder(params = {}) {
  return QL.find_one('order', params, orderFields);
}

// find order by other params
export async function queryOrder(params = {}) {
  return QL.find_many('order', params, orderFields);
}

export async function createOrder (params = {}) {
  return QL.insert('order', deleteEmptyProperty(params), ['result']);
}
export async function updateOrder ({ condition, data}) {
  return QL.update('order', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteOrder (params) {
  return QL.remove('order', params, ['result']);
}
