import React from 'react';

import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// 导入组件（页面）
import Home from './pages/Home';
import CityList from './pages/CityList';
import Map from './pages/Map';
import NotFound from './pages/NotFound';
import HouseDetail from './components/HouseDetail';
import Login from './pages/Login';
import Rent from './pages/Rent';
import RentAdd from './pages/Rent/Add';
import Search from './pages/Rent/Search';



function App() {
  return (
    <div className="app">
      {/* 配置路由:一级路由 */}
      <Router>
        <Switch>
          {/* 路由重定向 */}
          <Redirect exact from="/" to="/home" />
          {/* 首页 */}
          <Route path='/home' component={Home} />
          {/* 城市列表 */}
          <Route path='/cityList' component={CityList} />
          {/* 地图找房 */}
          <Route path='/map' component={Map} />
          {/*  登录 */}
          <Route path='/login' component={Login} />
          {/* 房源详情 */}
          <Route path="/detail/:id" component={HouseDetail} />
          {/* 发布房源 */}
          {/* 已发布房源的列表 */}
          <Route path="/rent" exact component={Rent} />
          {/* 发布房源页面 */}
          <Route path="/rent/add" component={RentAdd} />
          {/* 发布房源搜索=》当前发布房源的小区 */}
          <Route path="/rent/search" component={Search} />
          {/* 404页面 */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
