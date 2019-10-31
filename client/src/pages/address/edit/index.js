import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Picker, Text } from '@tarojs/components'
import { AtForm, AtInput, AtSwitch } from 'taro-ui'
import moment from 'moment'
import { idGen } from "../../../utils/common"
import { getGlobalData } from "../../../utils/global_data"
import Loading from "../../../components/loading"
import './index.scss'

@connect(({ address, loading }) => ({
  ...address,
  areaLoading: loading.effects['address/fetchArea'],
}))
export default class AddressEdit extends Component {
  config = {
    navigationBarTitleText: '编辑地址'
  };

  componentDidMount() {
    const { dispatch } = this.props
    // console.log("AddressEdit this.props",this.props)
    dispatch({
      type: 'address/fetchArea'
    });
  }

  // 更新多选列的显示内容
  onColumnChangeArea = (e) => {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    const {column: selectColumn, value: selectValue} = e.detail
    const { dispatch, selectorAreaList, multiAreaIndex, cityList, districtList } = this.props

    switch (selectColumn)  {
      case 0:
        let column1 = [], column2 = []
        cityList.every((item) => {
          const {province, city} = item
          if(province === selectorAreaList[0][selectValue]){
            column1 = city
            return false;
          }else{
            return true;
          }
        });
        districtList.every((item) => {
          const {city, district} = item
          if(city === column1[0]){
            column2 = district
            return false;
          }else{
            return true;
          }
        });
        dispatch({
          type: 'address/save',
          payload: {
            selectorAreaList: [selectorAreaList[0], column1, column2],
            multiAreaIndex: [selectValue, 0, 0]
          }
        });
        break;
      case 1:
        let column12 = []
        districtList.every((item) => {
          const {city, district} = item
          if(city === selectorAreaList[1][selectValue]){
            column12 = district
            return false;
          }else{
            return true;
          }
        });
        dispatch({
          type: 'address/save',
          payload: {
            selectorAreaList: [selectorAreaList[0], selectorAreaList[1], column12],
            multiAreaIndex: [multiAreaIndex[0], selectValue, 0]
          }
        });
        break;
    }
  }

  onChangeArea = (e) => {
    // console.log("onChangeArea e.detail.value",e.detail.value)
    const { dispatch, selectorAreaList } = this.props
    const multiAreaIndex = e.detail.value
    const selectProvince = selectorAreaList[0][multiAreaIndex[0]]
    const selectCity = selectorAreaList[1][multiAreaIndex[1]]
    const selectDistrict = selectorAreaList[2][multiAreaIndex[2]]
    const selectorAreaValue = selectProvince + ' ' + selectCity + ' ' + selectDistrict
    // console.log("onChangeArea selectorAreaValue",selectorAreaValue)

    dispatch({
      type: 'address/fetchSchool',
      payload: {
        id: selectorAreaValue.replace(/ /g, '-')
      }
    });
    dispatch({
      type: 'address/save',
      payload: {
        selectorAreaValue,
        multiAreaIndex,
        multiSchoolIndex: [0, 0],
        needRenewInit: true
      }
    });
    dispatch({
      type: 'address/saveSelectAddress',
      payload: {
        province: selectProvince,
        city: selectCity,
        district: selectDistrict
      }
    });
  }

  onColumnChangeSchool = (e) => {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    const {column: selectColumn, value: selectValue} = e.detail
    const { dispatch, schoolList, selectorSchoolList } = this.props

    if(selectColumn === 0) {
      let column = []
      schoolList.every((item) => {
        const {type, school} = item
        if(type === selectorSchoolList[0][selectValue]){
          column = school
          return false;
        }else{
          return true;
        }
      });
      dispatch({
        type: 'address/save',
        payload: {
          selectorSchoolList: [selectorSchoolList[0], column],
          multiSchoolIndex: [selectValue, 0]
        }
      });
    }
  }

  onChangeSchool = (e) => {
    // console.log("onChangeSchool e.detail.value",e.detail.value)
    const { dispatch, selectorSchoolList } = this.props
    const multiSchoolIndex = e.detail.value
    const selectSchoolType = selectorSchoolList[0][multiSchoolIndex[0]]
    const selectSchool = selectorSchoolList[1][multiSchoolIndex[1]]
    const selectorSchoolValue = selectSchoolType + ' ' + selectSchool
    // console.log("onChangeSchool selectorSchoolValue",selectorSchoolValue)

    dispatch({
      type: 'address/save',
      payload: {
        selectorSchoolValue,
        multiSchoolIndex,
        multiGradeClassIndex: [0, 0],
        needRenewInit: true
      }
    });
    dispatch({
      type: 'address/saveSelectAddress',
      payload: {
        schoolType: selectSchoolType,
        school: selectSchool
      }
    });
    dispatch({
      type: 'address/changeSaveGradeClass',
      payload: {
        schoolType: selectSchoolType
      }
    });
  }

  onColumnChangeGradeClass = (e) => {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    const {column: selectColumn, value: selectValue} = e.detail
    const { dispatch } = this.props

    if(selectColumn === 0) {
      dispatch({
        type: 'address/save',
        payload: {
          multiGradeClassIndex: [selectValue, 0]
        }
      });
    }
  }

  onChangeGradeClass = (e) => {
    // console.log("onChangeGradeClass e.detail.value",e.detail.value)
    const { dispatch, gradeClassList } = this.props
    const multiGradeClassIndex = e.detail.value
    const grade = gradeClassList[0][multiGradeClassIndex[0]]
    const classValue = gradeClassList[1][multiGradeClassIndex[1]]
    const selectorGradeClassValue = grade + ' ' + classValue
    // console.log("onChangeGradeClass selectorGradeClassValue",selectorGradeClassValue)

    dispatch({
      type: 'address/save',
      payload: {
        selectorGradeClassValue
      }
    });
    dispatch({
      type: 'address/saveSelectAddress',
      payload: {
        grade ,
        classValue
      }
    });
  }

  saveAddress = () => {
    const user_id = getGlobalData("user_id");
    const { dispatch, selectAddress, defaultAddressId } = this.props;
    // console.log("saveAddress selectAddress",selectAddress)
    // console.log("saveAddress defaultAddressId",defaultAddressId)
    const { id, username, telephone, isDefault, province, city, district, school, schoolType, grade, classValue } = selectAddress;
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const testPhoneNum = /^1[0-9]{10}$/;
    const isPoneAvailable = testPhoneNum.test(telephone);

    if (username && isPoneAvailable && district && school && classValue) {
      const address = province + city + district + school;

      const addressContent = {
        user_id,
        username,
        telephone,
        isDefault,
        province,
        city,
        district,
        school,
        schoolType,
        grade: parseInt(grade),
        classValue: parseInt(classValue),
        address,
        updatedAt: nowTime
      };

      const changeDefaultAddress = () => {
        const changeDefaultData = {
          isDefault: false,
          updatedAt: nowTime
        }
        // console.log("changeDefaultAddress defaultAddressId",defaultAddressId)
        // console.log("changeDefaultAddress changeDefaultData",changeDefaultData)

        dispatch({
          type: 'addressMutate/update',
          payload: {
            condition: {id: defaultAddressId},
            data: changeDefaultData
          },
          needToast: false
        });
      }

      if(id){
        // console.log("saveAddress update addressContent",addressContent)

        dispatch({
          type: 'addressMutate/update',
          payload: {
            condition: {id},
            data: addressContent,
          },
          needToast: true
        });

        // 如果设置了默认地址，且已经存在默认地址且默认地址不是当前修改地址，则更新默认地址 isDefault的值
        if(isDefault && defaultAddressId && defaultAddressId !== id){
          changeDefaultAddress()
        }
      }else {
        addressContent.id = idGen('address');
        addressContent.createdAt = nowTime
        // console.log("saveAddress create addressContent",addressContent)

        dispatch({
          type: 'addressMutate/create',
          payload: addressContent,
          needToast: true
        });
        if(isDefault && defaultAddressId){
          changeDefaultAddress()
        }
      }

    } else if (!username) {
      this.message('收货人姓名不能为空')
    } else if (!telephone) {
      this.message('联系电话不能为空')
    } else if (!isPoneAvailable) {
      this.message('请输入11位有效手机号码')
    } else if (!district) {
      this.message('请选择学校所在地区')
    }else if (!school) {
      this.message('请选择所在学校')
    }else if (!classValue) {
      this.message('请选择所在年级-班级')
    }else {
      this.message('收货地址暂未完善')
    }
  };

  message = (title) => {
    Taro.showToast({
      title,
      icon: 'none'
    });
  };

  handleChange = (type, value) => {
    // console.log("onChangeDefault type value",type,value)
    const { dispatch } = this.props

    dispatch({
      type: 'address/saveSelectAddress',
      payload: {
        [type]: value,
      }
    });
  }

  render() {
    const {
      areaLoading, selectAddress,
      selectorAreaList, selectorAreaValue, multiAreaIndex,
      selectorSchoolList, selectorSchoolValue, multiSchoolIndex,
      gradeClassList, selectorGradeClassValue, multiGradeClassIndex
    } = this.props;
    const { username, telephone, isDefault } = selectAddress;
    // console.log("AddressEdit this.props",this.props)

    return (
      <View className='address-edit-wrap'>
        {
          areaLoading ?
            <Loading /> :
            <View className='address-edit'>
              <AtForm>
                <AtInput
                  name='username'
                  title='收货人'
                  type='text'
                  placeholder='请填写收货人姓名'
                  value={username}
                  onChange={this.handleChange.bind(this, 'username')}
                />
                <AtInput
                  name='telephone'
                  title='手机号码'
                  type='phone'
                  placeholder='请填写手机号码'
                  value={telephone}
                  onChange={this.handleChange.bind(this, 'telephone')}
                />
                <View className='address-edit__region'>
                  <View className='address-edit__region-title'>学校所在地区</View>
                  <Picker
                    mode='multiSelector'
                    range={selectorAreaList}
                    value={multiAreaIndex}
                    onColumnChange={this.onColumnChangeArea}
                    onChange={this.onChangeArea}
                  >
                    <View className='address-edit__region-item'>
                      <Text>{selectorAreaValue}</Text>
                    </View>
                  </Picker>
                </View>
                <View className='address-edit__region'>
                  <View className='address-edit__region-title'>所在学校</View>
                  <Picker
                    mode='multiSelector'
                    range={selectorSchoolList}
                    value={multiSchoolIndex}
                    onColumnChange={this.onColumnChangeSchool}
                    onChange={this.onChangeSchool}
                  >
                    <View className='address-edit__region-item'>
                      <Text>{selectorSchoolValue || '暂无此地区学校'}</Text>
                    </View>
                  </Picker>
                </View>
                <View className='address-edit__region'>
                  <View className='address-edit__region-title'>所在年级-班级</View>
                  <Picker
                    mode='multiSelector'
                    range={gradeClassList}
                    value={multiGradeClassIndex}
                    onColumnChange={this.onColumnChangeGradeClass}
                    onChange={this.onChangeGradeClass}
                  >
                    <View className='address-edit__region-item'>
                      <Text>{selectorGradeClassValue}</Text>
                    </View>
                  </Picker>
                </View>
                <AtSwitch
                  title='设为默认收货地址'
                  border={false}
                  checked={isDefault}
                  color='#f44'
                  onChange={this.handleChange.bind(this, 'isDefault')}
                />
              </AtForm>
              <View className='address-add' onClick={this.saveAddress}>保存并使用</View>
            </View>
        }
      </View>
    )
  }
}
