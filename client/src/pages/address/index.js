import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtIcon } from "taro-ui"
import { getWindowHeight } from "../../utils/style"
import Loading from "../../components/loading"
import './index.scss'

@connect(({ address, loading }) => ({
  ...address,
  addressLoading: loading.effects['address/load'],
}))
export default class Address extends Component {
  config = {
    navigationBarTitleText: '地址管理'
  };

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'address/load'
    });
  }

  navigateToAddressEdit = (id, address) => {
    // console.log('navigateToAddressEdit id address', id, address)
    const {dispatch} = this.props
    if (id !== 'add') {
      // console.log("navigateToAddressEdit edit address")
      const grade = `${address.grade}年级`;
      const classValue = `${address.classValue}班`;
      dispatch({
        type: 'address/saveSelectAddress',
        payload:{
          ...address,
          grade,
          classValue
        }
      })
    }else {
      const selectAddress = {
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
        classValue: "",
      }
      dispatch({
        type: 'address/saveSelectAddress',
        payload:{
          ...selectAddress,
        }
      })
    }
    dispatch({
      type: 'address/save',
      payload: {
        needRenewInit: false
      }
    });
    Taro.navigateTo({
      url: `/pages/address/edit/index?id=${id}`
    })
  }

  changeOrdersAddress = (address) => {
    // console.log('changeOrdersAddress $router',this.$router)
    // console.log('changeOrdersAddress address',address)
    const params = this.$router.params

    if(params.prePage === 'orders'){
      const {dispatch} = this.props
      dispatch({
        type: 'address/save',
        payload:{
          ordersAddress: address
        }
      })
      Taro.navigateBack({
        delta: 1
      })
    }
  }

  deleteAddress = (deleteId) => {
    // console.log("deleteId",deleteId)
    Taro.showModal({
      title: '',
      content: '确定要删除这个收货地址吗？',
    })
      .then(res => {
        if (res.confirm) {
          const { dispatch, ordersAddress } = this.props

          dispatch({
            type: 'addressMutate/delete',
            payload: {
              id: deleteId
            }
          });
          if(deleteId === ordersAddress.id){
            dispatch({
              type: 'address/save',
              payload: {
                ordersAddress: {}
              }
            });
          }
        }
      })
  }

  render() {
    const { addressLoading, addressList } = this.props
    // console.log("Address",this.props)

    return (
      <View className='address'>
        <ScrollView
          scrollY
          className='address__wrap'
          style={{height: getWindowHeight()}}
        >
          {
            addressLoading ?
              <Loading />:
              <View>
                <View className='address-add' onClick={this.navigateToAddressEdit.bind(this, 'add')}>
                  + 添加新地址
                </View>
                {
                  !addressList.length ?
                    <View className='kind-empty'>
                      <Text>暂无收货地址</Text>
                      <Text>点击下方按钮可新增地址</Text>
                    </View> : ''
                }
                {
                  addressList.length ?
                    <View className='other-address'>
                      {addressList.map(address => (
                        <View key={address.id} className='address-card'>
                          <View className='address-info' onClick={this.changeOrdersAddress.bind(this, address)}>
                            <View className='address-username-telephone'>
                              <View className='address-username ellipsis'>{address.username}</View>
                              <View className='address-phone ellipsis'>
                                <Text>{address.telephone}</Text>
                                {address.isDefault ?
                                  <Text className='address-label'>默认</Text> : ''
                                }
                              </View>
                            </View>
                            <View className='address-address'>{address.address}</View>
                            <View className='address-address'>{address.grade}年级 {address.classValue}班</View>
                          </View>
                          <View
                            className='address-edit_icon'
                            onClick={this.navigateToAddressEdit.bind(this, address.id, address)}
                          >
                            <AtIcon value='edit' size='16' />
                          </View>
                          <View
                            className='address-edit_icon'
                            onClick={this.deleteAddress.bind(this, address.id)}
                          >
                            <AtIcon value='trash' size='16' />
                          </View>
                        </View>
                      ))}
                    </View> : ''
                }
              </View>
          }
        </ScrollView>
      </View>
    )
  }
}
