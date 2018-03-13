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
import { Progress ,Button} from 'antd';
import style from './stepTwo.scss'
class Home1 extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                percentnum:0,
                flag:true
            })
        }
        this.interval = null
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.finish) {
            clearInterval(this.interval);
            this.setState({
                data: this.state.data.update('percentnum', ()=>100)
            })
        }
        if (nextProps.error){
            clearInterval(this.interval);
            this.setState({
                data:this.state.data.update('flag', ()=>false)
            })
        }
    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            if (this.state.data.get('percentnum') >= 99){
                clearInterval(this.interval)
            }else{
                this.setState({
                    data:this.state.data.update('percentnum',(v)=>v+1)
                })
            }
        },1000);
        
        if (this.props.error){
            clearInterval(this.interval);
            this.setState({
                data:this.state.data.update('flag', ()=>false)
            })
        }

    }

    componentWillUnmount (){
        clearInterval(this.interval)
    }

    render() {
        return (
            <div className = {style.Progress}>
                <Progress type="circle" percent={this.state.data.get('percentnum')} status={this.state.data.get('flag')?"active":"exception"} />
                {
                    <p className={style.loading}>
                        {
                            this.props.error?
                                <span style={{color:'red'}}>失败</span>
                                :
                                (this.props.finish? '完成，即将跳转...' : '等待...')
                        }
                    </p>
                }
                {
                    this.props.error?
                        <div className={style.btnbox}>
                            <Button type="primary" onClick={this.props.init}>重新上传图片</Button>
                        </div>
                        :
                        null
                }
            </div>
        )

    }
}


export default Home1
