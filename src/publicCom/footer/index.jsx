import React from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import { Layout } from 'antd'
const { Footer } = Layout;

class Foot extends BaseComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>
                安徽工业大学 ©2018 Created by Zhushuangfei
            </Footer>
        )

    }
}


export default Foot
