/**
 * 首页
 */
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
// 引入样式
import './index.css'

// 二级路由页面
import Index from '../Index';
import House from '../House';
import Profile from '../Profile';
// 定义tabBar的数据结构：
import tabItemData from '../../utils/tabBarConf';

// 渲染=>标签页组件
class Home extends Component {

  state = {
    // 当前标签栏选中是谁？=> 当前页面path
    selectedTab: this.props.location.pathname
  }


  // 渲染tabBar组件方法
  renderTabBar = () => {
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
        {
          tabItemData.map((item, index) => <TabBar.Item
            title={item.title}
            key={index}
            icon={
              <i className={`iconfont ${item.icon}`} />
            }
            selectedIcon={
              <i className={`iconfont ${item.icon}`} />
            }
            selected={this.state.selectedTab === item.path}
            // 点击事件
            onPress={() => {
              this.props.history.push(item.path)
              this.setState({
                selectedTab: item.path,
              });
            }}

          />)
        }



      </TabBar>
    )
  }

  render() {
    // console.log(this.props)
    return (
      <div className="home">
        {/* 标签页二级路由配置 */}
        {/* 默认首页 */}
        <Route exact path='/home' component={Index} />
        {/* 列表找房 */}
        <Route path='/home/house' component={House} />
        {/* 个人中心 */}
        <Route path='/home/profile' component={Profile} />

        {/* 标签页组件 =》 复用 */}
        <div className='tabBox'>
          {
            this.renderTabBar()
          }
        </div>
      </div>
    );
  }
}

export default Home;