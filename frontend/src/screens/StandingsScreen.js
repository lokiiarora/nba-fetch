import React from "react";
import { Layout } from "antd";
import NavbarCustom from "../components/Navbar";
import Banner from "../components/Banner";
import StandingsMain from "../components/StandingsMain";
import CustomFooter from "../components/CustomFooter";
import BannerSrc from "../standings-banner.png";
import backgroundWork from "../workers/background.worker";
import { ClimbingBoxLoader } from "react-spinners";

class StandingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.fetchWorker = backgroundWork();
    this.state = {
      loading: true,
      payload: {}
    };
  }

  componentDidMount = () => {
    this.initTasks();
  };

  componentWillUnmount = () => {
    this.fetchWorker.terminate();
  };

  initTasks = () => {
    this.fetchWorker.onmessage = this.workerThreadMessage;
    this.fetchWorker.postMessage({
      message: "fetchStandingsData"
    });
  }
  

  workerThreadMessage = ({data}) => {
    if (data.type) {
        switch (data.type) {
          case "success":
            this.setState(prevState => {
              let old = prevState;
              old.payload = { ...data.payload };
              old.loading = false;
              return Object.assign({}, old);
            });
            break;
          case "error":
            console.log("Error");
            break;
          default:
            break;
        }
      }
  }

  

  renderMainContent() {
    const { loading } = this.state;

    if (!loading) {
      return (
        <div className="holder">
          <Banner src={BannerSrc} positionStyle="center top" />
          <StandingsMain {...this.state.payload} />
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
          <Layout.Content
            className={loading ? "main-layout loading" : "main-layout"}
          >
            <ClimbingBoxLoader color="#000" loading={loading} size={100} />
            {this.renderMainContent()}
            <CustomFooter
              footerStyle={{
                textAlign: "center"
              }}
              show={!loading}
            >
              All of this is made using{" "}
              <a
                href="https://nba.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                NBA.com's
              </a>{" "}
              data that is harvested responsibily. <br /> All rights for this
              data is with the party mentioned above
            </CustomFooter>
          </Layout.Content>
        </Layout>
      </div>
    );
  }
}

export default StandingsScreen;
