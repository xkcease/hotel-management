# 酒店预订系统-Vue后台
vue3 + element-plus构建项目，且全面使用组合式API。

该仓库为酒店预订系统的后台，其前台微信小程序和Node.js服务端如下：
> [微信小程序前台](https://github.com/xkcease/hotel-weapp)  

> [Node.js服务端](https://github.com/xkcease/hotel-server)

## 技术栈
- Vue3 
- Vue Router
- Vuex 
- Vue CLI
- Element-Plus
- Sass 
- ES6
- Axios


## 安装与使用
```shell
# 安装依赖
npm install

# 本地运行
npm run serve 	

# 打包
npm run build		
```

## 说明
该后台系统采用vue动态路由来管理权限，分为三个权限：普通、高级、超级；
不同权限所能使用的功能如下：
- 普通管理员：订单管理
- 高级管理员：订单管理、房间管理、小程序信息管理
- 超级管理员：订单管理、房间管理、小程序信息管理、用户管理

## 功能
1.  登录
2.  修改密码
3.  查询用户
4.  添加用户
5.  删除用户
6.  用户权限修改
7.  查询房间
8.  添加房间
9.  更改房间
10. 删除房间
11. 查询未入住订单
12. 查询已入住订单
13. 查询已退房订单
14. 修改订单
15. 删除订单
16. 查看订单详情
17. 办理入住
18. 办理退房
19. 修改价格
20. 主页
21.	酒店简介修改
22. 房间描述修改
23. 实时接收订单
24. to be continued


## 目录
```shell
hotel-management
│  .browserslistrc
│  .eslintrc.js
│  .gitignore
│  .prettierrc
│  babel.config.js
│  jest.config.js
│  package-lock.json
│  package.json
│  README.md
│  vue.config.js
│       
├─public
│      favicon.ico
│      index.html
│      
├─src
│  │  App.vue
│  │  main.js
│  │  
│  ├─assets
│  │  ├─css
│  │  │      reset.css
│  │  │      
│  │  └─scss
│  │          base.scss
│  │          color.scss
│  │          index.scss
│  │          
│  ├─components
│  │      Navbar.vue
│  │      Sidebar.vue
│  │      SvgIcon.vue
│  │      
│  ├─icons
│  │  │  index.js
│  │  │  
│  │  └─svg
│  │          home.svg
│  │          hotel.svg
│  │          
│  ├─router
│  │      index.js
│  │      
│  ├─store
│  │      index.js
│  │      
│  ├─utils
│  │      adminRequest.js
│  │      dateTool.js                      // 日期格式化工具
│  │      http.js                          // axios封装
│  │      introRequest.js
│  │      loading.js
│  │      orderRequest.js
│  │      priceRequest.js
│  │      roomRequest.js
│  │      socketIOTool.js
│  │      
│  └─views
│      │  404.vue
│      │  Hall.vue
│      │  Login.vue
│      │  
│      └─hall
│          │  Home.vue
│          │  ModifyPassword.vue
│          │  
│          ├─admin
│          │      AddAdmin.vue
│          │      AdminList.vue
│          │      
│          ├─intro
│          │      HotelIntro.vue
│          │      RoomIntro.vue
│          │      
│          ├─order
│          │      CheckIn.vue
│          │      CheckOut.vue
│          │      CompletedOrder.vue
│          │      ModifyOrder.vue
│          │      OccupiedOrder.vue
│          │      ReservedOrder.vue
│          │      
│          └─room
│                  AddRoom.vue
│                  ModifyPrice.vue
│                  ModifyRoom.vue
│                  RoomList.vue
│                  
└─tests
    └─unit
            example.spec.js
```


