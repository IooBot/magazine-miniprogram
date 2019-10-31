import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components'
import OrderList from "./list"
import './index.scss'

const orderType = [
  {
    type: '0',
    name: '待支付',
    orderStatus: "waitPay"
  },
  {
    type: '1',
    name: '已支付',
    orderStatus: "finishPay"
  }
];
@connect(({ order }) => ({
  ...order
}))
export default class Order extends Component {
  config = {
    navigationBarTitleText: '我的订单',
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTypeIndex: 0,
      orderStatus: ""
    };
  }

  componentWillMount() {
    const type = this.$router.params.type
    // console.log("Order this.$router.params.type",type, typeof type)

    const orderStatus = orderType.find((item)=> item.type === type).orderStatus
    this.setState({
      activeTypeIndex: this.$router.params.type,
      orderStatus
    })
  }

  toggleActiveType = (e,orderStatus) => {
    e.stopPropagation()
    const { dispatch } = this.props
    // console.log("toggleActiveType e",e)
    // console.log("toggleActiveType orderStatus",orderStatus)
    this.setState({
      activeTypeIndex: e.currentTarget.dataset.type,
      orderStatus
    })
    dispatch({
      type: 'order/getDisplayOrderList',
      payload: {
        orderStatus
      }
    });
  }

  render() {
    let { activeTypeIndex, orderStatus } = this.state

    return (
      <View className='order-page'>
        <View className='toggleType'>
          {orderType.map((item, index) => (
            <View
              key={index}
              className={activeTypeIndex == index ? 'active item' : 'item'}
              data-type={item.type}
              onClick={(e)=>this.toggleActiveType(e,item.orderStatus)}
            >
              {item.name}
            </View>
          ))}
        </View>
        <OrderList orderStatus={orderStatus} />
      </View>
    )
  }
}
