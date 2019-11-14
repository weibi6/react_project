import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'

import './index.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button'
const { confirm } = Modal;
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()) //当前时间
    }

    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }
    //得到title
    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach((item) => {
            if(item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title;
    }
    logout = () => {
        confirm({
            title: '你确定要退出吗',
            onOk: () => {
                //清除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                //跳转路由到登陆界面
                this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    /* 第一次render()之后执行一次，一般在此执行异步操作，发ajax请求/启动定时器 */
    componentDidMount() {
        this.getTime()
    }
    /* 当前组件卸载之前调用 */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.intervalId)
    }
    render() {
        //取出title
        const title = this.getTitle()
        const {currentTime} = this.state
        const {username} = memoryUtils.user
        return (
           <div className="header">
               <div className="header-top">
                   <span>欢迎, {username}</span>
                   {/* <a href="javascript:" onClick = {this.logout}>退出</a> */}
                   <LinkButton onClick = {this.logout}>退出</LinkButton>
               </div>
               <div className="header-bottom">
                   <div className="header-bottom-left">{title}</div>
                   <div className="header-bottom-right">
                       <span>{currentTime}</span>
                       <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/>
                       <span>晴</span>
                   </div>
               </div>
           </div>
        )
    }
}
export default withRouter(Header)
