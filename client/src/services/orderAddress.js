import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const orderAddressFields = [
  'id',
  'user{id}',
  'username',
  'telephone',
  'province',
  'city',
  'district',
  'school',
  'schoolType',
  'grade',
  'classValue',
  'address',
  'createdAt',
  'updatedAt'
];

// find orderAddress by id
export async function queryOneOrderAddress(params = {}) {
  return QL.find_one('orderAddress', params, orderAddressFields);
}

// find orderAddress by other params
export async function queryOrderAddress(params = {}) {
  return QL.find_many('orderAddress', params, orderAddressFields);
}

export async function createOrderAddress (params = {}) {
  return QL.insert('orderAddress', deleteEmptyProperty(params), ['result']);
}
export async function updateOrderAddress ({ condition, data}) {
  return QL.update('orderAddress', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteOrderAddress (params) {
  return QL.remove('orderAddress', params, ['result']);
}
