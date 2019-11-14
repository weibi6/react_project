import React, {Component} from 'react';
import {Card, Icon, List} from 'antd';

import LinkButton from '../../components/link-button';

const {Item} = List
export default class ProductDetail extends Component {
    render() {
        const {name, desc, price, img, detail} = this.props.location.state.product
        const title = (
            <span>
                <LinkButton>
                    <Icon type="arrow-left" onClick={() => this.props.history.goBack()} 
                style={{fontSize: '18px', marginRight:5}}></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类：</span>
                        <span>电脑 --> 笔记本</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片：</span>
                        <span>
                            <img src="http://localhost:5000/upload/image-1554636776678.jpg" alt="img"/>
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}