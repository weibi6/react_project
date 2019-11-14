import React, {Component} from 'react';

import './login.less';
//import logo from '../../assets/images/logo.png';
import { Form, Icon, Input, Button, message } from 'antd';
import {reqLogin} from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import {Redirect} from 'react-router-dom';
/*
登陆的路由组件
 */
class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    //对所有表单字段进行检验
    /* 方法一：1,在优化2之前的代码
    this.props.form.validateFields((err, values) => {
      //检验成功
      if (!err) {
        const {username, password} = values;
        reqLogin(username, password).then((response) => {
          console.log('成功了', response.data)
        }).catch((error) => {
          console.log('失败了', error)
        })
      }
    }); */
    /* 方法一：2
    使用async await:简化promise对象的使用，不用再使用then()来指定成功/失败的回调函数，
    以同步编码(没有回掉函数)方式实现异步流程
     */
    /* this.props.form.validateFields(async (err, values) => {
      //检验成功
      if (!err) {
        try {
          const {username, password} = values;
          const response = await reqLogin(username, password);
        } catch (error) {
          console.log('请求出错了')
        }
      }
    }); */

    /* 方法二 */
    this.props.form.validateFields(async (err, values) => {
      //检验成功
      if (!err) {
        const {username, password} = values;
        const result = await reqLogin(username, password);
        if(result.status === 0) {
          //登陆成功
          message.success('登陆成功')
          //保存user
          const user = result.data
          memoryUtils.user = user
          storageUtils.saveUser(user) //保存到local中
          //跳转到管理界面(不需要再回退回到登陆)
          this.props.history.replace('/')
        } else {
          //登录失败
          message.error(result.msg)
        }
      }
    });
  }
  validatePwd = (rule, value, callback) => {
    if(!value) {
      callback('请输入密码');
    } else if (value.length < 4) {
      callback('密码不能小于4位');
    } else if(value.length > 12) {
      callback('密码不能大于12位');
    } else if(!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须为英文数字或下划线组成');
    } else {
      callback() //验证成功
    }
  }
  render() {
    //如果用户已经登陆，自动跳转到管理界面
   /*  const user = memoryUtils.user
    if(user) {
      return <Redirect to='/'></Redirect>
    } */
    const { getFieldDecorator } = this.props.form;
    return(
      <div className="login">
        <header className="login-header">
         {/*  <img src={logo} alt="logo"/> */}
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              //声明式验证：直接使用别人定义好的验证规则进行验证
              { required: true, whitespace: true, message: '请输入你的用户名' },
              { min: 4, message: '用户名最少4位' },
              { max: 12, message: '用户名最多12位' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文数字或下划线组成' }
              /* 正则表达式里面使用+表示可以匹配任意多的字符，否则只能匹配一个字符 */
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            //自定义验证
            rules: [
              {
                validator: this.validatePwd
              }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登陆
                </Button>
              </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
/*
1.高阶函数
2. 高阶组件
 */
/*
包装Form组件，生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin
