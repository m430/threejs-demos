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
          },
          {
            path: "03",
            routes: [
              {
                path: "ambient_light",
                name: "环绕灯光",
                component: "chapter/03/AmbientLight",
              },
              {
                path: "spot_light",
                name: "聚光灯光源",
                component: "chapter/03/SpotLight",
              },
              {
                path: "point_light",
                name: "点光源",
                component: "chapter/03/PointLight",
              },
              {
                path: "directional_light",
                name: "平行光",
                component: "chapter/03/DirectionalLight",
              },
              {
                path: "hemisphere_light",
                name: "半球光光源",
                component: "chapter/03/HemisphereLight",
              },
              {
                path: "area_light",
                name: "平面光源",
                component: "chapter/03/AreaLight",
              },
              {
                path: "lens_flare",
                name: "镜头光晕",
                component: "chapter/03/LensFlare",
              },
            ]
          },
          {
            path: "04",
            routes: [
              {
                path: 'mesh_basic_material',
                name: "基础材质",
                component: "chapter/04/MeshBasicMaterial"
              },
              {
                path: 'mesh_depth_material',
                name: "网格深度材质",
                component: "chapter/04/MeshDepthMaterial"
              },
              {
                path: 'combined_material',
                name: "联合材质",
                component: "chapter/04/CombinedMaterial"
              },
              {
                path: 'mesh_normal_material',
                name: "网格法向材质",
                component: "chapter/04/MeshNormalMaterial"
              }
            ]
          },
          {
            path: "08",
            routes: [
              {
                path: "load_json",
                name: "加载Three.js的JSON格式模型",
                component: "chapter/08/LoadSaveJsonObject",
              },
              {
                path: "load_scene",
                name: "加载Three.js的JSON格式场景",
                component: "chapter/08/LoadSaveJsonScene",
              },
              {
                path: "load_obj",
                name: "加载OBJ模型文件",
                component: "chapter/08/LoadObj",
              },
              {
                path: "load_obj_mtl",
                name: "加载OBJ和MTL模型文件",
                component: "chapter/08/LoadObjMtl",
              },
              {
                path: "load_collada",
                name: "加载Collada模型DAE文件",
                component: "chapter/08/LoadCollada",
              },
              {
                path: "load_stl",
                name: "加载STL模型文件",
                component: "chapter/08/LoadSTL",
              },
              {
                path: "load_vtk",
                name: "加载VTK模型文件",
                component: "chapter/08/LoadVTK",
              },
              {
                path: "load_pdb",
                name: "加载PDB模型文件",
                component: "chapter/08/LoadPDB",
              },
              {
                path: "load_ply",
                name: "加载PLY模型文件",
                component: "chapter/08/LoadPLY",
              },
              {
                path: "load_vrml",
                name: "加载VRML模型文件",
                component: "chapter/08/LoadVRML",
              },
              {
                path: "load_tds",
                name: "加载TDS模型文件",
                component: "chapter/08/LoadTDS",
              },
              {
                path: "load_3mf",
                name: "加载3MF模型文件",
                component: "chapter/08/Load3MF",
              },
              {
                path: "load_amf",
                name: "加载AMF模型文件",
                component: "chapter/08/LoadAMF",
              },
              // {
              //   path: "load_draco",
              //   name: "加载DRACO模型文件",
              //   component: "chapter/08/LoadDRACO",
              // }
              {
                path: "load_prwm",
                name: "加载PRWM模型文件",
                component: "chapter/08/LoadPRWM",
              },
              {
                path: "load_gcode",
                name: "加载GCODE模型文件",
                component: "chapter/08/LoadGcode",
              },
              {
                path: "load_nrrd",
                name: "加载NRRD模型文件",
                component: "chapter/08/LoadNrrd",
              },
              {
                path: "load_svg",
                name: "加载SVG模型文件",
                component: "chapter/08/LoadSvg",
              },
            ]
          }
        ]
      },
    ]
  },
]
