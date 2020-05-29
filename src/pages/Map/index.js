/**
 * 地图找房
 */
import React, { Component } from 'react';



import './index.scss'
import { NavBar, Icon } from 'antd-mobile';

class Map extends Component {

  componentDidMount() {
    // 初始化百度地图
    this.initMap()
  }

  // 初始化地图
  /**
   * 1. 创建地图实例
   * 2. 设置地图显示的中心点
   */
  initMap = () => {
    // 解构BMap地图方法对象
    const { BMap } = window;
    // 初始化地图实例
    const map = new BMap.Map("container");
    // 设置地图显示的中心点=>天安门
    const point = new BMap.Point(116.404, 39.915);
    // 地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 15);
  }


  render() {
    return (
      <div className="mapBox">
        {/* 顶部导航 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >地图找房</NavBar>
        {/* 地图容器 */}
        <div id="container"></div>
      </div>
    );
  }
}

export default Map;