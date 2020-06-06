import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Toast, Modal } from 'antd-mobile'

import { BASE_URL } from '../../utils/axios'

import styles from './index.module.css'
import { isAuth, delToken } from '../../utils'
import { getUser, logout } from '../../utils/api/user'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class Profile extends Component {


  state = {
    // 判断用户是否登录
    isLogin: isAuth(),
    // 当前登录信息
    userInfo: null
  }

  componentDidMount() {
    this.getUserInfo()
  }


  /**
   * 判断是否登录：1. 登录：调用接口获取当前登录人信息/处理模版 2. 没有登录：什么都不做
   */
  getUserInfo = async () => {
    const { isLogin } = this.state;
    if (!isLogin) return;
    // 已经登录=》调用后台接口
    const { status, data, description } = await getUser();
    if (status === 200) {
      this.setState({
        userInfo: data
      })
    } else {
      // token过期处理
      delToken();
      Toast.info(description, 2)
      this.props.history.push('/login')
    }

  }

  /**
   * 退出的业务：1. 弹出一个确认对话框 2. 点击确定了才退出
   */
  logout = () => {
    Modal.alert('提示', '确定退出登录吗???', [
      { text: '取消' },
      {
        text: '确定',
        onPress: async () => {
          // console.log('退出登录！')
          /**
           * 退出登录：
           * 1. 服务器端退出：调用接口   
           * 2. 本地退出登录：删除本地存储的token
           * 3. 处理登录状态
           */
          const { status, description } = await logout();
          if (status === 200) {
            Toast.info(description, 2);
            delToken();
            // 退出成功：停留在当前页面
            this.setState({
              isLogin: false,
              userInfo: null
            })
          }
        }
      }
    ])
  }

  render() {
    const { history } = this.props
    const { userInfo, isLogin } = this.state;
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          {/* 登录人信息 */}
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={userInfo?.avatar ?? DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{userInfo?.nickname ?? '游客'}</div>
              {/* 登录后展示： */}
              {
                isLogin && <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit} onClick={
                    () => history.push('/rent/add')
                  }>
                    发布房源
                  <span className={styles.arrow}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              }

              {/* 未登录展示： */}
              {
                isLogin || <div className={styles.edit}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => history.push('/login')}
                  >
                    去登录
                </Button>
                </div>
              }
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
