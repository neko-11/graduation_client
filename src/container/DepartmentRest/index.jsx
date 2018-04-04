/**
 * Created by zhushuangfei on 2018/3/22.
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

