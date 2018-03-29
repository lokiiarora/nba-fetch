import React from "react";
import { Row, Carousel, Col, Avatar } from "antd";
import _ from 'underscore';

export default ({ data, settings, superIndex }) => (
  <Row gutter={40} className="content-row-standings">
    <Carousel {...settings}>
      {_.map(data, (item, index) => {
        return (
          <Col
            className={"slide-standings"}
            key={`carousel-${superIndex}-${index}`}
            span={6}
          >
            <div className="slide-standings-item">
              <Avatar
                size="large"
                className="standings-teamTag"
                src={`https://cdn.nba.net/assets/logos/teams/secondary/web/${
                  item.teamTag
                }.svg`}
              />
              <div className="meta">
                <h3>Rank {index + 1}</h3>
                <strong>
                  {item.city} {item.nickname}
                </strong>
                <p>Win % : {item.winPctV2}</p>
              </div>
            </div>
          </Col>
        );
      })}
    </Carousel>
  </Row>
);
