import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Select} from 'antd';
class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired, //一级分类的数组
        parentId: PropTypes.string.isRequired,  //父分类的ID
        setForm: PropTypes.func.isRequired
    }
    componentWillMount() {
        //将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form)
    }
    render() {
        const {Option} = Select;
        const { getFieldDecorator } = this.props.form;
        const {categorys, parentId} = this.props;
        //const {categorys, parentId} = this.props;
        return (
            <Form>
                <Form.Item>
                {getFieldDecorator('parentId', {
                    initialValue: parentId
                })(
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(category => <Option value={category._id} key={category._id}>{category.name}</Option>)
                        }
                    </Select>
                )}   
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('categoryName', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入分类名称' }],
                })(
                    <Input placeholder="请输入分类名称"></Input>,
                )}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)