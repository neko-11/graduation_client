/**
 * Created by zhushuangfei on 2018/3/22.
 */

import React from 'react';
import {Map} from 'immutable';
import BaseComponent from 'Utils/BaseComponent.jsx'
import {Button, Divider, Icon, message, Modal, Spin, Table} from 'antd'
import {AsyncPost} from 'Utils/utils'
import style from './DepartmentList.scss'
import EditDepartment from './EditDepartment/index.jsx'

const confirm = Modal.confirm;

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
                id: 0
            })
        }
    }

    componentDidMount() {
        this.getdata()
    }

    //防止setState发生在组建移除之后
    componentWillMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getdata = (callback) => {
        this.setState({
            data: this.state.data.update('tloading', () => true)
        });
        AsyncPost('/api/v1/cn/edu/ahut/department/listAll', {}, 'get', (data) => {
            if (data.code === 0 && this.mounted) {
                let arr = [];
                data.result.map((data, index) => {
                    arr.push({
                        key: index,
                        id: data.id,
                        index: index + 1,
                        departmentCode: data.departmentCode,
                        departmentName: data.departmentName,
                    })
                });
                this.setState({
                    data: this.state.data.update('dataSource', () => arr)
                        .update('tloading', () => false)
                });
                if (callback) {
                    callback()
                }
            }

        })
    };

    //删除部门
    deleteUser = (id) => {
        AsyncPost('/api/v1/cn/edu/ahut/department/deleteDepartment', {
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
            title: '删除这个部门信息',
            content: '删除这个部门信息后不可恢复.',
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
            AsyncPost('/api/v1/cn/edu/ahut/department/getDepartmentById', {
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

    render() {

        const columns = [{
            title: '',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
        }, {
            title: '部门编号',
            dataIndex: 'departmentCode',
            key: 'departmentCode',
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


        return ([
            <h3 key="tittle" className={style.tittle}>部门列表</h3>,
            <Table loading={this.state.data.get('tloading')} pagination={{pageSize: 11}} key="table"
                   dataSource={this.state.data.get('dataSource')}
                   columns={columns}/>,
            <Modal
                visible={this.state.data.get('visible')}
                title="修改部门信息"
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
                    <EditDepartment editMessage={this.state.data.get('editMessage')}
                                    handleMessageOk={this.handleMessageOk}/>
                </Spin>
            </Modal>
        ])

    }
}

export default DepartmentList;
