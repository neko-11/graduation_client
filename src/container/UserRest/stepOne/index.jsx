/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React,{Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './stepOne.scss'
import {Form, Select,Input, Button, Upload, Icon,message} from 'antd';
import {Map} from 'immutable'
const FormItem = Form.Item;
const Option = Select.Option;
import { AsyncPost} from 'Utils/utils'
import { change } from 'RAndA/StudentId'
import { connect } from 'react-redux';

class stepOne extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data:Map({
                schoolList:[],
                classList:[],
            })
        }
    }


    componentDidMount(){
        AsyncPost('/api/v1/education/SchoolInfo/getAllSchool',{},"get",(data)=>{
            if (data.code === 0){
                this.setState({
                    data:this.state.data.update('schoolList',()=>data.result)
                });
            }
        })
    }

    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                AsyncPost('/api/v1/education/StudentInfo/addStudent',{
                    studentName: values.userName,
                    studentCode: values.userId,
                    classId:values.selectClass
                },'post' ,(data)=>{
                    this.props.dispatch(change(data.studentId));
                    this.props.next()
                });
            }
        });
    };

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
        return (
            <div>
                <div className={style.from_box}>
                    <Form onSubmit={this.handleSubmit}>
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
                        <FormItem {...formItemLayout} label="学生姓名">
                            {getFieldDecorator('userName', {
                                rules: [{
                                    required: true,
                                    message: '请输入学生姓名',
                                    whitespace: true
                                }],
                            })(
                                <Input placeholder="请输入学生姓名" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="学生编号">
                            {getFieldDecorator('userId', {
                                rules: [{
                                    required: true,
                                    message: '请输入学号',
                                    whitespace: true
                                }]
                            })(
                                <Input placeholder="请输入学号" />
                            )}
                        </FormItem>

                        <FormItem className={style.submitbtnBox}>
                            <Button type="primary"  htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )

    }
}

const WrappedDemo = Form.create()(stepOne);



export default connect(() => {
    return {}
})(WrappedDemo)
