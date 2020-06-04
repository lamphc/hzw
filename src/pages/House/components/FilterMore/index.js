import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {

  // 设置状态数据
  state = {
    // 当前选中的所有条件
    selected: this.props.value
  }

  // 存储选中的条件：之前选择过，就删除/相反，就添加
  handlerSel = (item) => {
    // 获取之前的选择
    const { selected } = this.state;
    // new
    const newSelected = [...selected];
    let index = newSelected.indexOf(item.value);
    if (index > -1) {
      //之前选择过，就删除
      newSelected.splice(index, 1)
    } else {
      // 相反，就添加
      newSelected.push(item.value)
    }
    // 做响应式
    this.setState({
      selected: newSelected
    }, () => {
      console.log(this.state.selected)
    })


  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map((item) => <span onClick={() => this.handlerSel(item)} key={item.value}
      className={[styles.tag, this.state.selected.includes(item.value) ? styles.tagActive : ''].join(' ')}>{item.label}</span>)
  }

  render() {
    const { onCancel, onOk, data } = this.props;
    console.log(data)
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div onClick={onCancel} className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(data.roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(data.oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(data.floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(data.characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCancel} onOk={() => onOk(this.state.selected)} className={styles.footer} />
      </div>
    )
  }
}
