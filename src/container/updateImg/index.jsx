/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React from 'react';
import {Map} from 'immutable';
import { Icon ,Steps ,Button ,Form, Select,message} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import style from './updateImg.scss'
import BaseComponent from 'Utils/BaseComponent.jsx'
import { AsyncPost } from 'Utils/utils'
const Step = Steps.Step;
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
class updateImg extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                active:false,
                current:0,
                taskId:0,
                schoolList:[],
                classList:[],
                classId:0,
                imgList:false,
                finish:false,
                resultData:[]
            })
        }
    }

    //组件加载
    componentDidMount(){
        this.getInit()
    }
    
    //初始化数据
    getInit = ()=>{
        AsyncPost('/api/v1/education/Task/getErrorTask',{},"get",(data)=>{
            if (data.code === 1){
                this.setState({
                    data:this.state.data.update('active',()=>true)
                });
                //获取学校列表
                AsyncPost('/api/v1/education/SchoolInfo/getAllSchool',{},'get',(data)=>{
                    if (data.code === 0){
                        this.setState({
                            data:this.state.data.update('schoolList',()=>data.result)
                        });
                    }
                })
            }else{
                this.setState({
                    data:this.state.data.update('active',()=>false)
                        .update('taskId',()=>data.taskId)
                        .update('classId',()=>data.classId)
                        .update('imgList',()=>data.images)
                })
            }

        })
    }

    //改变学校
    changeSchool = (val)=>{
        AsyncPost('/api/v1/education/ClassInfo/getClassBySchoolId',{
            schoolId : val*1
        },"get",(data)=>{
            if (data.code === 0){
                this.setState({
                    data:this.state.data.update('classList',()=>data.result)
                });
            }
        });
    };

    //添加
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                AsyncPost('/api/v1/education/Task/addTask',{
                    classId: values.selectClass
                },"post",(data)=>{
                    if (data.code == 0){

                        this.setState({
                            data:this.state.data.update('active',()=>false)
                                .update('taskId',()=>data.taskId)
                                .update('classId',()=>values.selectClass)
                                .update('imgList',()=>[])
                        })
                    }
                });
            }
        });
    };

    //开始查看
    sawAll = (v)=>{
        this.setState({
            data:this.state.data.update('finish',()=> false)
                .update('current',(v)=>v+1)
        },()=>{
            AsyncPost('/api/v1/education/Task/recognizeFaces',{
                taskId : this.state.data.get('taskId'),
                classId: this.state.data.get('classId'),
                threshold: v*1
            },"post",(data)=>{
                if (data.code === 0){
                    this.setState({
                        data:this.state.data.update('finish',()=> true)
                            .update('resultData',()=>data.result)
                            .update('error',()=> false)
                    });
                    setTimeout(()=>{
                        this.setState({
                            data:this.state.data.update('current',(v)=>v+1)
                        })
                    },3000)
                }else if (data.code === 1){
                        this.setState({
                            data:this.state.data.update('error',()=> true)
                        })
                }
            });
        });
    };


    //下一个
    next = ()=>{
        this.setState({
            data:this.state.data.update('current',(v)=>v+1)
        })
    };

    //还原
    init = ()=>{
        this.getInit();
        this.setState({
            data:this.state.data.update('current',(v)=>0)
        })
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        const current = this.state.data.get('current');
        const steps = [{
            title: '批量上传图片',
            content: this.state.data.get('imgList') ?
                <div className={style.imgbox}>
                    <StepOne imgList={this.state.data.get('imgList')} sawAll={this.sawAll} classId={this.state.data.get('classId')} taskId={this.state.data.get('taskId')} />
                </div>    
                :
                ''
        }, {
            title: '等待解析结果',
            content:<div className={style.imgbox}>
                        <StepTwo error={this.state.data.get('error')}  init = {this.init} finish = {this.state.data.get('finish')}/>
                    </div>,
        }, {
            title: '结果展示',
            content: <div className={style.imgbox}>
                <StepThree data={this.state.data.get('resultData')} init = {this.init}/>
            </div>,
        }];
        return (
            <div>
                <h3 key="tittle" className={style.tittle}>上传图片</h3>
                {
                    this.state.data.get('active')?
                    <Form onSubmit={this.handleSubmit}  className={style.from_box}>
                        <FormItem
                            {...formItemLayout}
                            label="选择学校"
                        >
                            {getFieldDecorator('selectSchool', {
                                rules: [
                                    { required: true, message: '请选择您的学校 !' },
                                ],
                            })(
                                <Select placeholder="请选择您的学校" onChange={this.changeSchool} >
                                    {
                                        this.state.data.get('schoolList').map((data,index)=>{
                                            return(
                                                <Option key={data.id} value={data.id}>{data.schoolName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="选择班级"
                        >
                            {getFieldDecorator('selectClass', {
                                rules: [
                                    { required: true, message: '请选择您的班级 !'}
                                ],
                            })(
                                <Select placeholder="请选择您的班级">
                                    {
                                        this.state.data.get('classList').map((data,index)=>{
                                            return(
                                                <Option key={'class'+index} value={data.id}>{data.className}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={style.add}>
                            <Button type="primary"  htmlType="submit">确定</Button>
                        </FormItem>
                    </Form>
                        :
                    <div>
                        <Steps current={current}>
                            {steps.map(item => <Step key={item.title} title={item.title} />)}
                        </Steps>
                        <div className="steps-content">{steps[this.state.data.get('current')].content}</div>
                    </div>
                }
            </div>
        )

    }
}


const WrappedDemo = Form.create()(updateImg);

export default WrappedDemo
