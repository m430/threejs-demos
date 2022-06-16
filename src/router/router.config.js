export default [
  {
    path: '/',
    component: 'layouts/index',
    routes: [
      {
        path: "chapter",
        routes: [
          {
            path: "01",
            routes: [

              {
                path: 'basic',
                name: "基本场景使用",
                component: 'chapter/01/BasicSkeleton',
              },
              {
                path: 'material_light',
                name: "材料灯光使用",
                component: 'chapter/01/MaterialLight',
              },
              {
                path: 'material_light_animation',
                name: "动画使用",
                component: 'chapter/01/MaterialLightAnimation',
              },
              {
                path: 'control_gui',
                name: "控制GUI",
                component: 'chapter/01/ControlGui',
              },
              {
                path: 'screen_size_change',
                name: "界面大小自适应渲染",
                component: 'chapter/01/ScreenSizeChange',
              },
            ]
          },
          // 02,
          {
            path: '02',
            routes: [
              {
                path: "basic_scene",
                name: "基本场景",
                component: "chapter/02/BasicScene",
              },
              {
                path: "geometry",
                name: "几何体",
                component: "chapter/02/Geometries",
              },
              {
                path: "custom_geometry",
                name: "自定义几何体",
                component: "chapter/02/CustomGeometry",
              },
              {
                path: "mesh_property",
                name: "网格对象属性和方法",
                component: "chapter/02/MeshProperty",
              },
              {
                path: "both_camera",
                name: "正交摄像机和透视摄像机",
                component: "chapter/02/BothCamera",
              },
              {
                path: "camera_lookat",
                name: "摄像机聚焦",
                component: "chapter/02/CameraLookat",
              }
            ]
          }
        ]
      },
    ]
  },
]
