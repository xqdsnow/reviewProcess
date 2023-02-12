<template>
  <div ref="appCan" id="container" class="container"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Canvas, Node } from "butterfly-dag";
import "butterfly-dag/dist/index.css";
import NodeClass from "./utils/nodeSend/node";

const appCan = ref(null);

onMounted(() => {
  let dom = document.getElementById("container");
  let nodes = [
    {
      id: "1",
      label: "a",
      x: 0,
      y: 400,
      Class: NodeClass,
      head: "123",
    },
    {
      id: "2",
      label: "b",
      x: 200,
      y: 200,
      Class: NodeClass,
    },
    {
      id: "3",
      label: "c",
      x: 200,
      y: 600,
      Class: NodeClass,
    },
    {
      id: "4",
      label: "d",
      x: 400,
      y: 400,
      Class: NodeClass,
    },
  ];
  let edges = [
    {
      source: "1",
      target: "2",
    },
    {
      source: "1",
      target: "3",
    },
    {
      source: "2",
      target: "4",
    },
    {
      source: "3",
      target: "4",
    },
  ];
  let canvas = new Canvas({
    root: dom, //canvas的根节点(必传)
    zoomable: true, //可缩放(可传)
    moveable: true, //可平移(可传)
    draggable: true, //节点可拖动(可传)
  });
  canvas.draw(
    {
      nodes: nodes, //节点信息
      edges: edges,
    },
    // () => {
    //   canvas.setGridMode(true, {
    //     isAdsorb: true, // 是否自动吸附,默认关闭
    //     theme: {
    //       shapeType: "line", // 展示的类型，支持line & circle
    //       gap: 70, // 网格间隙
    //       background: " #e9e9eb", // 网格背景颜色
    //       circleRadiu: 0.5, // 圆点半径
    //       circleColor: " #dedfe0", // 圆点颜色
    //     },
    //   });
    // }
  );
  canvas.on("system.node.click", (data: any) => {
    console.log(data);
  });
});
</script>
<style scoped>
.container {
  width: 1200px;
  height: 600px;
  border: 1px solid #dddddd;
  border-radius: 10px;
  margin-top: 20px;
}
</style>
