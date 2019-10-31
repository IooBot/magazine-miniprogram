import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const orderProductFields = [
  'id',
  'user{id}',
  'order{id,orderStatus}',
  'magazine{id,name}',
  'name',
  'img',
  'price',
  'subCount',
  'subMonthCount',
  'subMonth',
  'subYear',
  'unitPay',
  'createdAt',
  'updatedAt'
];

// find orderProduct by id
export async function queryOneOrderProduct(params = {}) {
  return QL.find_one('orderProduct', params, orderProductFields);
}

// find orderProduct by other params
export async function queryOrderProduct(params = {}) {
  return QL.find_many('orderProduct', params, orderProductFields);
}

export async function createOrderProduct (params = {}) {
  return QL.insert('orderProduct', deleteEmptyProperty(params), ['result']);
}
export async function updateOrderProduct ({ condition, data}) {
  return QL.update('orderProduct', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteOrderProduct (params) {
  return QL.remove('orderProduct', params, ['result']);
}
