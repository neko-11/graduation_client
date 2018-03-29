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
import style from './UserCenter.scss'
import {Card, Col, Row, Tooltip} from 'antd';
import {AsyncPost} from 'Utils/utils'

const {Meta} = Card;

class UserCenter extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({}),
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
        let id = sessionStorage.getItem("id");
        AsyncPost('/api/v1/cn/edu/ahut/user/getUserById', {
            id: id
        }, 'post', (data) => {
            if (data.code === 0) {
                if (this.mounted) {
                    data.result.role = '普通用户';
                    this.setState({
                        userInfo: data.result
                    })
                }
            }
        });

    }

    render() {
        return (
            <div>
                <h3 key="tittle" className={style.tittle}>个人中心</h3>
                <Row>
                    <Col span={12} key={1}>
                        <Card
                            hoverable
                            style={{width: 240}}
                            cover={<img alt="example"
                                        src={this.state.userInfo.userImg}/>}
                        >
                            <Meta title="用户头像"/>
                        </Card>
                    </Col>
                    <Col span={12} key={2}>
                        <Card hoverable={true} title="用户信息" style={{fontSize: '1.5em', color: '#1DA57A'}}
                              bordered={false} style={{width: 300}}>
                            <p>姓名：{this.state.userInfo.userName}</p>
                            <p>工号：{this.state.userInfo.userCode}</p>
                            <p>部门：{this.state.userInfo.departmentName}</p>
                            <p>权限：{this.state.userInfo.role}</p>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}/>
                    <Col span={4} key={3} style={{textAlign: 'center', fontSize: '1.5em', color: '#1DA57A'}}>
                        <Tooltip placement="topLeft" title="请联系管理员" arrowPointAtCenter>
                            <p>信息错误？</p>
                        </Tooltip>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default UserCenter;

