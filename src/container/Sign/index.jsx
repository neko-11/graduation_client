import React, {Component} from 'react'
//引入login的头部
//import LoginHeader from 'PubComponents/loginHeader'
import {Button, Col, Form, Row} from 'antd';
import {Link, withRouter} from 'react-router-dom'
import {Map} from 'immutable';
//引入组件sass
import {ajax_method} from 'Utils/utils';
import style from './sign.scss'
//引用，不要签名的发起请求方式，写入cookie的util，还有需要签名的请求
//import { NotSigAsyncPost , fExportSetCookieMes ,AsyncPost} from 'Utils/utils';
//粒子动画库
import 'particles.js'

const FormItem = Form.Item;


class Sign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                //防止重复提交的flag
                loginflag: false,
            })
        };
    }

    componentDidMount() {
        let video = document.getElementById('video');
        let vendorUrl = window.URL || window.webkitURL;

        //媒体对象
        navigator.getMedia = navigator.getUserMedia ||
            navagator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
        navigator.getMedia({
            video: true, //使用摄像头对象
            audio: false  //不使用音频
        }, function (strem) {
            //console.log(strem);
            video.src = vendorUrl.createObjectURL(strem);
            video.play();
        }, function (error) {
            //error.code
            console.log(error);
        });

        //粒子运动动画
        this.particlesConfig();
    }

    //粒子运动配置
    particlesConfig = () => {
        /* ---- particles.js config ---- */
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#d7d9da"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 0.2,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 15,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 20,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#d7d9da",
                    "opacity": 0.8,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });

    };

    //提交签到信息
    saveImg = () => {
        let canvas = document.getElementById('canvas');
        let img = document.getElementById('img');
        //绘制canvas图形
        canvas.getContext('2d').drawImage(video, 0, 0, 400, 300);

        let formData = new URLSearchParams();
        formData.append("image", canvas.toDataURL("image/png"));
        ajax_method('/api/v1/cn/edu/ahut/record/saveRecord', formData, 'POST', (data) => {
            data = JSON.parse(data);
            console.log(data);
            if (data.code === 0) {

            } else if (data.code === 1) {

            }
        });
    };

    render() {
        return (
            <div className={style.big_wrap}>
                <Button onClick={() => {
                    this.props.history.replace('/login')
                }}>我是管理员</Button>
                <div className={style.login_wrap}>
                    <Row type="flex" className={style.row}>
                        <Col xs={2} sm={6} md={9} className={style.flexbox}></Col>
                        <Col xs={20} sm={12} md={6} className={style.flexbox}>
                            <div className={style.components_form_login}>
                                <div className={style.img_wrap}>
                                    <img src={require('./img/logo.png')} className={style.img_width}/>
                                </div>
                                <video id="video" width="400" height="300"></video>
                                <Button onClick={this.saveImg}>拍照</Button>
                                <canvas id='canvas' width='400' height='300'></canvas>
                            </div>
                        </Col>
                        <Col xs={2} sm={6} md={9} className={style.flexbox}></Col>
                    </Row>
                </div>
                {/*粒子动画容器*/}
                <div id="particles-js" className={style.particles}></div>
            </div>
        )
    }
}

const WrappedNormalLoginForm1 = Form.create()(Sign);

export default withRouter(WrappedNormalLoginForm1);