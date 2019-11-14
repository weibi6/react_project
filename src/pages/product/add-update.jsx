import React, {Component} from 'react';
import {Card, Input, Icon, Button, Form, Cascader} from 'antd';
import axios from 'axios'

import '../../mock/mock'
import LinkButton from '../../components/link-button';
import PicturesWall from './picture-wall';
import RichTextEditor from './rich-text-editor'

const { TextArea } = Input;

class ProductAddUpdate extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }
    state = {
        options: [],
        subCategorys: [], //二级分类列表
    };
    initOptions = (categorys) => {
      const options =  categorys.map((category) => ({
        value: category._id,
        label: category.name,
        isLeaf: false,
      }))
      //更新状态
      this.setState({
        options
      })
    }
    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };
    loadData = (selectedOptions) => {
        //得到选中的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        //显示loading
        targetOption.loading = true;
        //根据选中的分类，请求获取二级分类列表
        //const subCategory = this.getCategorys(targetOption.value)
        axios.post('/reqCategoryList', {parentId: targetOption.value}) //这列的'/mock'与mock.js文件里的地址一致
          .then(res=>{
              const result = res.data;
              if(result.status === 0) {
                const subCategorys = result.data
                this.setState({
                  subCategorys
                })
                //console.log(subCategorys)
                // load options lazily
                setTimeout(() => {
                  targetOption.loading = false;
                  targetOption.children = subCategorys.map((c) => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                  }))
                  this.setState({
                    options: [...this.state.options],
                  });
                }, 500);
              }
          })

    };
    submit = () => {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log(values);
            const detail = this.editor.current.getDetail()
            console.log(detail)
          }
        });
    };
    getCategorys = (parentId) => {
      parentId = parentId || this.state.parentId
      //发异步ajax请求，获取数据
      axios.post('/reqCategoryList', {parentId: parentId}) //这列的'/mock'与mock.js文件里的地址一致
          .then(res=>{
              const result = res.data;
              let categorys
              if(result.status === 0) {
                categorys = result.data
                //如果是一级分类列表
                if(parentId === '0') {
                  this.initOptions(categorys)
                } else { //二级列表
                  return categorys //返回二级列表
                }
              }
          })
    }
    /* 验证价格的自定义验证函数 */
    validatePrice = (rule, value, callback) => {
        if(!value) {
          callback('请输入价格');
        } else if (value*1 < 0) {
          callback('价格不能为负数');
        } else {
          callback() //验证成功
        }
    }
  componentDidMount() {
    this.getCategorys('0')
  }
  componentWillMount() {
    //取出携带的state
    const product = this.props.location.state//如果是添加没值，修改有值
    //保存是否更新的标识
    this.isUpdate = !!product
    this.product = product || {}
  }
    render() {
        const {product, isUpdate} = this
        const {detail} = product
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        const { getFieldDecorator } = this.props.form;
        return (
            <Card title={title}>
                <Form labelCol={{ span: 3 }} wrapperCol={{ span: 10 }}>
                    <Form.Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [{ required: true, message: '请输入商品名称' }],
                        })(
                            <Input placeholder="请输入商品名称"/>
                        )}
                    </Form.Item>
                    <Form.Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [{ required: true, message: '请输入商品描述' }],
                        })(
                            <TextArea placeholder="请输入商品描述"/>
                        )}
                    </Form.Item>
                    <Form.Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            //自定义验证
                            rules: [
                                {
                                validator: this.validatePrice
                                }
                            ],
                        })(
                            <Input type="number" placeholder="请输入商品价格" addonAfter="元"/>
                        )}
                    </Form.Item>
                    <Form.Item label="商品分类">
                        {getFieldDecorator('categoryIds', {
                            initialValue: [],
                            rules: [{ required: true, message: '请选择商品分类' }],
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                onChange={this.onChange}
                                changeOnSelect
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="商品图片">
                        {getFieldDecorator('imgs', {
                            initialValue: product.name,
                        })(
                            <PicturesWall></PicturesWall>
                        )}
                    </Form.Item>
                    <Form.Item label="商品详情" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                        {getFieldDecorator('details', {
                            initialValue: '',
                        })(
                            <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)
