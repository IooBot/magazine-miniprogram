import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'
import { getWindowHeight } from '../../utils/style'
import { setGlobalData } from "../../utils/global_data"
import Banner from "../../components/banner"
import Loading from "../../components/loading"
import './index.scss'

@connect(({ sub, user, loading }) => ({
  ...sub,
  ...user,
  subLoading: loading.effects['sub/load'],
}))
export default class Sub extends Component {
  config = {
    navigationBarTitleText: '少年博览'
  }

  componentDidMount() {
    const {dispatch, user} = this.props
    if(!user.id) this.getLogin()
    dispatch({
      type: 'sub/load',
    });
  }

  // 小程序云开发云函数获取openid
  getLogin = () => {
    let $this = this
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        // console.log("getLogin res", res)
        const openid = res.result.openid
        setGlobalData('openid', openid)
        const {dispatch} = $this.props

        dispatch({
          type: 'user/findAndCreate',
          payload:{
            openid
          }
        });
      })
  }

  navigateToPage = (url) => {
    Taro.navigateTo({
      url
    })
  }

  navigateToAddSub = (item) => {
    const {dispatch} = this.props

    dispatch({
      type: 'sub/save',
      payload:{
        product: item
      }
    });

    Taro.navigateTo({
      url: `/pages/addSub/index`
    })
  }

  render () {
    const { subLoading, bannerList, productList  } = this.props
    // console.log("Sub this.props", this.props)
    const scrollHeight = getWindowHeight();
    // console.log("scrollHeight",scrollHeight)

    return (
      <View className='sub'>
        <View className='sub__tabBar'>
          <View className='at-row'>
            <View className='at-col at-col-3 left' onClick={()=>this.navigateToPage(`/pages/user/index`)}>
              <View className='sub__tabBar-icon--left'>
                <AtIcon value='user' size='24' />
              </View>
            </View>
            <View className='at-col at-col-6'> </View>
            <View className='at-col at-col-3 right' onClick={()=>this.navigateToPage(`/pages/cart/index`)}>
              <View className='sub__tabBar-icon--right'>
                <AtIcon value='shopping-bag' size='24' />
              </View>
            </View>
          </View>
        </View>
        <ScrollView
          className='sub__wrap'
          scrollY
          style={{ height: scrollHeight }}
        >
          {
            subLoading ?
              <Loading /> :
              <View>
                {/* 轮播图展示 */}
                <Banner list={bannerList} />
                {/* 商品列表 */}
                <View className='sub-recommend'>
                  <View className='sub-recommend__title'>
                    <Text className='sub-recommend__title-txt'>- 为你推荐 -</Text>
                  </View>
                  <View className='sub-recommend__list'>
                    {productList.map((item) => {
                      const { id, picture, magazineIntro, unitPrice, name, discountRate=1, activity=false, simpleDescClose=false } = item
                      const isActivity = !!activity
                      const price = isActivity ? (unitPrice * discountRate / 100).toFixed(1) : unitPrice.toFixed(1)

                      return (
                        <View
                          key={id}
                          className='sub-recommend__list-item'
                        >
                          <Image className='sub-recommend__list-item-img' src={picture} />
                          {!!magazineIntro && !simpleDescClose &&
                          <Text className='sub-recommend__list-item-desc'>
                            {magazineIntro}
                          </Text>
                          }
                          <View className='sub-recommend__list-item-info' onClick={()=>this.navigateToAddSub(item)}>
                            <Text className='sub-recommend__list-item-name'>
                              {name}
                            </Text>

                            <View className='sub-recommend__list-item-price-wrap'>
                              <View>
                                <Text className='sub-recommend__list-item-price'>
                                  ¥{price}
                                </Text>
                                {!isActivity &&
                                <Text className='sub-recommend__list-item-price--origin'>
                                  ¥{price}
                                </Text>
                                }
                              </View>
                              <View className='sub-recommend__list-item-icon'>
                                <AtIcon value='add-circle' size='24' color='#ba2f31' />
                              </View>
                            </View>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                </View>
              </View>
          }
        </ScrollView>
      </View>
    )
  }
}
