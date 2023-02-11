<template>
  <div ref="appCan" id="container" class="container"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Canvas, Group, Node, Edge } from "butterfly-dag";
import "butterfly-dag/dist/index.css";
import NodeClass from './utils/nodeSend/node'

const appCan = ref(null);

onMounted(() => {
  let dom = document.getElementById('container');
  let nodes = [
    {
      id: "1",
      label: "a",
      x: 0,
      y: 0,
      Class: NodeClass,
    },
    {
      id: "2",
      label: "b",
      x: 100,
      y: 100,
      Class: NodeClass,
    },
  ];
  let edges = [
    {
      source: "2",
      target: "1",
    },
  ];
  let canvas = new Canvas({
    root: dom, //canvas的根节点(必传)
    zoomable: true, //可缩放(可传)
    moveable: true, //可平移(可传)
    draggable: true, //节点可拖动(可传)
  });
  canvas.draw({
    nodes: nodes, //节点信息
    edges: edges,
  });
});
</script>
<style scoped>
.container{
    width: 1200px;
    height: 600px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    margin-top: 20px;
}
</style>
