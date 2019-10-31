import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const magazineFields = [
  'id',
  'suitableGrade',
  'picture',
  'magazineIntro',
  'unitPrice',
  'name',
  'enableSub',
  'specList',
  'status'
];

// find magazine by id
export async function queryOneMagazine(params = {}) {
  return QL.find_one('magazine', params, magazineFields);
}

// find magazine by other params
export async function queryMagazine(params = {}) {
  return QL.find_many('magazine', params, magazineFields);
}

export async function createMagazine (params) {
  return QL.insert('magazine', deleteEmptyProperty(params), ['result']);
}
export async function updateMagazine ({ condition, data}) {
  return QL.update('magazine', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteMagazine (params) {
  return QL.remove('magazine', params, ['result']);
}
