import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd'

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
const { SubMenu } = Menu;
class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map((item) => {
            if(!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                //查找与当前路径匹配的子Item
                //const Item = item.children.find((cItem) => cItem.key === path)
                const Item = item.children.find((cItem) => path.indexOf(cItem.key) === 0) //'/product'与'/product/detail'的开头
                //如果存在，说明当前item的子列表需要打开
                if(Item) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                    key={item.key}
                    title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                    }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    /* 遍历的方法二,使用reduce */
/*     getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            if(!item.children) {
                pre.push(
                    (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                )
            } else {
                pre.push(
                    (
                        <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                )
            }
            return pre;
        }, [])
    } */
    /* 在第一次render()之前执行一次，为第一个render()准备数据(必须同步的) */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        //请求当前的路由路径
        //方法一：从Admin组件传一个location属性<leftNav location = {this.props.location}></leftNav>
        //方法二：使用高阶组件withRouter,包装非路由组见，返回一个新的组件，
        //新的组件向非路由组件传递三个属性：history,match,location,下面采用方法二
        // const path = this.props.location.pathname
        let path = this.props.location.pathname
        console.log('render()', path)
        if(path.indexOf('/product') === 0) {//当前请求的是商品或其子路由界面
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台系统</h1>
                </Link>
                <Menu
                selectedKeys={[path]}
                defaultOpenKeys={[openKey]}
                mode="inline"
                theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)