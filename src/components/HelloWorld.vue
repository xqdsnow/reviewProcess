<template>
  <div ref="appCan" id="container" class="container"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Canvas, Node } from "butterfly-dag";
import "butterfly-dag/dist/index.css";

import NodeClassInit from "./utils/nodeInit/node";
import NodeClassReview from "./utils/nodeReview/node";
import NodeClassSend from "./utils/nodeSend/node";
// import NodeClassAdd from "./utils/nodeAdd/node";

import EdgeClass from "./edge/addEdge/edge";
const appCan = ref(null);

onMounted(() => {
  let dom = document.getElementById("container");
  let nodes = [
    {
      id: "1",
      label: "发起人",
      x: 0,
      y: 400,
      Class: NodeClassInit,
      head: "123",
    },
    {
      id: "2",
      label: "发起人",
      x: 200,
      y: 200,
      type: "init",
      Class: NodeClassInit,
    },
    {
      id: "3",
      label: "审核人",
      type: "review",
      x: 200,
      y: 600,
      Class: NodeClassReview,
    },
    {
      id: "4",
      label: "抄送人",
      type: "cc",
      x: 400,
      y: 400,
      Class: NodeClassSend,
    },
  ];
  let edges = [
    {
      id: "e1",
      source: "1",
      target: "2",
      label: "12",
      Class: EdgeClass,
    },
    {
      id: "e2",
      source: "1",
      target: "3",
      Class: EdgeClass,
    },
    {
      id: "e3",
      source: "2",
      target: "4",
      Class: EdgeClass,
    },
    {
      id: "e4",
      source: "3",
      target: "4",
      Class: EdgeClass,
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
    }
  );
  canvas.on("system.node.click", (data: any) => {
    console.log(data);
  });
  canvas.on("getAdd", (data: any) => {
    console.log(data)
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
  background-color: #eeeeee;
}
</style>
