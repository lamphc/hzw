import React from 'react'

import { Flex } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import { getCity } from '../../utils'
import { getListByFilters } from '../../utils/api/house'

// 列表组件
import { List, AutoSizer } from 'react-virtualized';
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/axios'

// TODO:下拉加载更多
export default class HouseList extends React.Component {

  state = {
    // 房源列表数据
    list: []
  }


  async componentDidMount() {
    // 获取当前定位城市的ID
    let { value } = await getCity();
    this.cityId = value;
    // console.log(this.cityId)
    // 默认调用接口获取房源列表
    this.getHouseList()
  }


  // 父组件接收子组件的数据
  onFilter = (filters) => {
    console.log('父组件接收子组件的数据:', filters);
    // 存储筛选器条件数据
    this.filters = filters
    // 调用接口获取列表数据
    this.getHouseList()
  }

  // 根据筛选条件获取房源列表
  getHouseList = async () => {
    const { status, data: { list } } = await getListByFilters(this.cityId, this.filters);
    // console.log(status, data)
    if (status === 200) {
      this.setState({
        list
      })
    }
  }

  // 每行渲染的模版
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {

    // 当前行row数据
    const { list } = this.state;
    const item = list[index];
    // 处理图片传递的key
    item.src = `${BASE_URL}${item.houseImg}`
    // row模版
    return (
      <HouseItem {...item} key={key} style={style} />
    );
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              className={styles.houseList}
              width={width}
              height={height}
              rowCount={this.state.list.length}
              rowHeight={130}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
