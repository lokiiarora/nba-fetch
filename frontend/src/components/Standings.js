import React from "react";
import { Row, Button } from "antd";
import StandingsAdapter from './StandingAdapter';
import { Link } from "react-router-dom";
import tagManager from "../workers/tag.worker";

class StandingsHomeFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      payload: {
        conf: {
          east: [],
          west: []
        },
        div: {
          east: {
            atlantic: [],
            central: [],
            southeast: []
          },
          west: {
            northwest: [],
            pacific: [],
            southwest: []
          }
        }
      }
    };
    this.tagThread = tagManager();
  }

  componentDidMount = () => {
    this.tagThread.onmessage = this.tagonMessage;
    this.initTasks();
  };

  initTasks = () => {
    const {conf, div} = this.props
    this.tagData({conf,div});
  };

  tagData = obj => {
    this.tagThread.postMessage({
      data: {
        player: JSON.parse(window.localStorage.getItem("player")),
        ...obj
      }
    });
  };

  tagonMessage = ({ data }) => {
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
        console.log(data.payload);
        break;
      default:
        break;
    }
  };

  componentWillUnmount = () => this.tagThread.terminate();

  goToStandingsPage = () => this.props.history.push("/standings");

  render() {
    const { loading, payload } = this.state;
    const loadMore = loading ? null : (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          marginBottom:12,
          height: 32,
          lineHeight: "32px"
        }}
      >
        <Button onClick={this.goToStandingsPage}>Go to Standings Page</Button>
      </div>
    );
    console.log(payload.conf.east.slice(0, 5));
    return (
      <section className="standings">
        <Row className="header-row-standings">....</Row>
        <Row gutter={40} className="content-row-standings">
          <StandingsAdapter header={`NBA Conference East Standings`} loading={loading} data={payload.conf.east} loadMoreBtn={loadMore} large />
          <StandingsAdapter header={`NBA Conference West Standings`} loading={loading} data={payload.conf.west} loadMoreBtn={loadMore} large />
        </Row>
        <Row className="header-row-standings">....</Row>
        <Row gutter={40} className="content-row-standings">
          <StandingsAdapter header={`NBA Division East Atlantic Standings`} loading={loading} data={payload.div.east.atlantic} loadMoreBtn={loadMore} />
          <StandingsAdapter header={`NBA Division East Central Standings`} loading={loading} data={payload.div.east.central} loadMoreBtn={loadMore} />
          <StandingsAdapter header={`NBA Division East SouthEast Standings`} loading={loading} data={payload.div.east.southeast} loadMoreBtn={loadMore} />
        </Row>
        <Row className="header-row-standings">....</Row>
        <Row gutter={40} className="content-row-standings"> 
          <StandingsAdapter header={`NBA Division West Northwest Standings`} loading={loading} data={payload.div.west.northwest} loadMoreBtn={loadMore} />
          <StandingsAdapter header={`NBA Division West Pacific Standings`} loading={loading} data={payload.div.west.pacific} loadMoreBtn={loadMore} />
          <StandingsAdapter header={`NBA Division West SouthWest Standings`} loading={loading} data={payload.div.west.southwest} loadMoreBtn={loadMore} />
        </Row>
      </section>
    );
  }
}

export default StandingsHomeFeed;
