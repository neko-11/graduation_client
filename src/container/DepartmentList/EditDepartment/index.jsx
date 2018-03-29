/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React from 'react';
import {Map} from 'immutable';
import BaseComponent from 'Utils/BaseComponent.jsx'
import {Button, Form, Input} from 'antd';
import style from './EditDepartment.scss'
import {AsyncPost} from 'Utils/utils'

const FormItem = Form.Item;


class EditDepartment extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                departmentList: []
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.editMessage.id != nextProps.editMessage.id) {
            this.initFrom(nextProps.editMessage)
        }
    }


    componentDidMount() {
        this.initFrom(this.props.editMessage)
    }

    initFrom = (editMessage) => {
        this.props.form.setFieldsValue(
            {departmentName: editMessage.departmentName || '暂无'},
        );
        this.props.form.setFieldsValue(
            {departmentCode: editMessage.departmentCode || '暂无'},
        );
    };

    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                AsyncPost('/api/v1/cn/edu/ahut/department/updateDepartment', {
                    id: this.props.editMessage.id,
                    departmentCode: values.departmentCode,
                    departmentName: values.departmentName
                }, "post", (data) => {
                    if (data.code === 0) {
                        this.props.handleMessageOk();
                    }
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18}
            }
        };
        return (
            <Form onSubmit={this.handleSubmit} className={style.from_box}>
                <FormItem {...formItemLayout} label="部门名称">
                    {getFieldDecorator('departmentName', {
                        rules: [{
                            required: true,
                            message: '请输入部门名称',
                            whitespace: true
                        }],
                    })(
                        <Input placeholder="请输入部门名称"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="部门编号">
                    {getFieldDecorator('departmentCode', {
                        rules: [{
                            required: true,
                            message: '请输入部门编号',
                            whitespace: true
                        }]
                    })(
                        <Input disabled={true} placeholder="请输入部门编号"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className={style.submitbtn}>提交</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(EditDepartment);
