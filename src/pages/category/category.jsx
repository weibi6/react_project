import React, {Component} from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd';
import axios from 'axios'

import '../../mock/mock'
import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
    state = {
        showStatus: 0, //showStatus为0，表示弹框不显示，为1表示显示添加的弹框，为2表示显示修改的弹框
        categorys: [],  //一级分类列表
        subCategorys: [], //二级分类列表
        loading: false, //是否正在获取数据中
        parentId: '0', //当前需要显示的分类列表的父分类Id
        parentName: '', //当前需要显示的父分类列表的父分类名称
    }
    /* 显示添加的弹框 */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    /* 关闭添加的弹框 */
    handleCancelAdd = () => {
        this.setState({
            showStatus: 0
        })
    }
    /* 添加分类 */
    addCategory = () => {
        this.form.validateFields((err, values) => {
            if (!err) {
                //隐藏添加框
                this.setState({
                    showStatus: 0
                })
                //收集数据，并提交添加分类的请求
                //const {parentId, categoryName} = this.form.getFieldsValue() //该收集数据与addForm里面的getFieldDecorator里面的参数一致
                const {parentId, categoryName} = values
                //清除输入数据
                this.form.resetFields()
                axios.post('/addCategory', {parentId: parentId, categoryName: categoryName})
                    .then(res => {
                        const result = res.data;
                        console.log(result)
                        if(result.status === 0) {
                            //添加的分类就是当前分类列表下的分类
                            if(parentId === this.state.parentId) {
                                //重新显示列表
                                this.getCategorys()
                            } else if(parentId === '0') { //在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一级列表
                                this.getCategorys('0')
                            }
                        }
                    }).catch((error) => {
                        message.error('添加失败')
                    })
                    }
                })
    }
    /* 显示修改的弹框 */
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        //更新状态
        this.setState({
            showStatus: 2
        })
    }
    /* 关闭修改的弹框 */
    handleCancelUpdate = () =>{
        //清除输入数据
        this.form.resetFields()
        //隐藏修改框
        this.setState({
            showStatus :0
        })
    }
    /* 更新分类 */
    updateCategory = () => {
        //进行表单验证，只有通过了才处理
        this.form.validateFields((err, values) => {
            if (!err) {
              //隐藏修改框
                this.setState({
                    showStatus: 0
                })
                //准备数据
                const categoryId = this.category._id
                //const categoryName = this.form.getFieldValue('categoryName')
                const {categoryName} = values   //有了表单验证之后，值可以从values里面取
                //清除输入数据
                this.form.resetFields()
                //发请求更新分类
                axios.post('/updateCategoryName', {categoryId: categoryId, categoryName: categoryName})
                    .then(res => {
                        const result = res.data;
                        if(result.status === 0) {
                            //重新显示列表
                            this.getCategorys()
                        }
                    }).catch((error) => {
                        message.error('修改失败')
                    })
            }
        })
        
    }
    /* 初始化table所有列数 */
    initColums = () => {
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              dataIndex: '',
              key: 'x',
              width: 300,
              render: (category) => (
                  <span>
                      <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                      {/* 如何向事件回调函数中传递参数：先定义一个数据，在函数调用处理的函数并传入数据 */}
                      {this.state.parentId === '0' ?  <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null} 
                  </span>
              )
            },
          ];
    }
    /*
     获取一级或者二级分类列表,
     parentId: 如果没有指定根据状态中的parentId请求，如果指定了，根据指定的parentId发请求
    */
    getCategorys = (parentId) => {
        //在发请求前，显示loading
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        //发异步ajax请求，获取数据
        axios.post('/reqCategoryList', {parentId: parentId}) //这列的'/mock'与mock.js文件里的地址一致  
            .then(res=>{
                const result = res.data;
                //请求完成后，隐藏loading
                this.setState({loading: false})
                /* if(result.status === 0) {     
                    //取出分类数组数据，可能是一级的，也可能是二级的
                    const categorys = result.data;
                    if(parentId === '0') {
                        //更新一级分类状态
                        this.setState({categorys: categorys})
                    } else {
                        this.setState({
                            subCategorys: categorys
                        })
                    }
                } else {
                   message.error('获取人物列表失败')
               }   */
               //取出分类数组数据，可能是一级的，也可能是二级的
               const categorys = result.data;
               if(parentId === '0') {
                   //更新一级分类状态
                   this.setState({categorys: categorys})
               } else {
                   this.setState({
                       subCategorys: categorys
                   })
               }
            }).catch((error) => {
                message.error('出错')
            })
    }
    /* 显示一级分类列表 */
    showCategorys = () => {
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    /* 显示指定一级分类对象的二子列表 */
    showSubCategorys = (category) => {
        //更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //在状态更新且重新render()后执行
            //获取二级分类列表
            this.getCategorys()
        })
        //setState()不能立即获取最新的状态，因为setState()是异步更新状态的
    }
    /* 为第一次render准备数据 */
    componentWillMount() {
        this.initColums()
    }
    componentDidMount(){
        this.getCategorys()
    }
    render() {
        const {showStatus, categorys, loading, subCategorys, parentId, parentName} = this.state
        //读取指定的分类
        const category = this.category
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{marginRight: 5}}></Icon>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type="plus"></Icon>
                添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table bordered dataSource={parentId === '0' ? categorys : subCategorys} rowKey='_id' columns={this.columns} loading={loading}
                pagination={{defaultPageSize: 2, showQuickJumper: true}}/>
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancelAdd}
                >
                    <AddForm categorys={categorys ? categorys : [[]]} parentId={parentId ? parentId : ''}
                    setForm={(form) => {this.form = form}}
                    ></AddForm>
                    {/* 此处使用三目运算符的原因与下面一样，因为一开始没有值的时候会报错，这样做的目的是防止报错 */}
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancelUpdate}
                >
                   <UpdateForm categoryName={category ? category.name : ''}
                   setForm={(form) => {this.form = form}}></UpdateForm>
                   {/* 结合showUpdate()函数，默认会先渲染，渲染的时候category是没有值的，会报错，故用三目运算符防止报错 */}
                </Modal>
            </Card>
        )
    }
}