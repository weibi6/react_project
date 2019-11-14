import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {PAGE_SIZE} from "../../utils/constants"
import {formateDate} from "../../utils/dateUtils"
import {reqUsers, reqAddOrUpdateUser, reqDeleteUser} from '../../api'
import LinkButton from '../../components/link-button'
import AddUpdate from './add-update'
const { confirm } = Modal

/*
角色路由
 */
export default class User extends Component {

  state = {
    users: [], // 所有用户的列表
    roles: [], //所有角色的列表
    isShow: false, // 是否显示添加或更新界面
    isDelete: false, //是否显示删除用户界面
  }
  /* 显示添加界面 */
  showAdd = () => {
    this.user = null //去除前面保存的user
    this.setState({
      isShow: true
    })
  }
   /*
  添加/更新用户
   */
  addOrUpdateUser = async () => {

    this.setState({isShow: false})

    // 1. 收集输入数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新, 需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id
    }

    // 2. 提交添加的请求
    const result = await reqAddOrUpdateUser(user)
    // 3. 更新列表显示
    if(result.status===0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.getUsers()
    }
  }
  /* 显示修改的弹框 */
  showUpdate = (user) => {
    //保存用户分类对象
    this.user = user
    //更新状态
    this.setState({
        isShow: true
    })
  }
  /* 确定删除用户 */
  deleteUser = (user) => {
    confirm({
      title: `确定要删除${user.username}吗`,
      onOk: async ()=> {
        const userId = user._id
        const result = await reqDeleteUser(userId)
        if(result.status === 0) {
          message.success('删除用户成功')
          this.getUsers()
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });    
  }
  initColumn = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 300,
        render: (user) => (
            <span>
                <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
            </span>
        )
      },
    ]
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status===0) {
      const {users, roles} = result.data
      this.setState({
        users,
        roles
      })
    }
  }
  componentWillMount () {
    this.initColumn()
  }

  componentDidMount () {
    this.getUsers()
  }

  render() {

    const {users, isShow, roles} = this.state
    const user = this.user || {}
    const title = (
      <span>
        <Button type='primary' onClick={this.showAdd}>创建用户</Button>
      </span>
    )
    const addUpdateTitle = user._id ? '修改用户' : '添加用户'
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
        />
        <Modal
          title={addUpdateTitle}
          visible={isShow === true}
          onOk={this.addOrUpdateUser}
          onCancel={() => this.setState({isShow: false})}
        >
          <AddUpdate setForm={(form) => this.form = form} user={user} roles={roles}></AddUpdate>
        </Modal>
      </Card>
    )
  }
}
