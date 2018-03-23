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
import {Table,Icon ,Divider,Modal,message ,Button,Spin,Upload} from 'antd'
const confirm = Modal.confirm;
import { AsyncPost} from 'Utils/utils'
import style from './studentList.scss'
import EditStudent from './EditStudent/index.jsx'
import * as apiConfig from 'Utils/apiConfig'
class studentList extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                dataSource:[],
                visible:false,
                spin:true,
                editMessage:'',
                tloading:true,
                showLogo:false,
                uploading:false,
                companyseal:"",
                finish:false,
                studentId:0
            })
        }
    }

    componentDidMount(){
       this.getdata()
    }


    getdata = (callback)=>{
        this.setState({
            data:this.state.data.update('tloading',()=>true)
        });
        AsyncPost('/api/v1/education/StudentInfo/getAllStudent',{},'get',(data)=>{
            if(data.code === 0){
                let arr = [];
                data.result.map((data,index)=>{
                    arr.push({
                        key: index,
                        name: data.studentName,
                        userId: data.studentCode,
                        schoolId: data.schoolName,
                        logo: data.studentImg,
                        classId:data.className,
                        dataId: data.id
                    })
                });
                this.setState({
                    data:this.state.data.update('dataSource',()=>arr)
                        .update('tloading',()=>false)
                });
                if (callback){
                    callback()
                }
            }

        })
    }

    //删除student
    deleteStudent = (id)=>{
        AsyncPost('/api/v1/education/StudentInfo/deleteStudent',{
            id
        },'delete',(data)=>{
            if (data.code === 0){
                this.setState({
                    data:this.state.data.update('dataSource',(v)=>v.filter((x)=> x.dataId != id ))
                });
            }
        })
    };

    //确认框
    showDeleteConfirm = (studentId)=> {
        const self = this;
        confirm({
            title: '删除这个学生',
            content: '删除这个学生后不可恢复.',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                self.deleteStudent(studentId);
            },
            onCancel() {
                message.warning('您取消了删除')
            }
        });
    };

    //显示弹框
    MessageCofrim = (id)=>{
        this.setState({
            data:this.state.data.update('spin',()=>true)
        },()=>{
            AsyncPost('/api/v1/education/StudentInfo/getOneStudent',{
                id
            },'post',(data)=>{
                if (data.code === 0){
                    this.setState({
                        data:this.state.data.update('visible',()=>true)
                            .update('editMessage',()=> data.result)
                            .update('spin',()=>false)
                    })
                }
            });
        });
    };

    //关闭编辑弹框
    handleMessageOk = () => {
        this.getdata(()=>{
            this.setState({
                data:this.state.data.update('visible',()=>false)
            })
        });
    };

    //取消编辑
    handleMessageCancel = () => {
        this.setState({
            data:this.state.data.update('visible',()=>false)
        })
    };


    //图片的弹框相关
    handleImageOk = ()=>{
        if(this.state.data.get('finish')){
            this.getdata(()=>{
                this.setState({
                    data:this.state.data.update('showLogo',()=>false)
                })
            });
        }else{
            message.error('等待图片上传完成')
        }
    };

    //关闭图片弹框
    handleImageCancel = ()=>{
        this.setState({
            data:this.state.data.update('showLogo',()=>false)
        })
    };

    //显示前图片
    ImgeCofrim = (val)=>{
        this.state.data.get('dataSource').map((data,index)=>{
           if (val == data.dataId){
               this.setState({
                   data:this.state.data.update('companyseal',()=> data.logo)
                       .update('showLogo',()=>true)
                       .update('studentId',()=>val)
               })
           }
        });
    };


    //图片上传验证
    beforeUpload = (file)=> {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png'  || file.type === 'image/webp');
        if (!isJPG) {
            message.error('你只能上传JPG或者png文件或者webp!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isJPG && isLt2M;
    };

    //预览图片的
    getBase64 = (img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    //图片上传状态监控
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({
                data:this.state.data.update('uploading',()=>true)
                    .update('companyseal',()=>'')
                    .update('finish',()=>false)
            });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                data:this.state.data.update('companyseal',()=>imageUrl)
                    .update('uploading',()=> false)
                    .update('finish',()=>true)

            }));
        }
        if (info.file.status === 'error') {
            message.error('对不起上传失败，请检查图片类型或服务器错误!');
            this.setState({
                data: this.state.data.update('uploading', ()=> false)
                    .update('companyseal',()=>'')
                    .update('finish',()=>false)
            })
        }
    };


    render() {

        const uploadButton = (
            <div>
                <Icon type={this.state.data.get('uploading') ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );


        const columns = [{
            title: '头像',
            dataIndex: 'logo',
            key: 'logo',
            render: (text,record) => {
                if (!text){
                    return(
                        <div className = {style.logoDiv}>{record.name.substring(0,1)}</div>
                    )
                }else{
                    return(
                        <img height="40px" src={text} className={style.logoImg} width="40px" />
                    )
                }
            },
        },{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '学号',
            dataIndex: 'userId',
            key: 'userId',
        }, {
            title: '学校',
            dataIndex: 'schoolId',
            key: 'schoolId',
        }, {
            title: '班级',
            dataIndex: 'classId',
            key: 'classId',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                  <a href="javascript:void(0)" onClick={this.MessageCofrim.bind(this,record.dataId)}>
                      编辑信息 <Icon type="edit" />
                  </a>
                  <Divider type="vertical"/>
                  <a href="javascript:void(0)"  onClick={this.ImgeCofrim.bind(this,record.dataId)} >
                      修改头像 <Icon type="smile-o"/>
                  </a>
                  <Divider type="vertical" />
                  <a href="javascript:void(0)" onClick={this.showDeleteConfirm.bind(this,record.dataId)}>
                      删除 <Icon type="delete" />
                  </a>
                </span>
            )
        }];




        return ([
            <h3 key="tittle" className={style.tittle}>学生列表</h3>,
            <Table loading={this.state.data.get('tloading')}  key="table" dataSource={this.state.data.get('dataSource')} columns={columns} />,
            <Modal
                visible={this.state.data.get('visible')}
                title="修改学生信息"
                onOk={this.handleMessageOk}
                onCancel={this.handleMessageCancel}
                key = 'Modal'
                footer={[
                    <Button key="back" onClick={this.handleMessageCancel}>取消</Button>,
                    <Button key="submit" type="primary" style={{visibility:'hidden'}}>
                      修改
                    </Button>
                  ]}
            >
                <Spin tip="Loading..." spinning = {this.state.data.get('spin')}>
                    <EditStudent editMessage = {this.state.data.get('editMessage')} handleMessageOk = {this.handleMessageOk}/>
                </Spin>
            </Modal>,
            <Modal
                title="修改头像"
                visible={this.state.data.get('showLogo')}
                onOk={this.handleImageOk}
                onCancel={this.handleImageCancel}
                footer={[
                    <Button key="back" onClick={this.handleImageOk}>确定</Button>,
                  ]}
                key = 'lmod'
                className={style.imgbox}
            >
                <Upload
                    name="studentImg"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={`${apiConfig.HOST}/api/v1/education/StudentInfo/updateImg`}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    data = {{
                        studentId:this.state.data.get('studentId')
                    }}
                    
                >
                    {
                        this.state.data.get('companyseal') ?
                            <img width="284" height="284" src={this.state.data.get('companyseal')} alt="" /> :
                            uploadButton
                    }
                </Upload>
            </Modal>
        ])

    }
}


export default studentList
