
// 使用 Mock
var Mock = require('mockjs')
const categoryData = [
	{
	parentId: '0',
	_id: '1',
	name: '服装',
	_v: 0,
	},
	{
	parentId: '0',
	_id: '2',
	name: '食品',
	_v: 0,
	},
	{
	parentId: '0',
	_id: '3',
	name: '玩具',
	_v: 0,
	},
	{
	parentId: '0',
	_id: '4',
	name: '图书',
	_v: 0,
	},
]
const subCategory1 = [
	{
	parentId: '1',
	_id: '11',
	name: '男装',
	_v: 1,
	},
	{
	parentId: '1',
	_id: '21',
	name: '女装',
	_v: 1,
	},
	{
	parentId: '1',
	_id: '31',
	name: '童装',
	_v: 1,
	},
	{
	parentId: '1',
	_id: '41',
	name: '老年装',
	_v: 1,
	},
]
const subCategory2 = [
	{
	parentId:'2',
	_id: '12',
	name: '巧克力',
	_v: 1,
	},
	{
	parentId:'2',
	_id: '22',
	name: '辣条',
	_v: 1,
	},
	{
	parentId:'2',
	_id: '32',
	name: '果冻',
	_v: 1,
	},
	{
	parentId:'2',
	_id: '42',
	name: '牛奶',
	_v: 1,
	},
]
const subCategory3 = [
	{
	parentId: '3',
	_id: '13',
	name: '飞机',
	_v: 1,
	},
	{
	parentId: '3',
	_id: '23',
	name: '赛车',
	_v: 1,
	},
	{
	parentId: '3',
	_id: '33',
	name: '布熊',
	_v: 1,
	},
	{
	parentId: '3',
	_id: '43',
	name: '手枪',
	_v: 1,
	},
]
const subCategory4 = [
	{
	parentId: '4',
	_id: '14',
	name: '水浒转',
	_v: 1,
	},
	{
	parentId: '4',
	_id: '24',
	name: '三国志',
	_v: 1,
	},
	{
	parentId: '4',
	_id: '34',
	name: '红楼梦',
	_v: 1,
	},
	{
	parentId: '4',
	_id: '44',
	name: '西游记',
	_v: 1,
	},
]
const allList = [categoryData, subCategory1, subCategory2, subCategory3, subCategory4]
export const reqCategoryList = Mock.mock(
	"/reqCategoryList",
	'post',
	option => {
		const {parentId} = JSON.parse(option.body)
		if(parentId === '0') {
			return {
				"status": 0,
			//"/mock"是通过ajax获取数据时填写的地址，可以随意写。但要和ajax请求时填写的地址一致。
				"data": categoryData
			}
		} else if (parentId === '1') {
			return {
				"status": 0,
			//"/mock"是通过ajax获取数据时填写的地址，可以随意写。但要和ajax请求时填写的地址一致。
				"data": subCategory1
			}
		} else if (parentId === '2') {
			return {
				"status": 0,
			//"/mock"是通过ajax获取数据时填写的地址，可以随意写。但要和ajax请求时填写的地址一致。
				"data": subCategory2
			}
		} else if (parentId === '3') {
			return {
				"status": 0,
			//"/mock"是通过ajax获取数据时填写的地址，可以随意写。但要和ajax请求时填写的地址一致。
				"data": subCategory3
			}
		} else if(parentId === '4') {
			return {
				"status": 0,
			//"/mock"是通过ajax获取数据时填写的地址，可以随意写。但要和ajax请求时填写的地址一致。
				"data": subCategory4
			}
		} else {
			return {
				"status": 0,
				"data": []
			}
		}
	}
)
export const updateCategoryName = Mock.mock(
	"/updateCategoryName",
	'post',
	option => {
		const {categoryId, categoryName} = JSON.parse(option.body)
		allList.some((list) => {
			list.some((item) => {
				if(item._id === categoryId) {
					item.name = categoryName
				}
			})
		})
		return {
			"status": 0,
			"data": allList
		}
	}
)
export const addCategory = Mock.mock(
	"/addCategory",
	'post',
	option => {
		const {parentId, categoryName} = JSON.parse(option.body)
		allList.find((list) => {
			list.find((item) => {
				if(item.parentId === parentId) {
					const _id = (list.length+1).toString();
					return list.push(
						{
							parentId: parentId,
							_id: _id,
							name: categoryName,
							_v: 0,
						}
					)
				}
			})
		})
		return {
			"status": 0,
			"data": allList
		}
	}
)
export const reqProducts = Mock.mock(
	"/reqProducts",
	'post',
	{
		"status": 0,
		"data": {
			"list": [
				{
					"status": 1,
					"imgs": [
						"image-1554636776678.jpg",
						"image-1557738385383.jpg"
					],
					"_id": "5ca9e05db49ef916541160cd",
					"name": "联想ThinkPad 翼480",
					"desc": "年度重量级新品, x390、T490全新登场",
					"price": 66000,
					"pCategoryId": "79890unjkmmk80800",
					"categoryId": "5chkh1809090999",
					"detail": "<p>详情1</p>",
					"_v": 0
				},
				{
					"status": 1,
					"imgs": [
						"image-1554637776678.jpg",
						"image-1554738385383.jpg"
					],
					"_id": "5ce9e05db49ef916541160cd",
					"name": "华硕(ASUS)飞行堡垒",
					"desc": "15.6英寸窄边框游戏笔记本电脑",
					"price": 6799,
					"pCategoryId": "5ca79890unjkmmk80800",
					"categoryId": "5ca3hkh1809090999",
					"detail": "<p>详情2</p>",
					"_v": 0
				},
			]
		}
	}
)
export const reqRoleLists = Mock.mock(
  'reqRoleLists',
  {
    "status": 0,
    "data": [
        {
            "menus": [
                "/role",
                "/charts/bar",
                "/home",
                "/category"
            ],
            "_id": "5ca9eaa1b49ef916541160d3",
            "name": "测试",
            "create_time": 1554639521749,
            "__v": 0,
            "auth_time": 1558679920395,
            "auth_name": "test007"
        },
        {
            "menus": [
                "/role",
                "/charts/bar",
                "/home",
                "/charts/line",
                "/category",
                "/product",
                "/products"
            ],
            "_id": "5ca9eab0b49ef916541160d4",
            "name": "经理",
            "create_time": 1554639536419,
            "__v": 0,
            "auth_time": 1558506990798,
            "auth_name": "test008"
        },
        {
            "menus": [
                "/home",
                "/products",
                "/category",
                "/product",
                "/role"
            ],
            "_id": "5ca9eac0b49ef916541160d5",
            "name": "角色1",
            "create_time": 1554639552758,
            "__v": 0,
            "auth_time": 1557630307021,
            "auth_name": "admin"
        }
    ]
}
)
// 输出结果
//export default dataMock
