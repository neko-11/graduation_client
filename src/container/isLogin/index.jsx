/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './isLogin.scss'
import { Spin } from 'antd';

class isLogin extends BaseComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        if (sessionStorage.getItem("userName") && sessionStorage.getItem("role") === 'admin'){
            this.props.history.replace('/home/RecordList')
        }else if(sessionStorage.getItem("userName") && sessionStorage.getItem("role") === 'user'){
            this.props.history.replace('/home/UserCenter')
        }else{
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
