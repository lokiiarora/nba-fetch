import React from 'react';
import {
    Layout
} from 'antd';

class CustomFooter extends React.Component {
    render() {
        const {show, footerStyle, children} = this.props;
        return (
            show ?  <Layout.Footer style={footerStyle}>
            {children}
        </Layout.Footer> : null
        );
    }
}

export default CustomFooter;