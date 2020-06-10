/**
 * 地图找房
 */
import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { getCity } from '../../utils';

import sty from './index.module.css'
import { getMapData } from '../../utils/api/city';
import { getListByFilters } from '../../utils/api/house';
import HouseItem from '../../components/HouseItem';
import { BASE_URL } from '../../utils/axios';

class Map extends Component {

  state = {
    // 当前点击小区的房源列表
    list: [],
    // 控制房源列表浮层是否显示
    isShowList: false
  }

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
    // 把BMap地图方法对象，存储到this=>跨方法调用
    this.BMap = window.BMap;
    // 初始化地图实例
    this.map = new this.BMap.Map("container");

    // 根据当前定位城市=》显示地图
    const { label, value } = await getCity();
    // 创建地址解析器实例     
    const myGeo = new this.BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(null, async (point) => {
      if (point) {
        this.map.centerAndZoom(point, 11);
        // 添加地图所需控件
        // 缩放控件
        this.map.addControl(new this.BMap.NavigationControl());
        // 比例尺控件
        this.map.addControl(new this.BMap.ScaleControl());

        // 默认加载：获取当前定位城市的区的数据（覆盖物）
        this.renderOverlay(value)
      }
    },
      label);

    // 给地图添加事件
    // movestart事件开始移动触发（一次）
    this.map.addEventListener('movestart', (e) => {
      // 判断列表是否显示=》如果显示 =》就隐藏
      const { isShowList } = this.state;
      if (isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })

  }

  // 渲染覆盖物的方法（1. 调用接口拿数据 2. 画圈 ）
  /**
   * id: 区域ID
   */
  renderOverlay = async (id) => {
    // TODO
    // 获取当前覆盖物的形状和下一层的缩放级别
    const { type, nextZoom } = this.getTypeAndZoom()

    const { status, data } = await getMapData(id);
    if (status === 200) {
      // 循环=》画圈圈/方形
      data.forEach((item) => {
        // 根据形状和数据
        this.createOverlays(type, nextZoom, item)

      })
    }
  }


  /**
   * 根据不同形状：创建覆盖物/处理不同的点击事件
   */
  createOverlays = (type, nextZoom, item) => {
    const { coord: { longitude, latitude }, label: cname, count, value } = item;
    // 不同形状：1. 圆形：html和css不一样的 2 覆盖物事件逻辑不一样
    let tpl, ecallback;
    // 圆形
    if (type === 'circle') {
      tpl = `
      <div class="${sty.bubble}">
        <p class="${sty.bubbleName}">${cname}</p>
        <p>${count}套</p>
      </div>
      `;
      ecallback = () => {
        // 点击某一个区的圈=》拿到当前区的ID=》调用后台接口获取当前区下街道的数据
        // 地图放大
        this.map.centerAndZoom(ipoint, nextZoom)
        // 获取数据和画圈
        this.renderOverlay(value)
        // 上一层区的覆盖物清除掉
        let id = setTimeout(() => {
          clearTimeout(id);
          this.map.clearOverlays()
        })
      }
    } else {
      // 方形
      tpl = `
      <div class="${sty.rect}">
      <span class="${sty.housename}">${cname}</span>
      <span class="${sty.housenum}">${count}套</span>
      <i class="${sty.arrow}"></i>
     </div>
      `;
      ecallback = (e) => {
        // console.log(e, cname)
        // 获取当前点击小区的房源列表数据，然后展示到地图中
        this.handlerHouseList(value)
        // 把当前点击的小区位移到中心点位置
        this.moveToCenter(e)
      }
    }
    // 当前覆盖物的坐标点
    const ipoint = new this.BMap.Point(longitude, latitude)
    // 添加文本覆盖物的方法
    // 文本覆盖物配置    
    const opts = {
      position: ipoint,    // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(0, 0)    //设置文本偏移量
    }
    // 初始化文本覆盖物=》创建文本覆盖物实例
    const label = new this.BMap.Label(null, opts);  // 创建文本标注对象
    // 调用setContent方法创建html覆盖物
    label.setContent(
      tpl
    )
    // 设置文本覆盖物的样式
    label.setStyle({
      border: 0,
      background: 'transparent'
    });
    // 给覆盖物添加点击事件
    label.addEventListener('click', ecallback)
    // 调用地图实例的addOverlay方法添加=》文本覆盖物
    this.map.addOverlay(label);
  }

  // 根据当前地图的缩放级别=》确定当前画的覆盖物形状和下层的缩放界别
  getTypeAndZoom = () => {
    let type, nextZoom;
    // 获取当前地图的缩放级别
    const curZoom = this.map.getZoom()
    // 默认第一层
    if (curZoom >= 10 && curZoom < 12) {
      type = 'circle';
      nextZoom = 13
    } else if (curZoom >= 12 && curZoom < 14) {
      type = 'circle';
      nextZoom = 15
    } else {
      // 小区
      type = 'square'
    }
    return {
      type, nextZoom
    }
  }

  // 获取小区的出租房源列表
  handlerHouseList = async (id) => {
    // 把需要的列表数据从 对象 结构出来
    const { status, data: { list } } = await getListByFilters(id);
    if (status === 200) {
      this.setState({
        list,
        isShowList: true
      })
    }

  }
  // 渲染小区下房屋列表
  renderHouseList = () => {
    return (
      <div
        className={[
          sty.houseList,
          this.state.isShowList ? sty.show : ''
        ].join(' ')}
      >
        <div className={sty.titleWrap}>
          <h1 className={sty.listTitle}>房屋列表</h1>
          <a className={sty.titleMore} href="/home/house">
            更多房源
    </a>
        </div>

        <div className={sty.houseItems}>
          {/* 房屋列表 */}
          {
            this.state.list.map(item => (
              <HouseItem
                onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
                key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
              />
            ))
          }
        </div>
      </div>
    )
  }

  // 点击移动小区到中心点位置
  moveToCenter = (e) => {
    // 获取到当前点击到坐标点（位移开始）
    const { clientX, clientY } = e.changedTouches[0];
    // 中心点(可是区域的=》y轴排除列表高度)(终点)
    let xc, yc;
    xc = window.innerWidth / 2;
    yc = (window.innerHeight - 330) / 2;
    console.log('终点-开始：', xc, yc, clientX, clientY)
    // 获取移动的距离（x,y）
    let x = xc - clientX, y = yc - clientY;
    // 调用百度地图提供的方法位移地图
    this.map.panBy(x, y)
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
        {/* 渲染小区房源列表 */}
        {
          this.renderHouseList()
        }
      </div>
    );
  }
}

export default Map;