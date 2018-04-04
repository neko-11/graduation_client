/**
 * Created by zhushuangfei on 2018/3/22.
 */

import React from 'react';
import {Map} from 'immutable';
import BaseComponent from 'Utils/BaseComponent.jsx'
import {Button, DatePicker, Form, Input} from 'antd';
import moment from 'moment';
import style from './EditRecord.scss'
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
            {userName: editMessage.userName || '暂无'},
        );
        this.props.form.setFieldsValue(
            {departmentName: editMessage.departmentName || '暂无'},
        );
        this.props.form.setFieldsValue(
            {arriveTime: moment(editMessage.arriveTime, 'YYYY-MM-DD HH:mm:ss')},
        );
    };

    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                AsyncPost('/api/v1/cn/edu/ahut/record/updateRecord', {
                    id: this.props.editMessage.id,
                    arriveTime: values.arriveTime.format('YYYY-MM-DD HH:mm:ss')
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
                <FormItem {...formItemLayout} label="员工姓名">
                    {getFieldDecorator('userName', {
                        rules: [{
                            required: true,
                            message: '请输入员工姓名',
                            whitespace: true
                        }],
                    })(
                        <Input disabled={true} placeholder="请输入员工姓名"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="部门名称">
                    {getFieldDecorator('departmentName', {
                        rules: [{
                            required: true,
                            message: '请输入部门名称',
                            whitespace: true
                        }]
                    })(
                        <Input disabled={true} placeholder="请输入部门名称"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="签到时间"
                >
                    {getFieldDecorator('arriveTime', {
                        rules: [{
                            type: 'object',
                            required: true,
                            message: '请选择时间!'
                        }]
                    })(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
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
