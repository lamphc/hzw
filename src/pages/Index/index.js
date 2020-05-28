/**
 * 默认首页
 */
import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';
// 导入自己的封装的axios
import http from '../../utils/axios';

// import axios from 'axios'



class Index extends Component {
  state = {
    // 轮播图图片数据
    swiper: [],
    // 轮播图默认高度
    imgHeight: 212,
  }
  componentDidMount() {
    this.getSwiper()
  }

  // 获取轮播图数据
  getSwiper = async () => {
    const { status, data } = await http.get('/home/swiper')
    // console.log(res)
    if (status === 200) {
      // 响应式：修改轮播图的数据
      this.setState({
        swiper: data
      })
    }
  }


  // 渲染轮播图组件
  renderCarousel = () => {
    return (
      <Carousel
        // 自动播放控制
        autoplay={true}
        infinite
      >
        {this.state.swiper.map(val => (
          <a
            key={val.id}
            href="http://itcast.cn"
            style={{ display: 'inline-block', width: '100%', background: 'gray', height: this.state.imgHeight }}
          >
            <img
              src={`http://api-haoke-dev.itheima.net${val.imgSrc}`}
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

  render() {
    return (
      <div className="indexBox">

        {/* 轮播图 */}
        {
          this.renderCarousel()
        }
      </div>
    );
  }
}

export default Index;