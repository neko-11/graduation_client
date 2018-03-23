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
                安徽工业大学 息141 ©2018 Created by 朱双飞
            </Footer>
        )

    }
}


export default Foot
