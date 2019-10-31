import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const schoolFields = [
  'id',
  'name',
  'address',
  'status',
  'type'
];

// find school by id
export async function queryOneSchool(params = {}) {
  return QL.find_one('school', params, schoolFields);
}

// find school by other params
export async function querySchool(params = {}) {
  return QL.find_many('school', params, schoolFields);
}

export async function createSchool (params) {
  return QL.insert('school', deleteEmptyProperty(params), ['result']);
}
export async function updateSchool ({ condition, data}) {
  return QL.update('school', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteSchool (params) {
  return QL.remove('school', params, ['result']);
}
