const logisticsRouter = {
  route: null,
  name: null,
  title: '物流管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-naozhongxiaoxitixing', // 菜单图标
  filePath: 'views/logistics/', // 文件路径
  order: 5,
  inNav: true,
  children: [
    {
      title: '发货记录',
      type: 'view',
      route: '/logistics/list',
      filePath: 'views/logistics/List.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default logisticsRouter
