/**
 * 城市列表
 */
import React, { Component } from 'react';
import { getCityList, getHotCity } from '../../utils/api/city';
import { getCity, setLocalData, CURR_CITY } from '../../utils';
// 列表组件
import { List, AutoSizer } from 'react-virtualized';

// 引入组件样式
import './index.scss'
import { NavBar, Icon, Toast } from 'antd-mobile';

// 列表假数据
// const list = Array.from(new Array(100)).map((item, index) => index);
// console.log(list)

// 子组件
// const Fnc = (props) => {
//   console.log(props)
//   return (
//     <div>
//       <h2>函数子组件</h2>
//       {props.children(10000)}
//     </div>
//   )
// }

class CityList extends Component {

  // 定义状态数据
  state = {
    // 列表归类的类别
    cityIndex: [],
    // 归类的数据
    cityList: {}
  }


  componentDidMount() {
    this.getCityData()
  }


  // 获取城市列表数据
  getCityData = async () => {
    const { status, data } = await getCityList()
    if (status === 200) {
      console.log('所有城市数据：', data);
      const { cityList,
        cityIndex } = this.formatCities(data);

      // 获取热门城市数据 =》加到设计好的数据中
      const { status: st, data: dt } = await getHotCity();
      if (st === 200) {
        cityList['hot'] = dt;
        cityIndex.unshift('hot');
      }
      // 获取当前定位城市
      let city = await getCity();
      // 数据结构保持一致
      cityList['#'] = [city];
      cityIndex.unshift('#');
      console.log('处理完的数据：', cityList, cityIndex);
      // 做响应式
      this.setState({
        cityList,
        cityIndex
      })

    }
  }

  // 处理后台数据：按拼音首字母归类城市
  // 1. 创建formatCities方法
  // 2. 定义变量
  //    * 按拼音首字母归类的城市数据=〉cityList = {}
  //    * 所有城市首字母数据=》cityIndex=[]
  // 3. 遍历后台返回的数据（利用=》**对象的属性不能相同的特点**）
  // 4. 通过Object.keys(cityList)获取**所有城市首字母数组**
  formatCities = (data) => {
    let cityList = {}, cityIndex = [];
    data.forEach((item) => {
      // debugger
      // 归类
      // 获取当前遍历城市的拼音首字母
      let firstLetter = item.short.slice(0, 1);
      // 对象中键（城市的拼音首字母）是否存在
      if (!cityList[firstLetter]) {
        // 没有按照城市的拼音首字母=》新增
        cityList[firstLetter] = [item]
      } else {
        // 存在
        cityList[firstLetter].push(item)
      }
    })
    // 这个类别数组（所有城市的拼音首字母）
    cityIndex = Object.keys(cityList).sort()
    // 问题：老师，怎么渲染？ cityIndex =》cityList['b']
    return {
      cityList,
      cityIndex
    }

  }

  // 格式化title显示
  formatTitle = (title) => {
    switch (title) {
      case '#': return '当前城市';
      case 'hot': return '热门城市';
      default: return title.toUpperCase()
    }
  }

  // 切换定位城市事件函数
  selCity = (item) => {
    // 后台数据：只有北上广深是有数据的
    const hasData = ['北京', '上海', '广州', '深圳'];
    if (hasData.includes(item.label)) {
      // 存在
      // 更新本地定位数据
      setLocalData(CURR_CITY, JSON.stringify(item))
      // 返回首页
      this.props.history.goBack()
    } else {
      // 不存在
      Toast.fail('该城市暂无房源数据 !!!', 2);
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
    // 获取归类的数据，并渲染列表
    const { cityIndex, cityList } = this.state;
    // 列表下归类：title
    const title = cityIndex[index];
    // 对应title下的城市数据
    const titleCity = cityList[title];
    // console.log(title, titleCity)
    // row模版
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatTitle(title)}</div>
        {/* 归类城市小列表 */}
        {/* <div className="name">安庆</div> */}
        {
          titleCity.map((item) => <div onClick={() => this.selCity(item)} key={item.value} className="name">{item.label}</div>)
        }
      </div>
    );
  }

  // 动态计算row的高度
  /**
   * index：列表当前行的索引
   */
  execHeight = ({ index }) => {
    // 获取归类的数据，并渲染列表
    const { cityIndex, cityList } = this.state;
    // 列表下归类：title
    const title = cityIndex[index];
    // 对应title下的城市数据
    const titleCity = cityList[title];
    return 36 + 50 * titleCity.length
  }

  render() {
    return (
      <div className="cityListBox">
        {/* 顶部导航 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >城市选择</NavBar>
        {/* <Fnc a={123}>{(num) => <h1>{num}</h1>}</Fnc> */}
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              className='listBox'
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.execHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default CityList;