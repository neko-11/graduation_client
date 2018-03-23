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
import {Form,Input, Icon,message,Button} from 'antd';
const FormItem = Form.Item;
import style from './EditStudent.scss'
import { AsyncPost} from 'Utils/utils'

class EditStudent extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.editMessage.id != nextProps.editMessage.id){
            this.initFrom(nextProps.editMessage)
        }
    }


    componentDidMount(){
        this.initFrom(this.props.editMessage)
    }

    initFrom = (editMessage)=>{
        this.props.form.setFieldsValue(
            {schoolName: editMessage.schoolName || '暂无'},
        );
        this.props.form.setFieldsValue(
            {className:  editMessage.className || '暂无'},
        );
        this.props.form.setFieldsValue(
            {userName:editMessage.studentName || '暂无'},
        );
        this.props.form.setFieldsValue(
            {userId: editMessage.studentCode || '暂无'}
        );
    };

    //提交
    handlesubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                AsyncPost('/api/v1/education/StudentInfo/updateStudent',{
                    id:this.props.editMessage.id,
                    studentName:values.userName,
                    studentCode:values.userId,
                    classId:this.props.editMessage.classId
                }, "post" ,(data)=>{
                    if (data.code === 0 ){
                        this.props.handleMessageOk();
                    }
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };
        return (
            <Form onSubmit={this.handlesubmit} className={style.from_box}>
                <FormItem
                    {...formItemLayout}
                    label="学校"
                >
                    {getFieldDecorator('schoolName')(
                        <Input placeholder="学校" disabled/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="班级"
                >
                    {getFieldDecorator('className')(
                        <Input placeholder="班级" disabled/>
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
                <FormItem >
                    <Button type="primary"  htmlType="submit" className={style.submitbtn}>提交</Button>
                </FormItem>
            </Form>
        )

    }
}

export default Form.create()(EditStudent);
