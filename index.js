/**
 * @author qipeijun
 * @date 2022/4/19 21:08
 * @Description:
 */

// 以不规则棱柱体 Prism 为例，添加至 3DObjectLayer 图层中
var paths = [
    // 1号楼
    [
        [119.60554, 25.87389],
        [119.60545, 25.87351],
        [119.60600, 25.87336],
        [119.60611, 25.87366]
    ],
//    2号楼
    [
        [119.60614, 25.87358],
        [119.60609, 25.87333],
        [119.60672, 25.87307],
        [119.60691, 25.87337]
    ],
    //    3号楼
    [
        [119.60620, 25.87385],
        [119.60624, 25.87364],
        [119.60695, 25.87351],
        [119.60701, 25.87375]
    ],
    //    4号楼
    [
        [119.60637, 25.87420],
        [119.60626, 25.87406],
        [119.60701, 25.87386],
        [119.60708, 25.87404]
    ],
    //    5号楼
    [
        [119.60649,25.87453],
        [119.60644,25.87430],
        [119.60713,25.87414],
        [119.60716,25.87437]
    ],
];





// 创建 3D 底图
var map = new AMap.Map('container', {
    viewMode: '3D', // 开启 3D 模式
    pitch: 55,
    rotation: 35,
    center: [119.606, 25.874],
    features: ['bg', 'road'],
    zoom: 20
});

// 添加 Object3DLayer 图层，用于添加 3DObject 对象
var object3Dlayer = new AMap.Object3DLayer();
map.add(object3Dlayer);

// 以不规则棱柱体 Prism 为例，添加至 3DObjectLayer 图层中
// var paths = [[119.60649,25.87453],[119.60644,25.87430],[119.60713,25.87414],[119.60716,25.87437]];

let buildingPaths = [
    // // 1#
    // [[119.60554,25.87389],[119.60545,25.87351],[119.60600,25.87336],[119.60691,25.87374]],
    // // 2#
    // [[119.60614,25.87358],[119.60609,25.87333],[119.60672,25.87307],[119.60667,25.87332]],
    // // 3#
    // [[119.60620,25.87385],[119.60624,25.87364],[119.60695,25.87351],[119.60699,25.87372]],
    // // 4#
    // [[119.60637,25.87420],[119.60626,25.87406],[119.60701,25.87386],[119.60690,25.87400]],
    // // 5#
    // [[119.60649,25.87453],[119.60644,25.87430],[119.60713,25.87414],[119.60716,25.87437]],

    [
        [119.60555,25.87389],[119.60545,25.87351],[119.60600,25.87336],[119.60611,25.87366]
    ],
    [
        [119.60614,25.87358],[119.60609,25.87333],[119.60684,25.87307],[119.60691,25.87332]
    ],
    [
        [119.60631,25.87385],[119.60620,25.87364],[119.60687,25.87351],[119.60698,25.87372]
    ],
    [
        [119.60637,25.87418],[119.60626,25.87402],[119.60701,25.87386],[119.60704,25.87400]
    ],
    [
        [119.60649,25.87453],[119.60644,25.87430],[119.60713,25.87414],[119.60716,25.87437]
    ]
]


buildingPaths.forEach(paths=>{
    console.log(paths)
    createBuilding(paths)
})

function createBuilding(paths) {
    var bounds = paths.map(function(path) {
        return new AMap.LngLat(path[0], path[1]);
    });

// 创建 Object3D 对象
    var prism = new AMap.Object3D.Prism({
        path: bounds,
        height: 500,
        color: 'rgba(100, 150, 230, 0.7)' // 支持 #RRGGBB、rgb()、rgba() 格式数据
    });

// 开启透明度支持
    prism.transparent = true;

// 添加至 3D 图层
    object3Dlayer.add(prism);
}



