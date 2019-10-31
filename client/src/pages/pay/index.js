import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import { View, Text, Image, Button } from '@tarojs/components'
import classNames from 'classnames'
import moment from 'moment'
import CheckboxItem from "../../components/checkbox"
import { update } from "../../utils/crud"
import './index.scss'

let clickTag = 1;  //微信发起支付点击标志
@connect(({ pay }) => ({
  ...pay
}))
export default class Pay extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: true,
    }
  }

  message = (title) => {
    Taro.showToast({
      title,
      icon: 'none'
    });
  }

  changeCheckedStatus = () => {
    this.setState((preState)=>({
      checked: !preState.checked
    }))
  }

  pay = () => {
    this.message('支付成功')
    Taro.navigateTo({
      url: `/pages/order/index`
    })
  }

  // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
  jsApiPay = (args, id) => {
    // console.log('jsApiPay params', args, id);
    let $this = this
    Taro.requestPayment(args).then((res)=>{
      // console.log("requestPayment res",res)
      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
      if (res.errMsg === "requestPayment:ok") {
        // 成功完成支付 更新订单状态
        $this.message('支付成功，等待发货')

        const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        const updateContent = {
          id,
          orderStatus: 'finishPay',
          updatedAt
        }
        let updateOrderStatus = update({collection: "order",condition: updateContent})
        updateOrderStatus.then((data)=>{
          // console.log("update order data",data)
          if(data.result === 'OK'){
            Taro.navigateTo({
              url: `/pages/order/index?type=1`
            })
          }else {
            $this.message('支付成功，订单更新失败，请联系商家')
          }
        })
      }
    })
      .catch((err)=>{
        // console.log("jsApiPay err",err)
        if (err.errMsg === "requestPayment:fail cancel") {
          $this.message('您的支付已经取消')
          Taro.navigateTo({
            url: `/pages/order/index?type=0`
          })
        } else {
          $this.message('支付失败，请稍后重试')
        }
      })
  }

  getBridgeReady = (id, needPay) => {
    // console.log('getBridgeReady params',id, needPay)

    let isWEAPP = Taro.getEnv()
    // console.log("isWEAPP",isWEAPP)
    // console.log("clickTag",clickTag)
    if (clickTag === 1 && isWEAPP === 'WEAPP') {
      clickTag = 0   //进行标志，防止多次点击

      let $this = this

      Taro.cloud
        .callFunction({
          name: "pay",
          data: {
            orderid: id,
            // money: parseInt(needPay * 100, 10)
            money: 1  //test pay
          }
        })
        .then((res) => {
          // console.log('onBridgeReady res',res)
          if(res.errMsg === "cloud.callFunction:ok"){
            $this.jsApiPay(res.result, id)
          }else {
            $this.message(String(res))
          }
          this.timerID = setTimeout(() => {
            clickTag = 1
          }, 2000)
        })
        .catch((error) => {
          console.log('onBridgeReady error', error)
          $this.message('支付发起失败，请稍后重试')
        })
    } else if(clickTag === 0 ){
      this.message('点击过于频繁')
      this.timerID = setTimeout(() => {
        clickTag = 1
      }, 2000)
    } else {
      this.message('当前只支持小程序支付')
    }
  }

  handleConfirm = () => {
    let { checked } = this.state
    const { payOrder } = this.props
    const { id, totalPrice } = payOrder
    if (checked) {
      this.getBridgeReady(id, totalPrice)
    }
  }

	componentWillUnmount () {
		clearTimeout(this.timerID)
	}

  render() {
    let { checked } = this.state
    const { payOrder } = this.props
    const { totalPrice } = payOrder
    // console.log("Pay this.props", this.props)

    return (
      <View className='pay'>
        <View className='pay__wrap'>
          <View className='pay__header content-piece'>
            <Text className='pay__header-title'>订单金额:</Text>
            <Text className='pay__header-price'>￥: {totalPrice}</Text>
          </View>
          <View className='pay__body content-piece'>
            <Text className='pay__body-title'>请选择支付方式</Text>
            <View className='pay__body-item'>
              <View className='pay__body-type'>
                <Image className='pay__body-type-image' src='https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/wechat.png' alt='' />
                <Text className='pay__body-type-name'>微信支付</Text>
              </View>
              <View className='pay__body-select'>
                <CheckboxItem
                  compStyle={{height:'40px'}}
                  checked={checked}
                  onClick={this.changeCheckedStatus}
                />
              </View>
            </View>
          </View>
        </View>
        <View className='pay__footer'>
          <Button
            className={classNames({
              'confirm-button': true,
              'pay-disabled': !checked
            })}
            onClick={this.handleConfirm}
          >
            <Text>确认支付</Text>
          </Button>
        </View>
      </View>
    )
  }
}
