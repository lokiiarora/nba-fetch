import React from 'react';
import {
    Col,
    List,
    Avatar
} from 'antd';
import { Link } from 'react-router-dom';

export default ({ loading , data, loadMoreBtn, large , header, ...props}) => {
    return (
        <Col span={large ? 12 : 8}>
            <List
              loading={loading}
              bordered
              itemLayout="horizontal"
              dataSource={
                data
              }
              header={header}
              loadMore={loadMoreBtn}
              renderItem={(item,index) => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://cdn.nba.net/assets/logos/teams/secondary/web/${
                            item.teamTag
                          }.svg`}
                          size="large"
                        />
                      }
                      title={
                        <Link to={"/team/" + item.teamTag}>{`${
                          item.nickname
                        }, ${item.city}`}</Link>
                      }
                      description={<p>Rank <span className='strong-text'>{index + 1}</span></p>}
                    />
                  </List.Item>
                );
              }}
            />
          </Col>
    );
}