

// import http from '@/dss-wechat3rd/src/api/retail/goodsMgr/serviceCategory'
const sourceList = [
  {
    value: 0,
    label: '品牌来源'
  },
  {
    value: 1,
    label: '平台来源'
  },
  {
    value: 2,
    label: '门店来源'
  }
]
// 返回表格列表的每列名称
export function tableColumns () {
  return [
    {
      label: '场景信息',
      minWidth: '240',
      fixed: true,
      render: (h, { row }) => {
        const _img = h('img', {
          attrs: {
            src: row.pictureUrl && row.pictureUrl.split(',')[0],
          },
          style: {
            width: '80px',
            height: '80px'
          }
        })
        const sceneName = h('p', {}, [row.name]); // 场景名称
        const sceneAcreage = h('p', {}, ['面积:', row.acreage, '㎡']); // 场景面积，单位平米
        const scenenTime = h('p', {}, ['服务时间:', row.startTime, '-', row.endTime])
        const textInfo = h('div', {
          style: {
            'textAlign': 'left',
            'padding-left': '5px'
          }
        }, [
          sceneName,
          sceneAcreage,
          scenenTime
        ])
        return h('div', {
          style: {
            display: 'flex',
            'align-items': 'center'
          }
        }, [
          _img,
          textInfo
        ])
      }
    },
    {
      prop: 'serviceCategoryName',
      label: '场景分类',
      return: (h, { row }) => {
        return h('span', {}, [row.serviceCategoryName || '--'])
      }
    },
    {
      prop: 'lable',
      label: '场景标签',
      render: (h, { row } ) => {
        let text = ''
        if (Array.isArray(JSON.parse(row.lable))) {
          text = JSON.parse(row.lable).join('，')
        } else {
          text = row.lable
        }
        return h('span', {}, [text || '--'])
      }
    },
    {
      prop: 'minPrice',
      label: '售价(单价)',
      render: (h, { row }) => {
        let price = ''
        if (row.minPrice == row.maxPrice) {
          price = row.minPrice / 100 + '元'
        } else {
          price = `${row.minPrice / 100}元 ~ ${row.maxPrice / 100}元`
        }
        return h('span', {}, price)
      }
    },
    {
      prop: 'cashPledge',
      label: '押金',
      render: (h, { row }) => {
        const cash = row.cashPledge && row.cashPledge / 100 || '--'
        return h('span', {}, [cash])
      }
    },
    {
      prop: 'reservation',
      label: '是否预定',
      render: (h, { row }) => {
        const text = row.reservation === 0 ? '否' : '是';
        return h('span', {}, [text])
      }
    },
    {
      prop: 'employeeName',
      label: '关联员工'
    },
    {
      prop: 'status',
      label: '状态',
      render: (h, { row }) => {
        return h('el-switch', {
          attrs: {
            value: Boolean(row.status),
          },
          on: {
            change: () => {
              this.handleStatusChanage(row)
            }
          }
        })
      }
    },
    {
      prop: 'source',
      label: '来源',
      render: (h, { row }) => {
        const text = sourceList.filter(item => (item.value === row.source))
        return h('span', {}, [text[0].label || '--'])
      }
    },
    {
      label: '操作',
      showTooltip: false,
      minWidth: '240',
      fixed: 'right',
      render: (h, { row }) => {
        const editBtn = h('el-button', {
          attrs: {
            type: 'text'
          },
          nativeOn: {
            click: () => {
              this.$router.push({ path: '/service/scene/management/addEdit', query: { pageType: 'edit', id: row.id } })
            }
          }
        }, ['编辑']); // 编辑按钮

        const delBtn = h('el-button', {
          attrs: {
            type: 'text'
          },
          nativeOn: {
            click: () => {
              this.handleSceneDel(row);
            }
          }
        }, ['删除']); // 删除按钮
        
        const setPriceBtn = h('el-button', {
          attrs: {
            type: 'text'
          },
          nativeOn: {
            click: () => {
              this.$router.push({ path: '/service/scene/management/set-price', query: {rid: row.id} })
            }
          }
        }, ['设置价格日历']); // 设置价格日历

        return h('div', {
          class: 'operation_btn'
        }, [
          setPriceBtn, 
          editBtn,
          delBtn
        ]);
      }
    },
  ]
};

// 列表的条件筛选组件的配置数据
export function searchList () {
  return [
    {
      label: '场景分类',
      type: 'w-scascader',
      prop: 'serviceCategoryId',
      // cascaderProps: {
      //   lazy: true,
			// 	checkStrictly: false,
			// 	lazyLoad (node, resolve) {
			// 		const params = {
			// 			parentId: !node.root ? node.data.value : null,
			// 			categoryType: 4
			// 		}
			// 		if (node.isLeaf)
			// 		{
			// 			resolve()
			// 		}
			// 		http.selectPlatformCategoryList(params).then(res => {
			// 			if (res.data)
			// 			{
			// 				const nodes = res.data.map((item) => {
			// 					return {
			// 						label: item.categoryName,
			// 						leaf: !node.root,
			// 						value: item.id
			// 					}
			// 				})
			// 				resolve(nodes)
			// 			} else
			// 			{
			// 				this.serviceCategoryId = [node.data.value]
			// 				node.data.leaf = true
			// 				resolve()
			// 			}
			// 		})
			// 	}
      // },
      style: {
        width: '160px'
      }
    },
    {
      label: '是否需要押金',
      type: 'w-select',
      prop: 'cashPledge',
      placeholder: '是否退押金',
      listData: [ // 下拉组件的筛选数据
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        },
      ],
      style: {
        width: '160px'
      }
    },
    {
      label: '上下架',
      type: 'w-select',
      prop: 'status',
      placeholder: '请选择',
      listData: [ // 下拉组件的筛选数据
        {
          value: '0',
          label: '下架'
        },
        {
          value: '1',
          label: '上架'
        },
      ],
      style: {
        width: '160px'
      }
    },
    {
      label: '来源渠道',
      type: 'w-select',
      prop: 'source',
      placeholder: '来源渠道',
      listData: sourceList,
      style: {
        width: '160px'
      }
    },
    {
      label: '员工',
      type: 'w-select',
      prop: 'employeeId',
      placeholder: '请选择员工',
      listData: [ // 下拉组件的筛选数据
      ],
      style: {
        width: '160px'
      }
    },
    {
      placeholder: '场景名称',
      type: 'input',
      prop: 'keyword',
      style: {
        width: '160px'
      }
    },
  ]
}

