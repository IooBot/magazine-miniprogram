import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtGrid } from "taro-ui"
import { getWindowHeight } from "../../utils/style"
import { getGlobalData } from "../../utils/global_data"
import Loading from "../../components/loading"
import './index.scss'

const orderIcon = [
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/pay.png',
    value: '待支付',
    id: '0'
  },
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/unbox.png',
    value: '已支付',
    id: '1'
  }
];

const toolsIcon = [
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/address.png',
    value: '收货地址',
    id: 'address'
  },
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/cart.png',
    value: '购物袋',
    id: 'cart'
  }
];

@connect(({ user, loading }) => ({
  ...user,
  userLoading: loading.effects['user/load'],
}))
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: []
    }
  }

  componentDidMount() {
    const openid = getGlobalData('openid')
    const {dispatch} = this.props
    dispatch({
      type: 'user/load',
      payload:{
        openid
      }
    });
  }

  onNavigateTo = (page, type, id) => {
    let url = type ? `/pages${page}?${type}=${id}` : `/pages${page}`;
    Taro.navigateTo({
      url
    })
  };

  render() {
    const { userLoading } = this.props
    // console.log("user this.props",this.props)

    return (
      <View className='user'>
        <ScrollView
          scrollY
          className='cart__wrap'
          style={{height: getWindowHeight()}}
        >
          {
            userLoading ?
              <Loading /> :
              <View>
                <View className='user-info'>
                  <View className='avatar'>
                    <open-data type='userAvatarUrl'></open-data>
                  </View>
                  <View className='nickname'>
                    <open-data type='userNickName' lang='zh_CN'></open-data>
                  </View>
                </View>

                <View className='my-card order-card'>
                  <View className='card-title'>
                    我的订单
                  </View>
                  <View className='card-icons'>
                    <AtGrid
                      data={orderIcon}
                      columnNum={4}
                      hasBorder={false}
                      onClick={(order) => {
                        this.onNavigateTo('/order/index', 'type', order.id)
                      }}
                    />
                  </View>
                </View>

                <View className='my-card tools-card'>
                  <View className='card-title'>
                    我的工具
                  </View>
                  <View className='card-icons'>
                    <AtGrid
                      data={toolsIcon}
                      columnNum={4}
                      hasBorder={false}
                      onClick={(tools) => {
                        if (tools.id === 'address') {
                          this.onNavigateTo('/address/index')
                        } else if (tools.id === 'cart') {
                          this.onNavigateTo('/cart/index')
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
          }
        </ScrollView>
      </View>
    )
  }
}

