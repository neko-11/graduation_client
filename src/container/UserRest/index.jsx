/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React,{Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './StudentRest.scss'
import { Steps, Button, message } from 'antd';
import {Map} from 'immutable'
const Step = Steps.Step;
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'

class StudentRest extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data:Map({
                current:0
            })
        }
    }


    next = ()=>{
        this.setState({ data:this.state.data.update('current',(e)=>e + 1) });
    };

    
    init = ()=>{
        this.setState({ data:this.state.data.update('current',()=> 0) });
    };


    render() {
        const current  = this.state.data.get('current');
        const steps = [{
            title: '填写员工信息',
            content: <StepOne  next = {this.next}/>
        }, {
            title: '上传员工头像',
            content: <StepTwo  next = {this.next} />
        }, {
            title: '注册完成',
            content: <StepThree next = {this.init} />
        }];
        return (
            <div>
                <h3 className={style.tittle}>员工注册</h3>
                <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
            </div>
        )

    }
}


export default StudentRest
