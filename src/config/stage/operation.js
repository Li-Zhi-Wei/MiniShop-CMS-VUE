const operationRouter = {
  route: null,
  name: null,
  title: '运营管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli', // 菜单图标
  filePath: 'views/operation/', // 文件路径
  order: 2,
  inNav: true,
  children: [
    {
      title: '轮播图列表',
      type: 'view',
      route: '/operation/banner/List',
      filePath: 'views/operation/banner/List.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '主题列表',
      type: 'view',
      route: '/operation/theme/list',
      filePath: 'views/operation/theme/List.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default operationRouter
