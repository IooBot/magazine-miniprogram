import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import { View, Text, ScrollView } from '@tarojs/components'
import { AtToast } from "taro-ui"
import moment from 'moment'
import { getWindowHeight } from "../../utils/style"
import { idGen } from "../../utils/common"
import { getGlobalData } from "../../utils/global_data"
import OrdersAddress from "./address"
import OrdersList from "./list"
import OrdersFooter from "./footer"
import './index.scss'

@connect(({ address, orders }) => ({
  ordersAddress: address.ordersAddress,
  haveAddress: address.haveAddress,
  ...orders,
}))
export default class Orders extends Component {
  config = {
    navigationBarTitleText: '订单确认'
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'address/load'
    });
  }

  changeOrdersState = (val) => {
    const { dispatch } = this.props
    dispatch({
      type: 'orders/save',
      createOrderStatus: val
    });
  }

  onSubmitOrderAndProduct = () => {
    this.changeOrdersState(true)
    const user_id = getGlobalData("user_id")
    const { ordersAddress } = this.props;
    // console.log("onSubmitOrderAndProduct ordersAddress",ordersAddress)

    if(ordersAddress.id){
      const { dispatch, totalPrice, ordersList } = this.props
      let initialValue = 0;
      const orderProductCount = ordersList.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count
        ,initialValue
      );
      // console.log("orderProductCount",orderProductCount)
      const createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
      const { username, telephone, province, city, district, school, schoolType, grade, classValue, address } = ordersAddress
      const tag = telephone ? telephone.replace(/[^0-9]/ig, "").slice(-4) : Math.random().toString(10).substr(2,4)
      const orderId = createdAt.replace(/[^0-9]/ig, "").substr(2) + tag;
      const orderAddress_id =  idGen('orderAddress');

      const orderAddressData = {
        id: orderAddress_id,
        user_id,
        username,
        telephone,
        province,
        city,
        district,
        school,
        schoolType,
        grade,
        classValue,
        address,
        createdAt,
        updatedAt: ""
      }
      // console.log('onSubmitOrderAndProduct orderAddressData',orderAddressData)

      const orderContent = {
        id: orderId,
        user_id,
        orderAddress_id,
        orderStatus: "waitPay",
        orderProductCount,
        totalPrice,
        expressStatus: "",
        expressContent: "",
        expressNumber: "",
        createdAt,
        updatedAt: ""
      }
      // console.log('onSubmitOrderAndProduct orderContent',orderContent)

      dispatch({
        type: 'orders/createOrderData',
        payload: {
          orderAddressData,
          orderContent,
          tag
        }
      });

    }else {
      Taro.showToast({
        title:'请先添加收货地址',
        icon: 'none'
      })
    }
  };

  render() {
    const { totalPrice, haveAddress, ordersAddress, ordersList, createOrderStatus } = this.props;
    // console.log("Orders this.props",this.props)

    return (
      <View className='orders'>
        {
          createOrderStatus ?
            <AtToast isOpened text='创建订单中...' status='loading' />:''
        }
        <ScrollView
          scrollY
          className='orders__wrap'
          style={{ height: getWindowHeight() }}
        >
          <View className='orders-content-wrap content-wrap'>
            <OrdersAddress
              haveAddress={haveAddress}
              ordersAddress={ordersAddress}
            />
            <OrdersList ordersList={ordersList} />
            <View className='orders__price'>
              <View className='orders__price-wrap'>
                <Text className='orders__price-name'>商品金额</Text>
                <Text className='orders__price-item'>¥ {totalPrice}</Text>
              </View>
              <View className='orders__price-wrap'>
                <Text className='orders__price-name'>运费</Text>
                <Text className='orders__price-item'>¥ 0.00</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View className='orders__footer'>
          <OrdersFooter
            totalPrice={totalPrice}
            createOrderStatus={createOrderStatus}
            onSubmitOrderAndProduct={this.onSubmitOrderAndProduct}
          />
        </View>
      </View>
    )
  }
}
