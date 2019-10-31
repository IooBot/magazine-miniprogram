import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import loading from './assets/loading.gif'
import './index.scss'

export default class Loading extends Component {
  render () {
    return (
      <View className='comp-loading'>
        <Image src={loading} className='comp-loading__img' />
        <Text>加载中...</Text>
      </View>
    )
  }
}

