import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.scss'

export default class Banner extends Component {
  static defaultProps = {
    list: []
  }

  render () {
    const { list } = this.props
    return (
      <View className='banner'>
        <Swiper
          className='banner__swiper'
          circular
          autoplay
          indicatorDots
          indicatorActiveColor='#ef6c6e'
        >
          {list.map((item, index) => (
            <SwiperItem key={index} className='banner__swiper-item'>
              <Image className='banner__swiper-item-img' src={item} />
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    )
  }
}
