import React from 'react'

import { Flex } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'


export default class HouseList extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter />
        {/* 列表:后续开发 */}
      </div>
    )
  }
}
