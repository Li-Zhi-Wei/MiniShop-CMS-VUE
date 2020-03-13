const orderRouter = {
  route: null,
  name: null,
  title: '订单管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-kecheng', // 菜单图标
  filePath: 'views/order/', // 文件路径
  order: 4,
  inNav: true,
  children: [
    {
      title: '订单列表',
      type: 'view',
      route: '/order/list',
      filePath: 'views/order/List.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default orderRouter
