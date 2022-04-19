/**
 * @author qipeijun
 * @date 2022/4/19 21:55
 * @Description:
 */
// 创建 3D 底图
var map = new AMap.Map('container', {
    viewMode: '3D', // 开启 3D 模式
    pitch: 55,
    rotation: 35,
    center: [119.606, 25.874],
    features: ['bg', 'road'],
    zoom: 15
});

map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
map.DirectionLight = new AMap.Lights.DirectionLight([1, -1, 2], [1, 1, 1], 0.8);

// 添加 Object3DLayer 图层，用于添加 3DObject 对象
var object3Dlayer = new AMap.Object3DLayer();
map.add(object3Dlayer);

var meshes = [];

// 以不规则棱柱体 Prism 为例，添加至 3DObjectLayer 图层中
var paths = [
    // 1#
    [[119.60554,25.87389],[119.60545,25.87351],[119.60600,25.87336],[119.60691,25.87374]],
    // 2#
    [[119.60614,25.87358],[119.60609,25.87333],[119.60672,25.87307],[119.60667,25.87332]],
    // 3#
    [[119.60620,25.87385],[119.60624,25.87364],[119.60695,25.87351],[119.60699,25.87372]],
    // 4#
    [[119.60637,25.87420],[119.60626,25.87406],[119.60701,25.87386],[119.60690,25.87400]],
    // 5#
    [[119.60649,25.87453],[119.60644,25.87430],[119.60713,25.87414],[119.60716,25.87437]],
];

// Object3D.Mesh 的 color 分别是[r, g, b, a]，每个分量只支持 [0 - 1] 区间，
var color = [100 / 255, 150 / 255, 230 / 255, 0.9];
var selectColor = [255 / 255, 245 / 255, 47 / 255, 0.9];

function initMesh() {

    paths.forEach(function (path) {
        var bounds = path.map(function (p) {
            return new AMap.LngLat(p[0], p[1]);
        });

        // 创建 Object3D.Mesh 对象
        var mesh = new AMap.Object3D.Mesh();
        meshes.push(mesh);
        var geometry = mesh.geometry;
        var vertices = geometry.vertices;
        var vertexColors = geometry.vertexColors;
        var faces = geometry.faces;
        var vertexLength = bounds.length * 2;

        var verArr = [];

        // 设置侧面
        bounds.forEach(function (lngLat, index) {
            var g20 = map.lngLatToGeodeticCoord(lngLat);
            verArr.push([g20.x, g20.y]);
            // 构建顶点-底面顶点
            vertices.push(g20.x, g20.y, 0);
            // 构建顶点-顶面顶点
            vertices.push(g20.x, g20.y, -1000);

            // 设置底面顶点颜色
            vertexColors.push.apply(vertexColors, color);
            // 设置顶面顶点颜色
            vertexColors.push.apply(vertexColors, color);

            // // 设置三角形面
            // var bottomIndex = index * 2;
            // var topIndex = bottomIndex + 1;
            // var nextBottomIndex = (bottomIndex + 2) % vertexLength;
            // var nextTopIndex = (bottomIndex + 3) % vertexLength;
            //
            // //侧面三角形1
            // faces.push(bottomIndex, topIndex, nextTopIndex);
            // //侧面三角形2
            // faces.push(bottomIndex, nextTopIndex, nextBottomIndex);
        });

        // 设置顶面，根据顶点拆分三角形
        var triangles = AMap.GeometryUtil.triangulateShape(verArr);
        for (var v = 0; v < triangles.length; v += 3) {
            var a = triangles[v];
            var b = triangles[v + 2];
            var c = triangles[v + 1];
            faces.push(a * 2 + 1, b * 2 + 1, c * 2 + 1);
        }

        // 开启透明度支持
        mesh.transparent = true;

        // 添加至 3D 图层
        object3Dlayer.add(mesh);
    });

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

// prism 拾取
map.on('mousemove', function (ev) {
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
});

function updateInfo(obj) {
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

function isNil(obj) {
    return obj == undefined;
}

initMesh();
