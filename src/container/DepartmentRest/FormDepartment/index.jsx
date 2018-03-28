/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React, {Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './formDepartment.scss'
import {Form, Input, Button, Upload, Icon, message} from 'antd';
import {Map} from 'immutable'

const FormItem = Form.Item;
import {AsyncPost} from 'Utils/utils'

class DepartmentRest extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({})
        }
    }


    componentDidMount() {

    }

    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let para = {
                departmentCode: values.departmentCode,
                departmentName: values.departmentName
            };
            if (!err) {
                AsyncPost('/api/v1/cn/edu/ahut/department/saveDepartment', para, 'post', (data) => {
                    if (data.code === 0) {
                        message.success("添加成功");
                    } else {
                        message.warning(data.message);
                    }
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        return (
            <div className={style.from_box}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="部门名称">
                        {getFieldDecorator('departmentName', {
                            rules: [{
                                required: true,
                                message: '请输入部门名称 !',
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
                            <Input placeholder="请输入部门编号"/>
                        )}
                    </FormItem>
                    <FormItem className={style.submitbtnBox}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(DepartmentRest);

