
import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const areaFields = [
  'id',
  'province',
  'city',
  'district'
];

// find area by id
export async function queryOneArea(params = {}, returnFields = areaFields) {
  return QL.find_one('area', params, returnFields);
}

// find area by other params
export async function queryArea(params = {}, returnFields = areaFields) {
  return QL.find_many('area', params, returnFields);
}

export async function createArea (params) {
  return QL.insert('area', deleteEmptyProperty(params), ['result']);
}
export async function updateArea ({ condition, data}) {
  return QL.update('area', condition, data , ['result']);
}
export async function deleteArea (params) {
  return QL.remove('area', params, ['result']);
}
