import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, ScrollView, Text } from '@tarojs/components';
import { getWindowHeight } from "../../../utils/style"
import Loading from "../../../components/loading"
import OrderListItem from "../list-item"
import OrderFooter from "../footer"
import './index.scss'

@connect(({ order, loading }) => ({
  ...order,
  orderLoading: loading.effects['order/load']
}))
export default class OrderList extends Component {

  componentDidShow() {
    const { dispatch, orderStatus } = this.props
    dispatch({
      type: 'order/load',
      orderStatus
    });
  }

  render() {
    const { orderLoading, orderStatus, displayOrderList } = this.props
    const height = getWindowHeight(false,40)
    // console.log("OrderList this.props",this.props)

    return (
      <View className='orderList-wrap'>
        {
          orderLoading &&
          <View  style={{ height }}>
            <Loading />
          </View>
        }
        {
          !orderLoading && displayOrderList.length === 0 ?
            <View>
              <View className='order-empty'/>
            </View>
            :
            <ScrollView
              scrollY
              className='order__wrap'
              style={{ height }}
            >
              {
                displayOrderList.map(order => {
                  const { username, telephone, address, grade, classValue} = order.orderAddress
                  return (
                    <View key={order.id} className='order-card'>
                      <View className='order-card-top'>
                        <View>订单号: {order.id}</View>
                      </View>

                      <OrderListItem order={order}/>
                      <View className='order-address__item-detail'>
                        <View className='order-address__item-wrap'>
                          收货人:
                          <Text className='order-address__item-name'> {username}</Text>
                          <Text className='order-address__item-tel'> {telephone}</Text>
                        </View>
                        <View className='order-address__item-txt'>收货地址:  {address} {grade}年级 {classValue}班</View>
                      </View>
                      <View className='order-card-bottom'>
                        <View className='order-card-count'>
                          总计:
                        </View>
                        <View className='order-card-pay'>
                          ￥{Math.round(order.totalPrice * 100) / 100}
                        </View>
                      </View>
                      <OrderFooter orderStatus={orderStatus} order={order} />
                    </View>
                  )
                })
              }
            </ScrollView>
        }
      </View>
    )
  }
}
