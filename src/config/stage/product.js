const productRouter = {
  route: null,
  name: null,
  title: '商品管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli', // 菜单图标
  filePath: 'views/product/', // 文件路径
  order: 3,
  inNav: true,
  children: [
    {
      title: '商品库',
      type: 'view',
      route: '/product/list',
      filePath: 'views/product/List.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '商品分类',
      type: 'view',
      route: '/product/category',
      filePath: 'views/product/Category.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default productRouter
