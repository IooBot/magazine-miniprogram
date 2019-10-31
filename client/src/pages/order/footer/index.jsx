import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import { View, Text, Button } from '@tarojs/components'
import { setGlobalData } from "../../../utils/global_data"
import './index.scss'

@connect(() => ({
}))
export default class OrderFooter extends Component {
  static defaultProps = {
    orderStatus: 'waitPay',
    order: {}
  }

  cancelOrder = (id) => {
		Taro.showModal({
			title: '',
			content: '确定要删除这个订单吗？'
		}).then(res => {
			if (res.confirm) {
        const { dispatch, orderStatus } = this.props
        dispatch({
          type: 'order/deleteOrder',
          payload: {
            condition1: {id},
            condition2: {order_id:id}
          },
          orderStatus,
          callback: () => {
            this.timerID = setTimeout(() => {
            }, 1000)
          }
        });
			}
		});
  }

  componentWillUnmount () {
    clearTimeout(this.timerID)
  }

  payOrder = () => {
    const {dispatch, order} = this.props
    // console.log("order payOrder order",order)
    setGlobalData('payOrder',order)
    dispatch({
      type: 'pay/save',
      payload: {
        payOrder: order
      }
    })
    Taro.navigateTo({
      url: `/pages/pay/index`
    })
  }

  render () {
    const {orderStatus, order} = this.props

    return (
      <View className='order-footer'>
        {
          orderStatus === 'waitPay' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button
                  className='order-button'
                  onClick={this.cancelOrder.bind(this,order.id)}
                >
                  <Text className='order-footer-txt'>取消</Text>
                </Button>
              </View>
              <View className='order-footer__button'>
                <Button
                  className='pay-button order-button'
                  style={{marginLeft: 5}}
                  onClick={this.payOrder}
                >
                  <Text className='order-footer-txt'>去支付</Text>
                </Button>
              </View>
            </View>:''
        }
      </View>
    )
  }
}
