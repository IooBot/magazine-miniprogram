import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const cartFields = [
  'id',
  'user{id, openid}',
  'magazine{id, name, picture, unitPrice}',
  'count',
  'subYear',
  'subMonthCount',
  'subMonth',
  'spec',
  'createdAt',
  'updatedAt'
];

// find cart by id
export async function queryOneCart(params = {}) {
  return QL.find_one('cart', params, cartFields);
}

// find cart by other params
export async function queryCart(params = {}) {
  return QL.find_many('cart', params, cartFields);
}

export async function queryCartCount(params = {}) {
  return QL.count('cart', params);
}
export async function createCart (params) {
  return QL.insert('cart', deleteEmptyProperty(params), ['result']);
}
export async function updateCart ({ condition, data}) {
  return QL.update('cart', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteCart (params) {
  return QL.remove('cart', params, ['result']);
}
