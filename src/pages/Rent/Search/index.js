import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity } from '../../../utils'

import styles from './index.module.css'
import { getCommunityByKey } from '../../../utils/api/city'

/**
 * TODO：点击结果返回发布房源页面（携带当前选择的数据）
 */
export default class Search extends Component {

  state = {
    // 搜索框的值
    searchTxt: '',
    // 搜索结果
    tipsList: []
  }

  async componentDidMount() {
    // 获取城市ID
    const { value } = await getCity();
    this.cityId = value;
  }

  // 处理搜索
  handlerSea = (val) => {
    let _val = val.trim();
    if (!_val) {
      this.setState({
        searchTxt: '',
        tipsList: []
      })
    } else {
      this.setState({
        searchTxt: _val
      }, async () => {
        // 根据关键词查询结果
        const { status, data } = await getCommunityByKey(this.cityId, _val);
        if (status === 200) {
          this.setState({
            tipsList: data
          })
        }

      })
    }

  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li onClick={() => {
        // 选择出租房屋所在的小区=》跳转回发布房源页面（传递之前选择的数据）
        this.props.history.replace({ pathname: '/rent/add', data: item })
      }} key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handlerSea}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
