import QL from 'graphql-cache'
import { deleteEmptyProperty } from '../utils/common'

const slideshowFields = [
  'id',
  'briefIntro',
  'imgUrl'
];

// find slideshow by id
export async function queryOneSlideshow(params = {}) {
  return QL.find_one('slideshow', params, slideshowFields);
}

// find slideshow by other params
export async function querySlideshow(params = {}) {
  return QL.find_many('slideshow', params, slideshowFields);
}

export async function createSlideshow (params) {
  return QL.insert('slideshow', deleteEmptyProperty(params), ['result']);
}
export async function updateSlideshow ({ condition, data}) {
  return QL.update('slideshow', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteSlideshow (params) {
  return QL.remove('slideshow', params, ['result']);
}
