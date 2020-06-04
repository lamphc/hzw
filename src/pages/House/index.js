import React from 'react'

import { Flex, Toast } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import { getCity } from '../../utils'
import { getListByFilters } from '../../utils/api/house'

// 列表组件
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/axios'
import NoHouse from '../../components/NoHouse'

// TODO:下拉加载更多
export default class HouseList extends React.Component {

  state = {
    // 房源列表数据
    list: [],
    // 列表数据的总条数
    count: 0
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
    const { status, data: { list, count } } = await getListByFilters(this.cityId, this.filters);
    // console.log(status, data)
    if (status === 200) {
      // 提示获取到到数据条数
      if (count > 0) {
        Toast.success(`成功获取到${count}条房源数据！`, 2)
      }

      this.setState({
        list,
        count
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
    // 处理下item暂无数据情况
    if (!item) {
      return (
        <div style={style} key={key}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    // 处理图片传递的key
    item.src = `${BASE_URL}${item.houseImg}`
    // row模版
    return (
      <HouseItem onClick={() => {
        // 跳转到详情
        this.props.history.push({ pathname: `/detail/${item.houseCode}`, data: { a: [1123] }, res: 10000 })
      }} {...item} key={key} style={style} />
    );
  }

  // 下拉更多
  // 判断当前行数据是否就为
  isRowLoaded = ({ index }) => {
    const { list } = this.state;
    return !!list[index];
  }
  // 核心：加载更多数据和渲染列表
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return getListByFilters(this.cityId, this.filters, startIndex, stopIndex).then(({ status, data: { list, count } }) => {
      // console.log(startIndex, stopIndex, list)
      // 响应式
      if (status === 200) {
        this.setState({
          count,
          list: [...this.state.list, ...list]
        })
      }
    })
  }

  // 渲染房源列表
  renderHouseList = () => {
    const { count } = this.state;
    return count > 0 ? <InfiniteLoader
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={this.state.count}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer>
          {({ height, width }) => (
            <List
              className={styles.houseList}
              width={width}
              height={height}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={this.state.count}
              rowHeight={130}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader> : <NoHouse>暂无房源数据！</NoHouse>
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
        {/* 城市列表 */}
        {
          this.renderHouseList()
        }

      </div>
    )
  }
}
