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
import {Button, Form, Input, Select} from 'antd';
import style from './EditUser.scss'
import {AsyncPost} from 'Utils/utils'

const FormItem = Form.Item;

const Option = Select.Option;

class EditUser extends BaseComponent {

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

        AsyncPost('/api/v1/cn/edu/ahut/department/listAll', {}, "get", (data) => {
            if (data.code === 0) {
                this.setState({
                    data: this.state.data.update('departmentList', () => data.result)
                });
            }
        });

        this.initFrom(this.props.editMessage)
    }

    initFrom = (editMessage) => {
        this.props.form.setFieldsValue(
            {departmentName: editMessage.departmentName || '暂无'},
        );
        this.props.form.setFieldsValue(
            {userName: editMessage.userName || '暂无'},
        );
        this.props.form.setFieldsValue(
            {userCode: editMessage.userCode || '暂无'}
        );
        this.props.form.setFieldsValue(
            {role: editMessage.role || '暂无'}
        );
    };

    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                AsyncPost('/api/v1/cn/edu/ahut/user/updateUser', {
                    id: this.props.editMessage.id,
                    userName: values.userName,
                    userCode: values.userCode,
                    departmentName: values.departmentName,
                    role: values.role
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
                <FormItem
                    {...formItemLayout}
                    label="选择部门"
                >
                    {getFieldDecorator('departmentName', {
                        rules: [
                            {required: true, message: '请选择您的部门 !'},
                        ],
                    })(
                        <Select initialValue={this.props.editMessage.departmentName} placeholder="请选择您的部门" disabled>
                            {
                                this.state.data.get('departmentList').map((data, index) => {
                                    return (
                                        <Option key={data.id} value={data.departmentName}>{data.departmentName}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="员工姓名">
                    {getFieldDecorator('userName', {
                        rules: [{
                            required: true,
                            message: '请输入员工姓名',
                            whitespace: true
                        }],
                    })(
                        <Input placeholder="请输入员工姓名"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="员工编号">
                    {getFieldDecorator('userCode', {
                        rules: [{
                            required: true,
                            message: '请输入员工编号',
                            whitespace: true
                        }]
                    })(
                        <Input disabled={true} placeholder="请输入员工编号"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="选择权限">
                    {getFieldDecorator('role', {
                        rules: [{
                            required: true,
                            message: '请选择员工权限',
                        }]
                    })(
                        <Select initialValue={this.props.editMessage.role} placeholder="请选择员工权限">
                            <Option value="user">普通员工</Option>
                            <Option value="admin">管理人员</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className={style.submitbtn}>提交</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(EditUser);
