/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import { Upload, Button, Icon ,message ,Select,Row,Col} from 'antd';
const Option = Select.Option;
import {Map} from 'immutable';
import style from './stepOne.scss'
import * as apiConfig from 'Utils/apiConfig'
class StepOne extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                fileListlength: 0,
                threshold: 0.5
            })
        }
    }

    componentDidMount(){
        this.setState({
            data:this.state.data.update('fileListlength',()=>this.props.imgList.length)
        })
    }

    //图片上传验证
    beforeUpload = (file)=> {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp');
        if (!isJPG) {
            message.error('你只能上传JPG或者png或者webp文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isJPG && isLt2M;
    };


    //图片上传
    handleChange = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                data:this.state.data.update('fileListlength',()=>info.fileList.length)
            });
        }
    };


    selecthandleChange = (v)=>{
        this.setState({
            data:this.state.data.update('threshold',()=>v)
        })
    };

    render() {
        let fileList = [];
        this.props.imgList.map((data,index)=>{
            fileList.push({
                uid: index,
                name: Object.keys(data)[0],
                status: 'done',
                url: data[Object.keys(data)[0]],
                thumbUrl: data[Object.keys(data)[0]]
            })
        });

        const props = {
            listType: 'picture',
            name:"image",
            multiple:true,
            action:`${apiConfig.HOST}/api/v1/education/Image/saveImage`,
            data: {
                classId:this.props.classId,
                taskId:this.props.taskId
            }
        };

        let arr = [];
        for (let i = 1; i<10 ;i++){
                arr.push(i/10)
        }

        return (
            <div className={style.uploadbox}>
                {
                    this.state.data.get('fileListlength')*1>0?
                        [
                            <div className={style.selectBox}>
                                <Row>
                                    <Col span={3}>
                                        <p className={style.selectLable}>
                                            域值 :
                                        </p>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={20} >
                                        <Select className={style.selectWrap} defaultValue={this.state.data.get('threshold')} onChange={this.selecthandleChange}>
                                            {
                                                arr.map((data,index)=>{
                                                    return(
                                                        <Option key={'Option'+index} value={data}>{data}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                            ,
                            <Button size="large" type="primary" onClick={()=>this.props.sawAll(this.state.data.get('threshold'))} className={style.updatebtn}>
                                <Icon type="eye" /> 识别
                            </Button>
                        ]
                        :
                        null
                }
                <Upload {...props}
                    beforeUpload={this.beforeUpload}
                    defaultFileList = {fileList}
                    onChange={this.handleChange}
                >
                    <Button size="large" type="primary" className={style.updatebtn}>
                        <Icon type="upload" /> 上传(按住 ctrl 可选择多个文件)
                    </Button>
                </Upload>
            </div>
        )

    }
}


export default StepOne
