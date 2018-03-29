import React from "react";
import { Layout, Row, Col, Avatar } from "antd";
import {Link} from 'react-router-dom';
import Banner from "../components/Banner";
import CustomFooter from "../components/CustomFooter";
import BannerSrc from "../team-banner.png";
import { ClimbingBoxLoader } from "react-spinners";
import tagManager from "../workers/tag.worker";
import NavbarCustom from "../components/Navbar";

class TeamsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.tagManager = tagManager();
    this.state = {
      loading: true,
      teamData: []
    };
  }

  componentDidMount = () => {
    this.initTasks();
  };

  initTasks = () => {
    this.tagManager.onmessage = this.threadMessage;
    this.tagManager.postMessage({
      type: "tagForTeams",
      payload: {
        player: JSON.parse(window.localStorage.getItem("player"))
      }
    });
  };

  threadMessage = ({ data }) => {
    if (data.type) {
      switch (data.type) {
        case "success":
          this.setState(prevState => {
            let old = prevState;
            old.teamData = data.payload;
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

  componentWillUnmount = () => this.tagManager.terminate();

  renderMainContent = () => {
    const { loading, teamData } = this.state;

    if (!loading) {
      return (
        <div className="holder">
          <Banner src={BannerSrc} />
          <div className="teams-main-content">
            <Row className="header-row-standings">Browse all 30 teams</Row>
            <Row gutter={40} className="content-row-standings">
              {teamData.map((item, index) => {
                return (
                  <Col span={4} className="avatar-div" key={`Standings-${index}`}>
                    <Link to={`/team/${item}`}>
                        <Avatar
                        size="large"
                        className="large-avatar-teamPage"
                        src={`https://cdn.nba.net/assets/logos/teams/secondary/web/${item}.svg`}
                        />
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>
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

export default TeamsScreen;
