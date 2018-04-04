/**
 * Created by zhushuangfei on 2018/3/22.
 */

import React, {Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './stepThree.scss'
import {Button, Icon} from 'antd';
import {Map} from 'immutable'


class stepThree extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({})
        }
    }

    handleback = () => {
        this.props.next();
    };


    render() {
        return (
            <div className={style.susswrap}>
                <h1 className={style.susstittle}>
                    <Icon type="check-circle" className={style.ico}/> 注册完成
                </h1>
                <Button type="primary" onClick={this.handleback}>再次注册</Button>
            </div>
        )

    }
}


export default stepThree
