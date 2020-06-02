import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import { getFilterData } from '../../../../utils/api/house'
import { getCity } from '../../../../utils'


// 初始化数据(默认数据)
// 根据type定义选中状态
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}
export default class Filter extends Component {

  // 定义状态数据
  state = {
    // 过滤器title选中状态
    titleSelectedStatus: { ...titleSelectedStatus },
    // 当前点击的过滤器title的type
    openType: ''
  }

  componentDidMount() {
    this.getFilters()
  }



  // 获取筛选器条件数据
  getFilters = async () => {
    // 当前定位城市ID
    const { value } = await getCity();
    const { status, data } = await getFilterData(value)
    console.log(status, data)
    // 数据存在哪里？state | * this
    // 轻量的state
    if (status === 200) {
      this.filterDatas = data
    }
  }

  // 父组件提供修改状态数据的方法
  onTitleClick = (type) => {
    // console.log(type);
    this.setState({
      titleSelectedStatus: { ...titleSelectedStatus, [type]: true },
      openType: type
    })
  }

  // 控制前三个过滤器内容显示
  isShowPicker = () => {
    const { openType } = this.state;
    return openType === 'area' || openType === 'mode' || openType === 'price'
  }

  // 确定的时候=》关闭前三个菜单的内容和获取选择的数据
  onOk = () => {
    this.setState({
      openType: ''
    })
  }
  // 取消的时候=》关闭前三个菜单的内容
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  // 渲染前三个筛选器的方法
  renderPicker = () => {
    if (this.isShowPicker()) {
      // 处理业务：根据openType值，传递对应的数据给Picker组件
      // 获取筛选条件数据
      // ------对象地段说明------
      // area 区域
      // characteristic 更多条件
      // floor 楼层
      // rentType 方式(整租||合租|| 不限)
      // oriented 朝向
      // price 价格
      // roomType 户型
      // subway 地铁
      const { area, subway, rentType, price } = this.filterDatas;
      // 获取当前点击的openType
      const { openType } = this.state;
      // picker的数据源
      let data, col = 1;
      switch (openType) {
        case 'area': data = [area, subway]; col = 3;
          break;
        case 'mode': data = rentType
          break;
        case 'price': data = price
          break;
      }
      return (
        <FilterPicker data={data} col={col} onCancel={this.onCancel} onOk={this.onOk} />
      )
    }
    return null
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          this.isShowPicker() ? <div onClick={this.onCancel} className={styles.mask} /> : null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onTitleClick={this.onTitleClick} titleSelectedStatus={this.state.titleSelectedStatus} />

          {/* 前三个菜单对应的内容： */}
          {
            this.renderPicker()
          }

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
