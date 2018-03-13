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
import { Card ,Badge ,Avatar , Modal , Spin , Button,Carousel,Icon} from 'antd'
import style from './stepThree.scss'
import { Stage, Layer, Image , Rect} from "react-konva";

class stepThree extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                loading: false,
            })
        }
    }

    //点击头像打开
    Avatar = (listdata,index)=>{
        this.setState({
            data:this.state.data.update(`visible${index}`,()=>true)
        });
        listdata.map((data,index)=>{
            const image = new window.Image();
            image.src = data.url;
            let datajson = data.faceInfo;
            //处理方框数据
            datajson = datajson.replace('[','{');
            datajson = datajson.replace(']','}');
            let jsondata = eval('(' + datajson + ')');
            //图片加载
            image.onload = () => {
                let w = image.width;
                let h = image.height;
                let cheight = 500;
                //比率
                let evall = cheight/h;
                image.width = evall*w;
                image.height = cheight;
                //方框
                let x = Math.round(jsondata.left * evall);
                let y = Math.round(jsondata.top * evall);
                let width = Math.round(evall*(jsondata.right - jsondata.left));
                let height = Math.round(evall*(jsondata.bottom - jsondata.top));
                //画图和规定宽高
                this.setState({
                    data:this.state.data.update(`img${index}`,()=> image)
                        .update(`canvaswidth${index}`,()=> image.width)
                        .update(`rectx${index}`,()=> x)
                        .update(`recty${index}`,()=> y)
                        .update(`rectwidth${index}`,()=> width)
                        .update(`rectheight${index}`,()=> height)
                })
            }
        })
    };



    //关闭弹框
    handleOk = (index) => {
        this.setState({
            data:this.state.data.update(`visible${index}`,()=>false)
        });
    };

    //轮播改变
    onChange = (a)=>{
        console.log(a)
    };

    //下一个
    last = (index)=>{
        this[`slider${index}`].next()
    };

    //上一个
    next = (index)=>{
        this[`slider${index}`].prev()
    };

    render() {
        return (
            <div>
                <Card title="结果列表" bordered={true}>
                    <div>
                        {
                            this.props.data.map((data,index)=>{
                                if (data.studentImg){
                                    return(
                                        <Badge key={`Badge${index}`} count={data.data.length} className={style.blogobox}>
                                            <Avatar onClick={this.Avatar.bind(this,data.data,index)} className={style.userlogobox} src={data.studentImg} shape="square" size="large" icon="user" />
                                        </Badge>
                                    )
                                }else {
                                    return(
                                        <Badge key={`Badge${index}`} count={data.data.length} className={style.blogobox}>
                                            <Avatar onClick={this.Avatar.bind(this,data.data,index)} className={style.userlogobox} shape="square" size="large" icon="user" >{data.studentCode}</Avatar>
                                        </Badge>
                                    )
                                }
                            })

                        }
                        {
                            this.props.data.map((data,cindex)=>{
                                return (
                                    <div className={(this.state.data.get(`visible${cindex}`)?'':style.none)+ ' ' + style.modalbg}  key={`modaldiv${cindex}`} >
                                        <div className={style.modaldiv}>
                                            <div className={style.tittle}>查看图片</div>
                                            <div className={style.body}>
                                                {
                                                    data.data.length > 1 ?
                                                        <div className={style.carbox}>
                                                            <Carousel nextArrow={<div>next</div>} ref={c => this[`slider${cindex}`] = c }   afterChange={this.onChange}>
                                                                {
                                                                    data.data.map((data,index)=>{
                                                                        return(
                                                                            <div key={`canveas${index}`} className={style.canvasWrap}>
                                                                                <div className={style.inlinebox}>
                                                                                    <Stage width={this.state.data.get(`canvaswidth${index}`)} height={500} >
                                                                                        <Layer>
                                                                                            <Image x={0} y={0} image={this.state.data.get(`img${index}`)}></Image>
                                                                                            <Rect
                                                                                                x={this.state.data.get(`rectx${index}`)}
                                                                                                y={this.state.data.get(`recty${index}`)}
                                                                                                width={this.state.data.get(`rectwidth${index}`)}
                                                                                                height={this.state.data.get(`rectheight${index}`)}
                                                                                                stroke='#1da57a'
                                                                                            />
                                                                                        </Layer>
                                                                                    </Stage>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </Carousel>
                                                            <Button onClick={this.last.bind(this,cindex)} className={style.carbtn+ ' ' + style.leftbtn}><Icon type="left" /></Button>
                                                            <Button onClick={this.next.bind(this,cindex)} className={style.carbtn+ ' ' + style.rightbtn}><Icon type="right" /></Button>
                                                        </div>
                                                        :
                                                        <div key={`canveas${0}`} className={style.canvasWrap}>
                                                            <div className={style.inlinebox}>
                                                                <Stage width={this.state.data.get(`canvaswidth${0}`)} height={500} >
                                                                    <Layer>
                                                                        <Image x={0} y={0} image={this.state.data.get(`img${0}`)}></Image>
                                                                        <Rect
                                                                            x={this.state.data.get(`rectx${0}`)}
                                                                            y={this.state.data.get(`recty${0}`)}
                                                                            width={this.state.data.get(`rectwidth${0}`)}
                                                                            height={this.state.data.get(`rectheight${0}`)}
                                                                            stroke='#1da57a'
                                                                        />
                                                                    </Layer>
                                                                </Stage>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                            <div className={style.footer}>
                                                <Button type="primary"  onClick={this.handleOk.bind(this,cindex)}>确定</Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={style.btnbox}>
                        <Button type="primary" onClick={this.props.init}>重新上传图片</Button>
                    </div>
                </Card>
                {/*  */}
            </div>
        )

    }
}


export default stepThree
