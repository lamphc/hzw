/**
 * 默认首页
 */
import React, { Component } from 'react';
import { Carousel, Flex, Grid, WingBlank, SearchBar } from 'antd-mobile';
// 导入自己的封装的axios
import { BASE_URL } from '../../utils/axios';
import { getSwiper, getGroup, getNews } from '../../utils/api/home';

// 导入样式
import './index.scss'
import Navs from '../../utils/navConf';


class Index extends Component {
  state = {
    // 轮播图图片数据
    swiper: [],
    // 租房小组数据
    group: [],
    // 新闻资讯
    news: [],
    // 控制自动播放
    isPlay: false,
    // 搜索关键词
    keyword: '',
    // 轮播图默认高度
    imgHeight: 212,
  }
  componentDidMount() {
    this.loadAll();
  }

  // 获取首页所有接口数据
  loadAll = async () => {
    const [swiper, group, news] = await Promise.all([getSwiper(), getGroup(), getNews()]);
    console.log('1. 获取首页所有接口数据', swiper, group, news)
    // 2. 批量做响应式
    if (swiper.status === 200) {
      this.setState({
        swiper: swiper.data,
        group: group.data,
        news: news.data
      }, () => {
        // 轮播图已经有数据了
        this.setState({
          isPlay: true
        })
      })
    }

  }



  // 渲染轮播图组件
  renderCarousel = () => {
    return (
      <Carousel
        // 自动播放控制
        autoplay={this.state.isPlay}
        infinite
      >
        {this.state.swiper.map(val => (
          <a
            key={val.id}
            href="http://itcast.cn"
            style={{ display: 'inline-block', width: '100%', background: 'gray', height: this.state.imgHeight }}
          >
            <img
              src={`${BASE_URL}${val.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                // 触发了一个自适应高度的事件
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 渲染栏目导航
  renderNavs = () => {
    return (
      <Flex className="nav">
        {
          Navs.map((item, index) => <Flex.Item onClick={() => {
            this.props.history.push(item.path)
          }} key={index}>
            <img src={item.img} />
            <p>{item.name}</p>
          </Flex.Item>)
        }
      </Flex>
    )
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`${BASE_URL}${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  // 顶部导航栏
  renderTopNav = () => {
    const { push } = this.props.history;
    return (
      <Flex justify="around" className="topNav">
        <div className="searchBox">
          <div onClick={() => {
            push('/cityList')
          }} className="city">
            北京<i className="iconfont icon-arrow" />
          </div>
          <SearchBar
            value={this.state.keyword}
            onChange={(v) => this.setState({ keyword: v })}
            placeholder="请输入小区或地址"
          />
        </div>
        <div className="map" onClick={() => {
          push('/map')
        }}>
          <i key="0" className="iconfont icon-map" />
        </div>
      </Flex>
    )
  }

  // 渲染租房小组
  renderGroup = () => {
    return (
      <>
        {/* title */}
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        {/* 内容 */}
        <Grid data={this.state.group}
          columnNum={2}
          hasLine={false}
          square={false}
          renderItem={item => (
            // 自定义宫格结构和样式
            <Flex className="grid-item" justify="between">
              <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      </>
    )
  }

  render() {
    return (
      <div className="indexBox">
        {/* 顶部导航栏 */}
        {
          this.renderTopNav()
        }
        {/* 轮播图 */}
        {
          this.renderCarousel()
        }
        {/* 栏目导航 */}
        {
          this.renderNavs()
        }
        {/* 租房小组 */}
        <div className="group">
          {
            this.renderGroup()
          }
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}

export default Index;