/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React, {Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import {Map} from 'immutable';
import style from './UserRecord.scss'
import {Button, Card, Col, DatePicker, Form, message, Row, Table} from 'antd';
import {AsyncPost} from 'Utils/utils'

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

const {Meta} = Card;

class UserRecord extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                tloading: true,
                dataSource: [],
            }),
            userInfo: {}
        }
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {
        AsyncPost('/api/v1/cn/edu/ahut/record/listRecord', {
            userId: sessionStorage.getItem('id')
        }, "post", (data) => {
            if (data.code === 0) {
                let arr = [];
                data.result.map((data, index) => {
                    arr.push({
                        key: index,
                        id: data.id,
                        index: index + 1,
                        userName: data.userName,
                        userCode: data.userCode,
                        departmentName: data.departmentName,
                        arriveTime: data.arriveTime
                    })
                });
                if (this.mounted) {
                    this.setState({
                        data: this.state.data.update('dataSource', () => arr)
                            .update('tloading', () => false)
                    });
                }
            } else {
                message.error("发生错误");
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let para = {
                    userId: sessionStorage.getItem("id")
                };
                if (values.arriveTime !== undefined && values.arriveTime.length !== 0) {
                    para.startTime = values.arriveTime[0].format('YYYY-MM-DD');
                    para.endTime = values.arriveTime[1].format('YYYY-MM-DD');
                }
                AsyncPost('/api/v1/cn/edu/ahut/record/listRecord', para, "post", (data) => {
                    if (data.code === 0) {
                        let arr = [];
                        data.result.map((data, index) => {
                            arr.push({
                                key: index,
                                id: data.id,
                                index: index + 1,
                                userName: data.userName,
                                userCode: data.userCode,
                                departmentName: data.departmentName,
                                arriveTime: data.arriveTime
                            })
                        });
                        if (this.mounted) {
                            this.setState({
                                data: this.state.data.update('dataSource', () => arr)
                                    .update('tloading', () => false)
                            });
                        }
                    } else {
                        message.error("发生错误");
                    }
                });
            }
        });
    };

    render() {

        const columns = [{
            title: '',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
        }, {
            title: '工号',
            dataIndex: 'userCode',
            key: 'userCode',
        }, {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
        }, {
            title: '签到时间',
            dataIndex: 'arriveTime',
            key: 'arriveTime',
        }];
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <h3 key="tittle" className={style.tittle}>个人中心</h3>
                <Form key="form" onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={7} key={3} style={{textAlign: 'center', padding: '0 2em'}}>
                            <FormItem>
                                {getFieldDecorator('arriveTime', {
                                    rules: [{type: 'array'}],
                                })(
                                    <RangePicker placeholder={['起始日期','结束日期']}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={3} key={4} style={{textAlign: 'center'}}>
                            <FormItem>
                                <Button type="primary" htmlType="submit">搜索</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table loading={this.state.data.get('tloading')} pagination={{pageSize: 10}} key="table"
                       dataSource={this.state.data.get('dataSource')}
                       columns={columns}/>
            </div>
        )
    }
}

export default Form.create()(UserRecord);

