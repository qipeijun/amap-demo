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





// Object3D.Mesh 的 color 分别是[r, g, b, a]，每个分量只支持 [0 - 1] 区间，
let color = [145 / 255, 185 / 255, 187 / 255, 0.9];
let selectColor = [100 / 255, 150 / 255, 230 / 255, 0.9];
let meshes = [];   // 建筑物集合
let texts = [];   //建筑名称集合

// 创建 3D 底图
let map = new AMap.Map('container', {
    viewMode: '3D', // 开启 3D 模式
    pitch: 55,
    rotation: 35,
    center: [119.606, 25.874],
    features: ['bg', 'road'],
    zoom: 25,
    buildingAnimation:true,
    mapStyle: "amap://styles/fresh"

});
// 添加 Object3DLayer 图层，用于添加 3DObject 对象
let object3Dlayer = new AMap.Object3DLayer();
map.add(object3Dlayer);


buildingPaths.forEach((paths,index)=>{
    createBuilding(paths,`#${index+1}栋`)

})

updateMeshColor(meshes[0],selectColor);

map.on('mousemove',function (ev) {
    var pixel = ev.pixel;
    var px = new AMap.Pixel(pixel.x, pixel.y);
    var obj = map.getObject3DByContainerPos(px, [object3Dlayer], false) || {};

    // 选中的 face 所在的索引
    var index = obj.index;
    // 选中的 object3D 对象，这里为当前 Mesh
    var object = obj.object;
    // 被拾取到的对象和拾取射线的交叉点的3D坐标
    var point = obj.point;
    // 交叉点距透视原点的距离
    var distance = obj.distance;

    updateInfo(obj);
    updateMesh(object);

})



function createBuilding(paths,buildingName) {
    var bounds = paths.map(function(path) {
        return new AMap.LngLat(path[0], path[1]);
    });

// 创建 Object3D 对象
    var prism = new AMap.Object3D.Prism({
        path: bounds,
        height: 400,
        color: color // 支持 #RRGGBB、rgb()、rgba() 格式数据
    });

// 开启透明度支持
    prism.transparent = true;

// 添加至 3D 图层
    object3Dlayer.add(prism);

    meshes.push(prism);

    // 添加建筑名称
    drawTextFlag(paths[2],buildingName)

}

function drawTextFlag(path,buildingName ) {
    let text = new AMap.Text({
        text:  buildingName,
        verticalAlign: 'bottom',
        position: [path[0], path[1]],
        height: 400,
        style: {
            'background-color': 'transparent',
            '-webkit-text-stroke': 'white',
            '-webkit-text-stroke-width': '0.4px',
            'text-align': 'center',
            'border': 'none',
            'color': 'white',
            'font-size': '16px',
        }
    });
    text.setMap(map);
    texts.push(text);
}


function updateInfo(obj) {
    function isNil(obj) {
        return obj == undefined;
    }
    var $meshId = document.getElementById('mesh-id');
    var $faceIndex = document.getElementById('face-index');
    var $crossPoint = document.getElementById('cross-point');
    var $distance = document.getElementById('distance');

    $meshId.innerHTML = (!isNil(obj.object) && !isNil(obj.object.id)) ? obj.object.id : '--';
    $faceIndex.innerHTML = !isNil(obj.index) ? obj.index : '--';
    $distance.innerHTML = !isNil(obj.distance) ? obj.distance : '--';
    var p = '--';
    if (obj.point) {
        p = [
            '',
            'X: ' + obj.point[0],
            'Y: ' + obj.point[1],
            'Z: ' + obj.point[2]
        ].join('<br>');
    }

    $crossPoint.innerHTML = p;
}



function updateMesh(obj) {
    var mesh = meshes.find(function (mesh) {
        return mesh == obj;
    });

    // 重置 Mesh 颜色
    meshes.forEach(function (mesh) {
        updateMeshColor(mesh, color);
    });

    // 更新选中 Mesh 的 vertexColors
    if (mesh) {
        updateMeshColor(mesh, selectColor);
    }

}

function updateMeshColor(mesh, color) {
    var vertexColors = mesh.geometry.vertexColors;
    var len = vertexColors.length;
    for (var i = 0; i < len / 4; i++) {
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var a = color[3];
        // 不能重新赋值，只允许修改内容
        vertexColors.splice(i * 4, 4, r, g, b, a);
    }

    mesh.needUpdate = true;
    mesh.reDraw();
}




