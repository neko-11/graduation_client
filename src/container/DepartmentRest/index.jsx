/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React, {Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import {Map} from 'immutable';
import style from './DepartmentRest.scss'
import FormDepartment from './FormDepartment/index.jsx'


class DepartmentRest extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({})
        }
    }


    render() {
        return (
            <div>
                <h3 key="tittle" className={style.tittle}>添加部门</h3>
                <FormDepartment/>
            </div>
        )
    }
}

export default DepartmentRest;

