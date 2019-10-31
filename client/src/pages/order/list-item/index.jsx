import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss'

export default class OrderListItem extends Component {

  render() {
    // console.log("OrderListItem props",this.props)
    const { order = {} } = this.props
    const { orderProduct = [] } = order

    return (
      <View className='order-product'>
        {
          orderProduct.map(item => {
            const { id, magazine, subCount, spec, subYear} = item
            const { name, picture, unitPrice} = magazine
            return (
              <View className='cart__orders' key={'cart__orders-'+ id}>
                <View className='cart__orders-image'>
                  <Image className='cart__orders-image-img' src={picture} alt='img' />
                </View>
                <View className='cart__orders-intro'>
                  <View className='cart__orders-intro-name'>{name}</View>
                  <View className='cart__orders-intro-spec'>{subYear}  {spec}</View>
                  <View className='cart__orders-intro-price'>¥ {unitPrice}</View>
                </View>
                <View className='cart__orders-count'>
                  x {subCount}
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
