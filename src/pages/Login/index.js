import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import styles from './index.module.css'
import { login } from '../../utils/api/user'
import { setLocalData, HZW_TOKEN } from '../../utils'

import { withFormik } from 'formik';

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

// 受控组件（v-model=>双向绑定）：1. 表单元素的value绑定状态数据 2. 添加onChange事件做响应式

class Login extends Component {
  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
    } = this.props;
    // console.log(this.props)
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">
          账号登录
        </NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                value={values.username}
                onChange={handleChange}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                value={values.password}
                onChange={handleChange}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 使用withFormik高阶组件：
// 1. 处理表单双向绑定
// 2. 提交表单
const MyLogin = withFormik({
  // 双向绑定
  mapPropsToValues: () => ({ username: '', password: '' }),

  // Custom sync validation
  // validate: values => {
  //   const errors = {};

  //   if (!values.name) {
  //     errors.name = 'Required';
  //   }

  //   return errors;
  // },

  // 提交
  handleSubmit: async (values, { props, setValues }) => {
    // 获取表单数据=》用户名和密码
    const { username, password } = values;
    // console.log(username, password)
    // 调用接口：校验用户名和密码
    let { status, data, description } = await login({ username, password });
    if (status === 200) {
      // 登录成功
      // 1. 本地存储token
      setLocalData(HZW_TOKEN, data.token)
      // 2. 路由跳转=》个人中心
      props.history.push('/home/profile')
    } else {
      Toast.fail(description, 2);
      setValues({ username: '', password: '' })
    }
  },

  displayName: 'BasicForm',
})(Login);

export default MyLogin
