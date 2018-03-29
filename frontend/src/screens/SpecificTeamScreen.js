import React from "react";
import { Layout } from "antd";
import Banner from "../components/Banner";
import CustomFooter from "../components/CustomFooter";
import tagManager from "../workers/tag.worker";
import BannerSrc from "../team-banner.png";
import { ClimbingBoxLoader } from "react-spinners";
import NavbarCustom from "../components/Navbar";

class SpecificTeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.tagManager = tagManager();
    this.state = {
      loading: true,
      payload: {
        metaData: {},
        roster: []
      }
    };
  }

  componentDidMount = () => {
    this.initTasks();
  };

  initTasks = () => {
    this.tagManager.onmessage = this.threadMessage;
    const { teamID } = this.props.match.params;
    this.tagManager.postMessage({
      type: "getTeamDataAndRoster",
      payload: {
        player: JSON.parse(window.localStorage.getItem("player")),
        id: teamID
      }
    });
  };

  threadMessage = ({ data }) => {
    if (data.type) {
      switch (data.type) {
        case "success":
          this.setState(prevState => {
            let old = prevState;
            old.payload = data.payload;
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
  };

  renderMainContent = () => {
    const { loading } = this.state;

    if (!loading) {
      return (
        <div className="holder">
          <Banner src={BannerSrc} />
        </div>
      );
    }

    return null;
  };

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

export default SpecificTeamScreen;
