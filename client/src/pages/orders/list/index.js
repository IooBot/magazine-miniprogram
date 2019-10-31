import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

export default class OrdersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cartList: [],
      unfoldStatus: true,
      foldStatus: false,
      unfoldList: [],
      height: '100%',
    }
  }

  componentDidMount() {
    const {ordersList} = this.props
    this.handleCartList(ordersList)
  }

  handleCartList = (cartList) => {
    if (cartList.length > 3) {
      let cartList1 = cartList.slice(0, 3)
      let unfoldList = cartList.slice(3)
      this.setState({
        cartList: cartList1,
        unfoldList
      })
    } else {
      this.setState({
        cartList
      })
    }
  }

  onChangeHeight = (height, unfoldStatus, foldStatus) => {
    this.setState({
      height,
      unfoldStatus,
      foldStatus
    })
  }

  render () {
    let {cartList, unfoldList, height, unfoldStatus, foldStatus} = this.state
    // console.log("OrdersList cartList",cartList)
    const noImageShow  = "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png"

    return (
      <View className='orders__detail'>
        {
          cartList.map((item) => {
            return (
              <View key={'cart__orders-'+item.id}>
                <View className='cart__orders'>
                  <View className='cart__orders-image'>
                    <Image className='cart__orders-image-img' src={item.magazine.picture || noImageShow} alt='img' />
                  </View>
                  <View className='cart__orders-intro'>
                    <View className='cart__orders-intro-name'>{item.magazine.name}</View>
                    <View className='cart__orders-intro-spec'>{item.subYear}  {item.spec}</View>
                    <View className='cart__orders-intro-price'>¥ {item.magazine.unitPrice}</View>
                  </View>
                  <View className='cart__orders-count'>
                    x {item.count}
                  </View>
                </View>
              </View>
            )
          })
        }
        <View className={classNames({'packup': !unfoldList.length, 'packup-unfold': true})} style={{height: height}}>
          {
            unfoldStatus ?
              <View onClick={() => {this.onChangeHeight(96 * unfoldList.length + 62, false, true)}}>
                <View className='packup-title'>展开全部商品</View>
                <View>∨</View>
              </View>
              : ''
          }
          {
            foldStatus ?
              <View onClick={() => {this.onChangeHeight('100%', true, false)}}>
                {
                  unfoldList.map((item, index) => {
                    return (
                      <View key={index}>
                        <View className='cart__orders'>
                          <View className='cart__orders-image'>
                            <Image className='cart__orders-image-img' src={item.magazine.picture || noImageShow} alt='img' />
                          </View>
                          <View className='cart__orders-intro'>
                            <View className='cart__orders-intro-name'>{item.magazine.name}</View>
                            <View className='cart__orders-intro-spec'>{item.subYear}  {item.spec}</View>
                            <View className='cart__orders-intro-price'>¥ {item.magazine.unitPrice}</View>
                          </View>
                          <View className='cart__orders-count'>
                            x {item.count}
                          </View>
                        </View>
                      </View>
                    )
                  })
                }
                <View className='packup-title'>收起</View>
                <View>∧</View>
              </View> : ''
          }
        </View>
      </View>
    )
  }
}
