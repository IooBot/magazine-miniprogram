export function deleteEmptyProperty(object){
  for (let i in object) {
    let value = object[i];
    // console.log('typeof object[' + i + ']', (typeof value));
    if (!value && value !== false && value !== "") {
      delete object[i];
    }
  }
  // console.log("deleteEmptyProperty object",object)
  return object;
}

export function getSubTimeArray(subTime) {
  // eslint-disable-next-line
  let month = new Date().getMonth() + 1;
  let monthTime = month < 10 ? `0${month}`:`${month}`;
  let nowTime = parseInt(`${new Date().getFullYear()}` + monthTime,10);
  let res = [], res1 = [], res2 = [], isSub;
  let timeType1 = "全年";   // value为数组[1,2,3,4,5,6,7,8,9,10,11,12],label匹配时无法显示
  let timeType2 = "上半年";
  let timeType3 = "下半年";

  subTime.forEach(function(item) {
    let time1 = parseInt(`${item}01`,10);        // 201901
    let time2 = parseInt(`${item}07`,10);        // 201907
    // 当前时间小于对应杂志订阅时间1月：可订阅时间的全年杂志
    if(nowTime < time1){
      res2 = [timeType1,timeType2,timeType3];
      isSub = true;
      // 当前时间大于对应杂志订阅时间的1月份并且小于7月份：可订阅时间的下半年
    }else if(nowTime >= time1 && nowTime < time2){
      res2 = [timeType3];
      isSub = true;
    }else if(nowTime > time2){
      res2 = [`${item}订阅季已过`];
      isSub = false;
    }else {
      res2 = [`暂未到${item}订阅季`];
      isSub = true;
    }
    if(isSub && res2.length){
      res1.push(item);
      res.push(res2);
    }
  });
  // console.log("changeSubTimeList subTimeList",[res1,res]);
  return [res1,res];
}

export function getTimeValueArray(value)  {
  let result = {"全年":[1,2,3,4,5,6,7,8,9,10,11,12], "上半年":[1,2,3,4,5,6], "下半年":[7,8,9,10,11,12]}[value] || [];
  return result;
}

export const idGen = (kind) => {
  return kind + '_' + Date.now() + '_' + Math.random().toString().slice(-8)
}

export const changeAreaList = (area, provinceInit, cityInit, districtInit) => {
  // console.log('area',area);
  let res1 = [], res2 = [], res3 = [];
  let defaultProvince = provinceInit, defaultCity = cityInit, defaultDistrict = districtInit, defaultCityList = [], defaultDistrictList = [];
  let multiAreaIndex = [0, 0, 0]
  let provinceIndexFlag = true, cityIndexFlag = true;

  area.forEach((item, index) => {
    const {province} = item;
    if(!res1.find(value => value === province)){
      res1.push(province)
    }
    // 无初始省份，确定初始省份
    if(!defaultProvince && index === 0){
      // console.log("changeAreaList no provinceInit defaultProvince",province)
      defaultProvince = province
    }
    // 有初始省份，确定省份 可选列的下标, 执行一次即可
    if(provinceIndexFlag && defaultProvince && defaultProvince === province){
      provinceIndexFlag = false

      // console.log("changeAreaList multiAreaIndex[0]",res1.indexOf(defaultProvince))
      multiAreaIndex[0] = res1.indexOf(defaultProvince)
    }
  });

  res1.forEach((item)=> {
    const sameProvince = area.filter((item1) => item === item1.province)
    let res = [];
    sameProvince.forEach((item2, index) => {
      const {city} = item2;
      if(!res.find(value => value === city)){
        res.push(city)
      }
      // 无初始城市，确定初始城市
      if(item === defaultProvince && !defaultCity && index === 0){
        // console.log("changeAreaList no cityInit defaultCity",city)
        defaultCity = city
      }
    });
    res2.push({province:item, city:res})
    if(item === defaultProvince){
      defaultCityList = res
      if(cityIndexFlag){
        cityIndexFlag = false

        // console.log("changeAreaList multiAreaIndex[1]",res.indexOf(defaultCity))
        multiAreaIndex[1] = res.indexOf(defaultCity)
      }
    }
  })

  res2.forEach((item)=> {
    item.city.forEach((item1) => {
      const sameCity = area.filter((item2) => item1 === item2.city)
      let res = [];
      sameCity.forEach((item3, index) => {
        const {district} = item3;
        if(!res.find(value => value === district)){
          res.push(district)
        }
        // 无初始地区，确定初始地区
        if(item.province === defaultProvince && item1 === defaultCity && !defaultDistrict && index === 0){
          // console.log("changeAreaList no districtInit defaultDistrict",district)
          defaultDistrict = district
        }
      });
      res3.push({province:item.province, city:item1, district:res})
      if(item.province === defaultProvince && item1 === defaultCity){
        defaultDistrictList = res

        // console.log("changeAreaList multiAreaIndex[2]",res.indexOf(defaultDistrict))
        multiAreaIndex[2] = res.indexOf(defaultDistrict)
      }
    })
  })

  // console.log("changeAreaList res1 provinceList",res1);
  // console.log("changeAreaList res2 cityList",res2);
  // console.log("changeAreaList res3 districtList",res3);
  // console.log("changeAreaList defaultCityList",defaultCityList);
  // console.log("changeAreaList defaultDistrictList",defaultDistrictList);
  // console.log("changeAreaList defaultProvince",defaultProvince);
  // console.log("changeAreaList defaultCity",defaultCity);
  // console.log("changeAreaList defaultDistrict",defaultDistrict);
  // console.log("changeAreaList multiAreaIndex",multiAreaIndex);

  return {
    provinceList: res1,
    cityList: res2,
    districtList: res3,
    defaultProvinceList: res1,
    defaultCityList,
    defaultDistrictList,
    defaultProvince,
    defaultCity,
    defaultDistrict,
    multiAreaIndex
  }
};

export const changeSchoolList = (school, schoolTypeInit, schoolInit) => {
  let res1 = [], res2 = [];
  let defaultSchoolType = schoolTypeInit, defaultSchool = schoolInit, defaultSchoolList = [];
  let multiSchoolIndex = [0, 0]
  let schoolTypeIndexFlag = true;

  school.forEach((item, index) => {
    const {type} = item;
    if(!res1.find(value => value === type)){
      res1.push(type)
    }
    // 无初始学校类型，确定初始学校类型
    if(!defaultSchoolType && index === 0){
      // console.log("changeSchoolList no schoolTypeInit defaultSchool",type)
      defaultSchoolType = type
    }
    // 有初始学校类型，确定学校类型 可选列的下标, 执行一次即可
    if(schoolTypeIndexFlag && defaultSchoolType && defaultSchoolType === type){
      schoolTypeIndexFlag = false

      // console.log("changeSchoolList multiSchoolIndex[0]",res1.indexOf(defaultSchoolType))
      multiSchoolIndex[0] = res1.indexOf(defaultSchoolType)
    }
  });

  res1.forEach((item)=> {
    const sameSchoolType = school.filter((item1) => item === item1.type)
    let res = [];
    sameSchoolType.forEach((item2, index) => {
      const {name} = item2;
      if(!res.find(value => value === name)){
        res.push(name)
      }
      // 无初始学校，确定初始学校
      if(item === defaultSchoolType && !defaultSchool && index === 0){
        // console.log("changeSchoolList no schoolTypeInit defaultSchool",name)
        defaultSchool = name
      }
    });
    res2.push({type: item, school: res})
    if(item === defaultSchoolType){
      defaultSchoolList = res

      // console.log("changeSchoolList multiSchoolIndex[2]",res.indexOf(defaultSchool))
      multiSchoolIndex[1] = res.indexOf(defaultSchool)
    }
  })

  // console.log("changeSchoolList res1 schoolTypeList",res1);
  // console.log("changeSchoolList res2 schoolList",res2);
  // console.log("changeSchoolList defaultSchoolList",defaultSchoolList);
  // console.log("changeSchoolList defaultSchoolType",defaultSchoolType);
  // console.log("changeSchoolList defaultSchool",defaultSchool);
  // console.log("changeSchoolList multiSchoolIndex",multiSchoolIndex);

  return {
    schoolTypeList: res1,
    schoolList: res2,
    defaultSchoolTypeList: res1,
    defaultSchoolList,
    defaultSchoolType,
    defaultSchool,
    multiSchoolIndex
  };
}

export const getGradeClassList = (startGrade,endGrade,classCount) => {
  let i = startGrade, j = 0, gradeList = [], classList = [];

  while (i <= endGrade) {
    gradeList.push(`${i}年级`);
    i++;
  }
  while (j < classCount) {
    classList.push(`${j + 1}班`);
    j++;
  }

  // console.log('getGradeClassList gradeList', gradeList);
  // console.log('getGradeClassList classList', classList);

  return {
    gradeList,
    classList
  };
};
