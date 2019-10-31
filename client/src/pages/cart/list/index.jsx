import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'
import CheckboxItem from '../../../components/checkbox'
// import InputNumber from '../../../components/input-number'
import './index.scss'

export default class List extends Component {
  static defaultProps = {
    list: [],
    onChangeCount: () => {},
    onChangeCheckedStatus: () => {}
  }

  // 选择数量，注意使用taro-ui AtInputNumber value的类型可能为string
  changeCount = (index, count) => {
    // console.log("Cart List changeCount index",index, "count",count, typeof count)
    this.props.onChangeCount(index, parseInt(count))
  }

  handleUpdateCheck = (index) => {
    // console.log("Cart List handleUpdateCheck index",index)
    this.props.onChangeCheckedStatus(index)
  }

  render () {
    const { list } = this.props

    return (
      <View className='cart-list'>
        {list.map((item,index) => {
          const { id, magazine, count, spec, subYear, tag='' } = item
          const { name, unitPrice, picture:img, discountRate=1, activity } = magazine
          const isActivity = !!activity
          const price = isActivity ? (unitPrice * discountRate / 100).toFixed(1) : unitPrice.toFixed(1)
          return (
            <View
              key={item.id}
              className='cart-list__item'
            >
              <CheckboxItem
                checked={item.checked}
                compStyle={{height:'100px'}}
                onClick={this.handleUpdateCheck.bind(this, index)}
              />
              <Image
                className='cart-list__item-img'
                src={img}
              />
              <View className='cart-list__item-info'>
                <View >
                  <View className='cart-list__item-title'>
                    {tag && <Text className='cart-list__item-title-tag'>{tag}</Text>}
                    <Text className='cart-list__item-title-name' numberOfLines={1}>
                      {name}
                    </Text>
                  </View>

                  <View className='cart-list__item-spec'>
                    <Text className='cart-list__item-spec-txt'>
                      {subYear}
                    </Text>
                    <Text className='cart-list__item-spec-txt'>
                      {spec}
                    </Text>
                  </View>
                </View>

                <View className='cart-list__item-wrap'>
                  <View>
                    <Text className='cart-list__item-price'>
                      ¥{price}
                    </Text>
                    {isActivity &&
                    <Text className='cart-list__item-price-origin'>
                      ￥{price}
                    </Text>
                    }
                  </View>
                  <View className='cart-list__item-num'>
                    {/*<InputNumber*/}
                      {/*num={count}*/}
                      {/*onChange={this.changeCount.bind(this, index)}*/}
                    {/*/>*/}
                    <AtInputNumber
                      min={1}
                      value={count}
                      onChange={this.changeCount.bind(this, index)}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        )}
      </View>
    )
  }
}
