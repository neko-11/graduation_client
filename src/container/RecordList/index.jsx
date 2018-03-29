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
import {Form, Select, Row, Col, Input, Table, Icon, Divider, Modal, message, Button, Spin, DatePicker} from 'antd'

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import {AsyncPost} from 'Utils/utils'
import style from './RecordList.scss'
import EditRecord from './EditRecord/index.jsx'

class DepartmentList extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                dataSource: [],
                visible: false,
                spin: true,
                editMessage: '',
                tloading: true,
                uploading: false,
                id: 0,
                departmentList: [],
            })
        }
    }

    componentDidMount() {
        this.getdata();
        AsyncPost('/api/v1/cn/edu/ahut/department/listAll', {}, "get", (data) => {
            if (data.code === 0) {
                this.setState({
                    data: this.state.data.update('departmentList', () => data.result)
                });
            }
        })
    }

    componentWillMount(){
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getdata = (callback) => {
        this.setState({
            data: this.state.data.update('tloading', () => true)
        });
        AsyncPost('/api/v1/cn/edu/ahut/record/listRecord', {}, 'post', (data) => {
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
                if(this.mounted){
                    this.setState({
                        data: this.state.data.update('dataSource', () => arr)
                            .update('tloading', () => false)
                    });
                }
                if (callback) {
                    callback()
                }
            }

        })
    };

    //删除User
    deleteUser = (id) => {
        AsyncPost('/api/v1/cn/edu/ahut/record/deleteRecord', {
            id: id
        }, 'delete', (data) => {
            if (data.code === 0) {
                this.setState({
                    //新型改变数据
                    data: this.state.data.update('dataSource', (v) => v.filter((x) => x.id != id))
                });
            }
        })
    };

    //确认框
    showDeleteConfirm = (id) => {
        const self = this;
        confirm({
            title: '删除这个签到信息',
            content: '删除这个签到信息后不可恢复',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                self.deleteUser(id);
            },
            onCancel() {
                message.warning('您取消了删除')
            }
        });
    };

    //显示弹框
    MessageCofrim = (id) => {
        this.setState({
            data: this.state.data.update('spin', () => true)
        }, () => {
            AsyncPost('/api/v1/cn/edu/ahut/record/getRecordById', {
                id: id
            }, 'post', (data) => {
                if (data.code === 0) {
                    this.setState({
                        data: this.state.data.update('visible', () => true)
                            .update('editMessage', () => data.result)
                            .update('spin', () => false)
                    })
                }
            });
        });
    };

    //关闭编辑弹框
    handleMessageOk = () => {
        this.getdata(() => {
            this.setState({
                data: this.state.data.update('visible', () => false)
            })
        });
    };

    //取消编辑
    handleMessageCancel = () => {
        this.setState({
            data: this.state.data.update('visible', () => false)
        })
    };

    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let para = {};
                if( values.userName !== undefined && values.userName !== null && values.userName !== '')
                    para.userName = values.userName;
                if( values.departmentName !== undefined && values.departmentName !== null && values.departmentName !== '')
                    para.departmentName = values.departmentName;
                if( values.arriveTime !== undefined && values.arriveTime !== null)
                    para.arriveTime = values.arriveTime.format('YYYY-MM-DD');
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
                        if(this.mounted){
                            this.setState({
                                data: this.state.data.update('dataSource', () => arr)
                                    .update('tloading', () => false)
                            });
                        }
                    }else{
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
            sorter: (a, b) => b.userCode - a.userCode,
        }, {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
        }, {
            title: '签到时间',
            dataIndex: 'arriveTime',
            key: 'arriveTime',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                  <a href="javascript:void(0)" onClick={this.MessageCofrim.bind(this, record.id)}>
                      编辑信息 <Icon type="edit"/>
                  </a>
                  <Divider type="vertical"/>
                  <a href="javascript:void(0)" onClick={this.showDeleteConfirm.bind(this, record.id)}>
                      删除 <Icon type="delete"/>
                  </a>
                </span>
            )
        }];
        const {getFieldDecorator} = this.props.form;

        return ([
            <h3 key="tittle" className={style.tittle}>记录列表</h3>,
            <Form key="form" onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={4} key={1} style={{ textAlign: 'center',padding: '0 2em' }} >
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{
                                    whitespace: true
                                }],
                            })(
                                <Input placeholder="请输入员工姓名"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4} key={2} style={{ textAlign: 'center',padding: '0 2em' }}>
                        <FormItem>
                            {getFieldDecorator('departmentName', {})(
                                <Select allowClear={true} placeholder="请选择部门">
                                    {
                                        this.state.data.get('departmentList').map((data, index) => {
                                            return (
                                                <Option key={data.id}
                                                        value={data.departmentName}>{data.departmentName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4} key={3} style={{ textAlign: 'center',padding: '0 2em' }}>
                        <FormItem>
                            {getFieldDecorator('arriveTime', {
                                rules: [{ type: 'object'}],
                            })(
                                <DatePicker placeholder='请选择日期' />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3} key={4} style={{ textAlign: 'center' }}>
                        <FormItem>
                            <Button type="primary" htmlType="submit">搜索</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
    ,
        <Table loading={this.state.data.get('tloading')} pagination={{pageSize: 10}} key="table"
               dataSource={this.state.data.get('dataSource')}
               columns={columns}/>
    ,
        <Modal
            visible={this.state.data.get('visible')}
            title="修改签到信息"
            onOk={this.handleMessageOk}
            onCancel={this.handleMessageCancel}
            key='Modal'
            footer={[
                <Button key="back" onClick={this.handleMessageCancel}>取消</Button>,
                <Button key="submit" type="primary" style={{visibility: 'hidden'}}>
                    修改
                </Button>
            ]}
        >
            <Spin tip="Loading..." spinning={this.state.data.get('spin')}>
                <EditRecord editMessage={this.state.data.get('editMessage')}
                            handleMessageOk={this.handleMessageOk}/>
            </Spin>
        </Modal>
    ]
    )

    }
    }

    export default Form.create()(DepartmentList);
