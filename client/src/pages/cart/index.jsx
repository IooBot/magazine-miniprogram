import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { getWindowHeight } from '../../utils/style'
import Loading from '../../components/loading'
import Empty from './empty'
import List from './list'
import Footer from './footer'
import './index.scss'

@connect(({ cart, loading }) => ({
  ...cart,
  cartLoading: loading.effects['cart/load']
}))
export default class Cart extends Component {
  config = {
    navigationBarTitleText: '购物车'
  }

  // 获取购物车数据
  componentDidShow() {
    const { dispatch } = this.props
    dispatch({
      type: 'cart/load'
    });
  }

  // 切换购物车编辑页面
  changeCartPage = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cart/changeCartPage'
    });
  }

  //计算选中总合计金额
  sumPrice = () => {
    const { dispatch, cartList } = this.props
    // console.log("sumPrice cartList",cartList)
    let totalPrice=0, selectedCount=0, checkedCount=0
    const cartCount = cartList.length
    cartList.forEach((item,index)=>{
      const { magazine, count, subMonthCount } = item
      const { unitPrice, discountRate=1, activity } = magazine
      const isActivity = !!activity
      const price = isActivity ? (unitPrice * discountRate / 100).toFixed(1) : unitPrice.toFixed(1)

      if(item.checked===true){
        totalPrice += count * price * subMonthCount
        selectedCount += count
        checkedCount++
      }
      if(index === cartCount - 1){
        dispatch({
          type: 'cart/save',
          payload: {
            totalPrice,
            selectedCount,
            checkedCount,
            cartCount
          }
        });
      }
    })
  }

  // 更新数量
  changeCount = (i,count) =>{
    const { dispatch } = this.props
    dispatch({
      type: 'cart/changeCount',
      payload: {
        i,
        count
      }
    });
  }

  // 改变选择
  changeCheckedStatus = (i) => {
    const { dispatch } = this.props
    dispatch({
      type: 'cart/changeCheckedStatus',
      payload: {
        i
      }
    });
  }

  //全选或全不选,更新全选状态
  checkedAll = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'cart/changeCheckedAll',
    });
  }

  //结算传值
  settleAccounts = () => {
    const { dispatch, selectList, totalPrice } = this.props
    // console.log("Cart settleAccounts selectList",selectList)
    dispatch({
      type: 'orders/save',
      payload:{
        ordersList: selectList,
        totalPrice,
        ordersType: "cartOrders"
      }
    });
    Taro.navigateTo({
      url: `/pages/orders/index`
    })
  }

  // 多选删除
  delete = () =>{
    const { dispatch, selectedCount } = this.props
    Taro.showModal({
      title: '',
      content: `确定要删除这${selectedCount}种商品吗？`,
      })
      .then(res =>{
        if(res.confirm){
          dispatch({
            type: 'cart/deleteCart',
            callback: () => {
              this.timerID = setTimeout(() => {
              }, 1000)
            }
          });
        }
      })
  }

	componentWillUnmount () {
		clearTimeout(this.timerID)
	}

  render () {
    const { cartLoading, pageType, cartList, totalPrice, selectedCount, isSelectAll, cartCount } = this.props
    // console.log("Cart this.props",this.props)

    this.sumPrice()
    const isEmpty = !cartList.length
    const isShowFooter = !isEmpty

    return (
      <View className='cart'>
        {cartLoading && <Loading />}
        {!cartLoading && isEmpty && <Empty />}
        {!cartLoading && !isEmpty &&
          <View className='cart__nav'>
            <View className='cart__nav-left'>购物袋({cartCount})</View>
            <View className='cart__nav-right' onClick={this.changeCartPage.bind(this)} >
              {pageType === 'detail' ? "编辑" : "完成"}
            </View>
          </View>
        }
        {!cartLoading && !isEmpty &&
          <ScrollView
            scrollY
            className='cart__wrap'
            style={{ height: getWindowHeight() }}
          >
            <List
              list={cartList}
              onChangeCount={this.changeCount}
              onChangeCheckedStatus={this.changeCheckedStatus}
            />

            {isShowFooter && <View className='cart__footer--placeholder' />}
          </ScrollView>
        }
        {isShowFooter &&
          <View className='cart__footer'>
            <Footer
              pageType={pageType}
              isSelectAll={isSelectAll}
              totalPrice={totalPrice}
              selectedCount={selectedCount}
              onCheckedAll={this.checkedAll}
              onSettleAccounts={this.settleAccounts}
              onDelete={this.delete}
            />
          </View>
        }
      </View>
    )
  }
}
