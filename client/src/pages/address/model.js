import { queryAddress } from '../../services/address';
import { queryArea, queryOneArea } from "../../services/area"
import { changeAreaList, changeSchoolList, getGradeClassList } from "../../utils/common"
import { getGlobalData } from "../../utils/global_data"

export default {
  namespace: 'address',

  state: {
    addressList: [],
    defaultAddressId: "",
    ordersAddress: {},
    haveAddress: false,
    provinceList: [],
    cityList: [],
    districtList: [],
    schoolList: [],
    selectorAreaList: [],
    multiAreaIndex: [0, 0, 0],    // 用于切换时修改后续列表的下标值归0
    selectorSchoolList: [],
    multiSchoolIndex: [0, 0],
    gradeClassList: [],
    multiGradeClassIndex: [0, 0],
    areaOriginList: [],
    schoolOriginList: [],
    selectorAreaValue: "",
    selectorSchoolValue: "",
    selectorGradeClassValue: "",
    selectAddress: {
      id: "",
      username: "",
      telephone: "",
      isDefault: false,
      province: "",
      city: "",
      district: "",
      school: "",
      schoolType: "",
      grade: "",
      classValue: ""
    },
    needRenewInit: false           // 切换地区时，学校、年级初始值是否需要重置
  },

  effects: {
    * load({payload}, {call, put}) {
      const user_id = getGlobalData('user_id')
      const condition = {user_id}
      const response = yield call(queryAddress, condition);
      // console.log("address load response",response)
      const defaultAddress = response.find(data => data.isDefault === true)
      const defaultAddressId = defaultAddress ? defaultAddress.id : ""
      const haveAddress = !!response.length
      // console.log("address load defaultAddress",defaultAddress)
      // console.log("address load haveAddress",haveAddress)

      yield put({
        type: 'save',
        payload: {
          addressList: response,
          defaultAddressId,
          haveAddress
        },
      });
    },
    * fetchArea({payload}, {call, put, select}) {
      const response = yield call(queryArea, payload);
      // console.log("fetchArea response",response)

      const { selectAddress } = yield select(state => state.address);
      const { province, city, district } = selectAddress
      // console.log("fetchArea select selectAddress",selectAddress)

      const districtData = changeAreaList(response, province, city, district);
      // console.log("fetchArea changeAreaList districtData",districtData)

      const {
        provinceList, cityList, districtList,
        defaultProvinceList, defaultCityList, defaultDistrictList,
        defaultProvince, defaultCity, defaultDistrict,
        multiAreaIndex
      } = districtData
      const selectorAreaList = [defaultProvinceList, defaultCityList, defaultDistrictList]
      const selectorAreaValue = defaultProvince + " " + defaultCity + " " + defaultDistrict
      const fetchSchoolId = selectorAreaValue.replace(/ /g, '-')
      // console.log("fetchArea selectorAreaList", selectorAreaList)
      // console.log("fetchArea fetchSchoolId", fetchSchoolId)

      yield put({
        type: 'save',
        payload: {
          areaOriginList: response,
          provinceList,
          cityList,
          districtList,
          selectorAreaList,
          multiAreaIndex,
          selectorAreaValue
        }
      });
      yield put({
        type: 'saveSelectAddress',
        payload: {
          province: defaultProvince,
          city: defaultCity,
          district: defaultDistrict
        }
      });
      yield put({
        type: 'fetchSchool',
        payload: {
          id: fetchSchoolId
        }
      });
    },
    * fetchSchool({payload}, {call, put, select}) {
      // console.log("fetchSchool payload",payload)
      const returnFields = [
        'id',
        'province',
        'city',
        'district',
        'school{id,name,address,status,type}'
      ];
      const response = yield call(queryOneArea, payload, returnFields);
      // console.log("fetchSchool response",response)

      const { needRenewInit, selectAddress } = yield select(state => state.address);
      const { schoolType, school } = selectAddress
      let schoolTypeInit = "", schoolInit = "";
      // 需要重新初始化初始值，则不取默认初始值
      // 不需要重新初始化初始值，则取默认初始值
      if(!needRenewInit) {
        schoolTypeInit = schoolType
        schoolInit = school
      }
      // console.log("fetchSchool select selectAddress",selectAddress)

      const schoolData = changeSchoolList(response.school, schoolTypeInit, schoolInit);
      // console.log("fetchSchool schoolData", schoolData);

      const {
        schoolTypeList, schoolList,
        defaultSchoolTypeList, defaultSchoolList,
        defaultSchoolType, defaultSchool,
        multiSchoolIndex
      } = schoolData;
      const selectorSchoolList = [defaultSchoolTypeList, defaultSchoolList]
      const selectorSchoolValue = defaultSchool && defaultSchoolType + " " + defaultSchool
      // console.log("fetchSchool selectorSchoolList",selectorSchoolList)
      // console.log("fetchSchool selectorSchoolValue",selectorSchoolValue)

      yield put({
        type: 'save',
        payload: {
          schoolOriginList: response,
          schoolTypeList,
          schoolList,
          selectorSchoolList,
          multiSchoolIndex,
          selectorSchoolValue
        }
      });
      yield put({
        type: 'saveSelectAddress',
        payload: {
          schoolType: defaultSchoolType,
          school: defaultSchool
        }
      });
      yield put({
        type: 'changeSaveGradeClass',
        payload: {
          schoolType: defaultSchoolType
        }
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      // console.log('address reducers save:', payload);
      return { ...state, ...payload };
    },
    saveSelectAddress(state, { payload }) {
      // console.log('address reducers saveSelectAddress:', payload);
      return {
        ...state,
        selectAddress: {
          ...state.selectAddress,
          ...payload,
        },
      };
    },
    changeSaveGradeClass(state, { payload }) {
      const { needRenewInit, selectAddress } = state;
      const { grade, classValue } = selectAddress;
      const { schoolType } = payload;
      let multiGradeClassIndex = [0, 0]
      let startGrade,endGrade;
      switch(schoolType){
        case '小学':
          startGrade = 1;endGrade = 6;
          break;
        case '中学':
          startGrade = 7;endGrade = 9;
          break;
        default:
          startGrade = 1;endGrade = 9;
      }
      const {gradeList, classList} = getGradeClassList(startGrade, endGrade, 30);
      const gradeClassList = [gradeList, classList];
      // console.log("changeSaveGradeClass gradeClassList", gradeClassList)
      let selectorGradeClassValue = gradeList[0] + " " + classList[0]

      // 需要重新初始化初始值，则不取默认初始值
      // 不需要重新初始化初始值，则取默认初始值
      if(!needRenewInit){
        if(grade) multiGradeClassIndex[0] = gradeList.indexOf(grade)
        if(classValue) multiGradeClassIndex[1] = classList.indexOf(classValue)
        if(grade && classValue) selectorGradeClassValue = grade + " " + classValue
      }
      // console.log("changeSaveGradeClass multiGradeClassIndex", multiGradeClassIndex)
      // console.log("changeSaveGradeClass selectorGradeClassValue", selectorGradeClassValue)

      return {
        ...state,
        gradeClassList,
        multiGradeClassIndex,
        selectorGradeClassValue,
        selectAddress: {
          ...state.selectAddress,
          ...payload,
          grade: gradeList[0],
          classValue: classList[0]
        },
      };
    }
  }
};
