import React, {Component} from 'react';
import {Redirect, Switch, Route} from 'react-router-dom';
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../../pages/home/home'
import Product from '../../pages/product/product'
import Category from '../../pages/category/category'
import Role from '../../pages/role/role'
import User from '../../pages/user/user'
import Pie from '../../pages/charts/pie'
import Line from '../../pages/charts/line'
import Bar from '../../pages/charts/bar'
import Login from '../../pages/login/login'

const { Footer, Sider, Content } = Layout;
/*
后台管理的路由组件
 */
export default class Admin extends Component {

  render() {
    const user = memoryUtils.user;
    // 如果内存没有存储user,表示当前没有登陆
    /* if(!user || !user._id) {
      //自动跳转到登陆(在render()中)
      return <Redirect to='/login'></Redirect>
    } */
    return(
      <Layout style={{minHeight: '100%'}}>
      <Sider>
        <LeftNav></LeftNav>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{margin: '20px', backgroundColor: '#fff'}}>
          <Switch>
            <Route path='/home' component={Home}/>
            <Route path='/login' component={Login}/>
            <Route path='/category' component={Category}/>
            <Route path='/product' component={Product}/>
            <Route path='/role' component={Role}/>
            <Route path='/user' component={User}/>
            <Route path='/charts/bar' component={Bar}/>
            <Route path='/charts/line' component={Line}/>
            <Route path='/charts/pie' component={Pie}/>
            <Redirect to='/home'></Redirect>
          </Switch>
        </Content>
        <Footer style={{textAlign: 'center', backgroundColor: '#ccc'}}>想要获得更好的体验，请使用谷歌浏览器</Footer>
      </Layout>
    </Layout>
    )
  }
}

