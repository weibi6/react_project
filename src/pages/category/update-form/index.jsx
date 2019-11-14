import React, {Component} from 'react';
import {Input, Form} from 'antd';
import PropTypes from 'prop-types';

class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    componentWillMount() {
        //将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {categoryName} = this.props;
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator('categoryName', {
                        initialValue: categoryName,
                        rules: [{ required: true, message: '请输入分类名称' }]
                    })(
                        <Input placeholder="请输入分类名称"></Input>,
                    )}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)
