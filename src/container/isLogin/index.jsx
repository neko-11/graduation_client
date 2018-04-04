/**
 * Created by zhushuangfei on 2018/3/22.
 */

import React from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './isLogin.scss'
import {Spin} from 'antd';

class isLogin extends BaseComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (sessionStorage.getItem("userName") && sessionStorage.getItem("role") === 'admin') {
            this.props.history.replace('/home/RecordList')
        } else if (sessionStorage.getItem("userName") && sessionStorage.getItem("role") === 'user') {
            this.props.history.replace('/home/UserCenter')
        } else {
            this.props.history.replace('/login')
        }

    }


    render() {
        return (
            <div className={style.spinbig_wrap}>
                <Spin tip="Loading...">
                </Spin>
            </div>

        )

    }
}


export default isLogin
