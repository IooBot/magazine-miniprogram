import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const userFields = [
  'id',
  'openid',
  'username',
  'telephone',
  'createdAt',
  'updatedAt'
];

// find user by id
export async function queryOneUser(params = {}) {
  return QL.find_one('user', params, userFields);
}

// find user by other params
export async function queryUser(params = {}) {
  return QL.find_many('user', params, userFields);
}

export async function createUser (params) {
  return QL.insert('user', deleteEmptyProperty(params), ['result']);
}
export async function updateUser ({ condition, data}) {
  return QL.update('user', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteUser (params) {
  return QL.remove('user', params, ['result']);
}
