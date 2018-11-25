// boss管理权限
export const BossMenu = [
  {title: '资料管理', link: 'material', active: 'active', select: false, childs: [
    {title: '商品资料', link: '/material/product', active: 'active', select: false},
    {title: '店面资料', link: '/material/shopfront', active: 'active', select: false},
    {title: '员工资料', link: '/material/staff', active: 'active', select: false},
    {title: '仓库资料', link: '/material/store', active: 'active', select: false},
    {title: '供应商资料', link: '/material/supplier', active: 'active', select: false},
  ]},
  {title: '仓库管理', link: 'store', active: 'active', select: false, childs: [
    {title: '库存查询', link: '/store/search', active: 'active', select: false},
    {title: '进出货记录', link: '/store/record', active: 'active', select: false},
    // {title: '进出货管理', link: '/store/import', active: 'active', select: false},
    // {title: '出库管理', link: '/store/export', active: 'active', select: false},
    {title: '成本核算', link: '/store/cost', active: 'active', select: false},
    {title: '报损管理', link: '/store/lose', active: 'active', select: false},
  ]},
];
// 超级管理员权限
export const  SuperMenu = [
    {title: '资料管理', link: 'material', active: 'active', select: false, childs: [
      {title: '商品资料', link: '/material/product', active: 'active', select: false},
      {title: '仓库资料', link: '/material/store', active: 'active', select: false},
      {title: '供应商资料', link: '/material/supplier', active: 'active', select: false},
      {title: '员工资料', link: '/material/staff', active: 'active', select: false}
    ]},
    {title: '仓库管理', link: 'store', active: 'active', select: false, childs: [
      {title: '库存查询', link: '/store/search', active: 'active', select: false},
      {title: '进出货记录', link: '/store/record', active: 'active', select: false},
      // {title: '进出货管理', link: '/store/import', active: 'active', select: false},
      // {title: '出库管理', link: '/store/export', active: 'active', select: false},
      {title: '成本核算', link: '/store/cost', active: 'active', select: false},
      {title: '报损管理', link: '/store/lose', active: 'active', select: false},
    ]},
  ];
// 管理员权限
export const  MangerMenu = [
    {title: '仓库管理', link: 'store', active: 'active', select: false, childs: [
      {title: '库存查询', link: '/store/search', active: 'active', select: false},
      {title: '进出货记录', link: '/store/record', active: 'active', select: false},
      {title: '报损管理', link: '/store/lose', active: 'active', select: false},
    ]},
  ];
// 仓库管理员权限
export const  StockManageMenu = [
    {title: '仓库管理', link: 'store', active: 'active', select: false, childs: [
      {title: '库存查询', link: '/store/search', active: 'active', select: false},
      {title: '进出货记录', link: '/store/record', active: 'active', select: false},
    ]},
  ];
