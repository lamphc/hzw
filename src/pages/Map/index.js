/**
 * 地图找房
 */
import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { getCity } from '../../utils';

import sty from './index.module.css'

class Map extends Component {

  componentDidMount() {
    // 初始化百度地图
    this.initMap()
  }

  // 初始化地图
  /**
   * 1. 创建地图实例
   * 2. 设置地图显示的中心点
   * 3. 地图初始化，同时设置地图展示级别
   */
  initMap = async () => {
    // 解构BMap地图方法对象
    const { BMap } = window;
    // 初始化地图实例
    const map = new BMap.Map("container");

    // 根据当前定位城市=》显示地图
    const { label, value } = await getCity();
    // 创建地址解析器实例     
    const myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(null, function (point) {
      if (point) {
        map.centerAndZoom(point, 11);
        // 添加地图所需控件
        // 缩放控件
        map.addControl(new BMap.NavigationControl());
        // 比例尺控件
        map.addControl(new BMap.ScaleControl());
        // 添加文本覆盖物的方法
        // 文本覆盖物配置    
        const opts = {
          position: point,    // 指定文本标注所在的地理位置
          offset: new BMap.Size(0, 0)    //设置文本偏移量
        }
        // 初始化文本覆盖物=》创建文本覆盖物实例
        const label = new BMap.Label(null, opts);  // 创建文本标注对象
        // 调用setContent方法创建html覆盖物
        label.setContent(
          `
          <div class="${sty.bubble}">
            <p class="${sty.bubbleName}">浦东新区</p>
            <p>388套</p>
          </div>
          `
        )
        // 设置文本覆盖物的样式
        label.setStyle({
          border: 0,
          background: 'transparent'
        });
        // 给覆盖物添加点击事件
        label.addEventListener('click', (e) => {
          console.log('点击了html覆盖物', point, e)
        })
        // 调用地图实例的addOverlay方法添加=》文本覆盖物
        map.addOverlay(label);
      }
    },
      label);

  }


  render() {
    return (
      <div className={sty.mapBox}>
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