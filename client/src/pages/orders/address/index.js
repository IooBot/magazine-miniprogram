import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class OrdersAddress extends Component {
  static defaultProps = {
    ordersAddress: {}
  }

  handleClick = () => {
    const { haveAddress } = this.props
    // console.log("ordersAddress haveAddress",haveAddress)

    if(haveAddress) {
      // console.log("navigateTo address")
      Taro.navigateTo({
        url: `/pages/address/index?prePage=orders`
      })
    }else {
      // console.log("navigateTo address edit")
      Taro.navigateTo({
        url: `/pages/address/edit/index?id=add`
      })
    }
  }

  render () {
    const {ordersAddress} = this.props;
    // console.log("ordersAddress",ordersAddress)
    let {isDefault, username, telephone, address, grade, classValue} = ordersAddress

    return (
      <View className='OrdersAddress orders-address'>
        {
          ordersAddress.id ?
            <View className='orders-address__item' onClick={this.handleClick}>
              <View className='orders-address__item-detail'>
                <View className='orders-address__item-wrap'>
                  <Text className='orders-address__item-name'>{username}</Text>
                  <Text className='orders-address__item-tel'>{telephone}</Text>
                  {
                    isDefault ?
                      <Text className='orders-address__item-tag'>默认</Text> :''
                  }
                </View>
                <View className='orders-address__item-txt'>{address}</View>
                <View className='orders-address__item-txt'>{grade}年级  {classValue}班</View>
              </View>
              <View className='orders-address__item-icon'>{'>'}</View>
            </View>
            :
            <View className='orders-address__add' onClick={this.handleClick}>+ 添加收货地址</View>
        }
      </View>
    )
  }
}
