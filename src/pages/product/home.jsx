import React, {Component} from 'react';
import {Card, Select, Input, Button, Icon, Table} from 'antd'
import axios from 'axios'

import LinkButton from '../../components/link-button';
import  '../../mock/mock'
const { Option } = Select;
export default class ProductHome extends Component {
    state = {
        products: [], //商品的数组
        ajaxProducts: [], //请求的商品数组
        loading: false, //是否正在加载中
        searchName: '', //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索
    }
    getProducts = () => {
        //在发请求前，显示loading
        this.setState({loading: true})
        axios.post('/reqProducts')
            .then(res=>{
                const result = res.data;
                //请求完成后关闭loading
                this.setState({loading: false})
                this.setState({
                    ajaxProducts: result.data.list
                })
                if(result.status === 0) {
                    this.setState({
                        products: result.data.list
                    })
                }
            })
    }
    /* 初始化table所有列数 */
    initColums = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                width: 100,
                dataIndex: 'status',
                render: (status) => {
                    return (
                        <span>
                            <Button type="primary">下架</Button>
                            <span>在售</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push({
                                pathname: '/product/detail',
                                state: { product }
                            })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }
    /* 查询商品 */
    search = () => {
        const {searchName, searchType, ajaxProducts} = this.state
        if(searchName && searchType === 'productName') {
            const resultProducts = ajaxProducts.filter((item) => {
                if(item.name.includes(searchName)) {
                    return true;
                }
                return false;
            });
            this.setState({
                products: resultProducts
            })
        } else if(searchName && searchType === 'productDesc') {
            const resultProducts = ajaxProducts.filter((item) => {
                if(item.desc.includes(searchName)) {
                    return true;
                }
                return false;
            });
            this.setState({
                products: resultProducts
            })
        } else {
            this.setState({
                products: ajaxProducts
            })
        }
    }
    /* 为第一次render准备数据 */
    componentWillMount() {
        this.initColums()
    }
    componentDidMount() {
        this.getProducts()
    }
    render() {
        const {products, loading, searchName, searchType} = this.state
        const title = (
            <span>
                <Select value={searchType} onChange={value => this.setState({searchType: value})}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="关键字" style={{width: 150, margin: '0 10px'}}
                value={searchName} onChange={e => this.setState({searchName: e.target.value})}/>
                <Button type="primary" onClick={() => {this.search()}}>搜索</Button>
            </span>
        )
        const extra = (
            <span>
                <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
                   <Icon type="plus"></Icon>
                   添加商品
                </Button>
            </span>
        )
        return (
            <Card title={title} extra={extra}>
                <Table bordered rowKey='_id' dataSource={products} columns={this.columns} loading={loading}/>
            </Card>
        )
    }
}
