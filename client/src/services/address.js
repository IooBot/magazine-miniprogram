import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const addressFields = [
  'id',
  'user{id}',
  'username',
  'telephone',
  'isDefault',
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

// find address by id
export async function queryOneAddress(params = {}) {
  return QL.find_one('address', params, addressFields);
}

// find address by other params
export async function queryAddress(params = {}) {
  return QL.find_many('address', params, addressFields);
}

export async function createAddress (params = {}) {
  return QL.insert('address', deleteEmptyProperty(params), ['result']);
}
export async function updateAddress ({ condition, data}) {
  return QL.update('address', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteAddress (params) {
  return QL.remove('address', params, ['result']);
}
