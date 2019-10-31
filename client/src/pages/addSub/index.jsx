import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Picker } from '@tarojs/components'
import { AtForm, AtInputNumber } from 'taro-ui'
import moment from 'moment'
import { getSubTimeArray, getTimeValueArray, idGen } from '../../utils/common'
import { getGlobalData } from "../../utils/global_data"
import Footer from './footer'
import './index.scss'

@connect(({ sub, addSub, cart }) => ({
  product: sub.product,
  cartCount: cart.cartCount,
  ...addSub
}))
export default class AddSub extends Component {
  config = {
    navigationBarTitleText: '少年博览'
  }

  constructor(props) {
    super(props)
    this.state = {
      selectorList: []
    }
  }

  componentWillMount(){
    const { dispatch, product } = this.props
    // console.log("AddSub product",product)
    const { enableSub } = product

    // 初始数据二维数组 如：[ [2020, 2021], [ ["全年", "上半年", "下半年"], ["全年", "上半年", "下半年"] ] ]
    // let subOriginList = [ [2020, 2021], [ ["下半年"], ["全年", "上半年", "下半年"] ] ]
    const subOriginList = getSubTimeArray(enableSub);
    // console.log('subOriginList',subOriginList);

    // 选择器初始数据 如：[ [2020, 2021], ["全年"，"上半年"，"下半年"] ]
    const selectorList = [subOriginList[0], subOriginList[1][0]];
    // console.log('selectorList',selectorList);

    // 初始订阅时间
    const subYear = (selectorList[0].length && selectorList[0][0]) || null;
    // console.log('subYear',subYear);

    const subMonthLabel = (selectorList[1] && selectorList[1][0]) || "";
    // console.log('subMonthLabel',subMonthLabel);

    const subMonth = getTimeValueArray(subMonthLabel);
    // console.log('subMonth',subMonth);

    const subTime = [subYear, subMonthLabel];
    // console.log('subTime',subTime);

    const subTimeValue = subYear ? subTime[0] + ' ' + subTime [1] : '暂未到订阅季'
    // console.log('subTimeValue',subTimeValue);

    dispatch({
      type: 'addSub/save',
      payload: {
        subProduct: product,
        subOriginList,  // 选择的二维数组
        subTime,    // 选择的订阅年份及月份
        subYear,    // 选择的订阅年份
        subMonth,    // 选择的订阅月份
        subTimeValue  // 选择的显示，初始值不能为空
      }
    });
    this.setState({
      selectorList
    })
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'cart/queryCount'
    });
  }

  handleChangeCount = (value) => {
    // console.log("handleChangeCount value",value, typeof value)
    const {dispatch} = this.props
    dispatch({
      type: 'addSub/save',
      payload: {
        subCount: value
      }
    });
  }

  onChange = (e) => {
    let { selectorList } = this.state
    const { dispatch } = this.props
    const subYear = selectorList[0][e.detail.value[0]]
    const subMonthLabel = selectorList[1][e.detail.value[1]]
    const subTime = [subYear, subMonthLabel];
    const subMonth = getTimeValueArray(subMonthLabel);
    const subTimeValue = selectorList[0][e.detail.value[0]] + ' ' + selectorList[1][e.detail.value[1]]

    dispatch({
      type: 'addSub/save',
      payload: {
        subTime,
        subYear,
        subMonth,
        subTimeValue
      }
    });
  }

  onColumnChange = (e) => {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    const {column: selectColumn, value: selectValue} = e.detail
    const { subOriginList } = this.props

    if(selectColumn === 0) {
      const column1 = subOriginList[1][selectValue]
      this.setState(pre => {
        return {
          selectorList: [pre.selectorList[0], column1],
        }
      })
    }
  }

  // 添加至购物袋
  onAddToCart = () => {
    const user_id = getGlobalData("user_id")
    const { dispatch, subProduct, subTime, subCount, subYear, subMonth  } = this.props
    const id = idGen('cart')
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const cartContent = {
      id,
      user_id,
      magazine_id: subProduct.id,
      count: parseInt(subCount),
      subYear,
      subMonthCount: subMonth.length,
      subMonth,
      spec: subTime[1],
      createdAt,
      updatedAt: ""
    }
    // console.log('onAddToCart cartContent',cartContent)

    dispatch({
      type: 'cartMutate/create',
      payload: cartContent
    });
    // 跳转次数有限制
    // Taro.navigateTo({
    //   url: `/pages/sub/index`
    // })
    Taro.navigateBack({
      delta: 1
    })
  }

  // 立即购买
  onBuyNow = () => {
    const { dispatch, subProduct, subTime, subCount, subYear, subMonth  } = this.props
    const {id, name, picture, unitPrice} = subProduct;
    const subMonthCount = subMonth.length;
    const totalPrice = parseFloat((unitPrice * subMonthCount * subCount).toFixed(2))

    const ordersContent = [{
      magazine: {
        id, name, picture, unitPrice
      },
      count: parseInt(subCount),
      subYear,
      subMonthCount,
      subMonth,
      spec: subTime[1],
    }]
    // console.log('onBuyNow ordersContent', ordersContent)

    dispatch({
      type: 'orders/save',
      payload:{
        ordersList: ordersContent,
        totalPrice,
        ordersType: "subOrders"
      }
    });
    Taro.navigateTo({
      url: `/pages/orders/index`
    })
  }

  render () {
    const { product, cartCount, subCount, subTimeValue, subYear, subMonth } = this.props
    const { name, unitPrice } = product
    let { selectorList } = this.state
    const subMonthCount = subMonth.length
    const needPay = unitPrice * subMonthCount * subCount
    // console.log("addSub cartCount",cartCount)
    // console.log("AddSub this.props",this.props)
    // console.log("AddSub selectorList",selectorList)

    return (
      <View className='addSub'>
        <View className='addSub__tabBar'>
          <Text>订阅</Text>
        </View>
        <AtForm className='addSub__wrap'>
          <View className='addSub__wrap-list'>
            <Text>{name}</Text>
            <Text>¥{unitPrice}/月</Text>
          </View>
          <View className='addSub__wrap-list' style={{border:'none'}}>
            <Text className='addSub__wrap-list-txt'>选择订阅期限</Text>
            <Picker
              mode='multiSelector'
              range={selectorList}
              onChange={this.onChange}
              onColumnChange={this.onColumnChange}
            >
              <View className='addSub__wrap-list-spec-value'>
                <Text>{subTimeValue}</Text>
              </View>
            </Picker>
          </View>
          <View className='addSub__wrap-list'>
            <View className='addSub__wrap-list-txt-sub'>1-2月,7-8月为合刊</View>
            <View>
              共<Text className='addSub__wrap-list-txt-sum'>{subMonthCount}</Text>个月
            </View>
          </View>
          {
            subYear ?
              <View className='addSub__wrap-list'>
                <View>订购数量</View>
                <AtInputNumber
                  min={1}
                  value={subCount}
                  onChange={this.handleChangeCount}
                />
              </View>:''
          }
          {
            needPay !== 0 ?
              <View className='addSub__wrap-list addSub__wrap-list-total'>
                <Text>合计</Text>
                <Text className='addSub__wrap-list-total-price'>¥{needPay}</Text>
              </View>
              : ''
          }
        </AtForm>
        {
          subYear ?
            <View className='addSub__footer'>
              <Footer
                cartCount={cartCount}
                onAddToCart={this.onAddToCart}
                onBuyNow={this.onBuyNow}
              />
            </View>:''
        }
      </View>
    )
  }
}
