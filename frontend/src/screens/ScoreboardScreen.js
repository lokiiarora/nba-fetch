import React from 'react';
import {
    Layout
} from 'antd';
import NavbarCustom from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import BannerSrc from '../scores-banner.png';
import Banner from "../components/Banner";
import {ClimbingBoxLoader} from 'react-spinners';


class ScoreboardScreen extends React.Component {

    state = {
        loading: true
    }


    componentDidMount() {
        setTimeout(() => {
            this.setState(prevState => ({
                loading: false
            }))
        }, 1000);
    }

    renderMainContent() {
        let { loading } = this.state;

        if(!loading){
            return (
                <div className="holder">
                    <Banner src={BannerSrc} positionStyle="center center" />
                </div>
            );
        }
        
        return null;
    }

    render() {
        const { loading } = this.state;
        return (
            <div className="homeScreen">
                <Layout className="main-layout">
                    <Layout.Header>
                        <NavbarCustom className="nav-menu" {...this.props} />
                    </Layout.Header>
                    <Layout.Content className={(loading)? "main-layout loading": "main-layout"}>
                        <ClimbingBoxLoader color="#000" loading={loading} size={100} />
                        {this.renderMainContent()}
                        <CustomFooter footerStyle={{
                            textAlign:'center'
                        }} show={!loading}>
                            All of this is made using <a href="https://nba.com/" target="_blank" rel="noopener noreferrer">NBA.com's</a> data that is harvested responsibily. <br/> All rights for this data is with the party mentioned above
                        </CustomFooter>
                    </Layout.Content>
                </Layout>
            </div>
        );
    }
}


export default ScoreboardScreen;