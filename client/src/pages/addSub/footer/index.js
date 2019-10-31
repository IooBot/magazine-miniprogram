import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtBadge } from 'taro-ui'
import ButtonItem from '../../../components/button'
import homeIcon from './assets/home.png'
import cartIcon from './assets/cart.png'
import './index.scss'

const NAV_LIST = [{
  key: 'sub',
  img: homeIcon,
  url: '/pages/sub/index'},
  {
  key: 'cart',
  img: cartIcon,
  url: '/pages/cart/index'
}]

export default class Footer extends Component {

  handleNav = (item) => {
    Taro.navigateTo({
      url: `/pages/${item.key}/index`
    })
  }

  handleAdd = () => {
    this.props.onAddToCart()
  }

  handleBuy = () => {
    this.props.onBuyNow()
  }

  render () {
    const { cartCount } = this.props
    return (
      <View className='item-footer'>
        {NAV_LIST.map(item => (
          <View
            key={item.key}
            className='item-footer__nav'
            onClick={this.handleNav.bind(this, item)}
          >
            {
              cartCount ?
                <AtBadge value={item.key === 'cart' ? cartCount : ''} maxValue={99}>
                  <Image
                    className='item-footer__nav-img'
                    src={item.img}
                  />
                </AtBadge>
                :
                <Image
                  className='item-footer__nav-img'
                  src={item.img}
                />
            }
          </View>
        ))}
        <View className='item-footer__buy' onClick={this.handleAdd}>
          <Text className='item-footer__buy-txt'>加入购物车</Text>
        </View>
        <ButtonItem
          type='primary'
          text='立即购买'
          onClick={this.handleBuy}
          compStyle={{
            width: Taro.pxTransform(246),
            height: Taro.pxTransform(100)
          }}
        />
      </View>
    )
  }
}
