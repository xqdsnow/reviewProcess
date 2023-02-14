<template>
  <div ref="appCan" id="container" class="container"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessageBox } from "element-plus";

import { Canvas, Node,Edge } from "butterfly-dag";
import "butterfly-dag/dist/index.css";

import NodeClassInit from "./node/nodeInit/node";
import NodeClassReview from "./node/nodeReview/node";
import NodeClassSend from "./node/nodeSend/node";
import NodeClassEnd from "./node/nodeEnd/node";
import EdgeClass from "./edge/addEdge/edge";
const edgesFalg = ref(0);
let nodes = reactive({
  arr: [
    {
      id: "1",
      label: "发起人",
      x: 0,
      y: 300,
      type: "init",
      Class: NodeClassInit,
    },
    {
      id: "2",
      label: "审核人",
      type: "review",
      x: 150,
      y: 300,
      Class: NodeClassReview,
    },
    {
      id: "3",
      label: "抄送人",
      type: "send",
      x: 300,
      y: 300,
      Class: NodeClassSend,
    },
    {
      id: "4",
      x: 500,
      y: 415,
      type: "end",
      Class: NodeClassEnd,
    },
  ],
});
let edges = reactive({
  arr: [
    {
      id: "e1",
      source: "1",
      target: "2",
      Class: EdgeClass,
    },
    {
      id: "e2",
      source: "2",
      target: "3",
      Class: EdgeClass,
    },
    {
      id: "e3",
      source: "3",
      target: "4",
      Class: EdgeClass,
    },
  ],
});

const appCan = ref(null);
const nArr = reactive([]);
const reLink = (type: any, id: any, val: any) => {
  if (type == "del") {
    let arr = val.arr;
    // 需要删除的节点 上下文节点
    let source = ref(null);
    let target = ref(null);
    arr.forEach((e: any) => {
      if (e.source == id) {
        source.value = e.source;
        target.value = e.target;
      }
    });
    arr.forEach((e: any) => {
      if (e.source != id && e.target == id) {
        e.target = target.value;
        nArr.push(e as never);
      }
      if (e.source != id) {
        nArr.push(e as never);
      }
    });
    // edges 重新赋值
    edges.arr = [...new Set(nArr)];
    return edges.arr;
  }
};
const reNode = (type: any, id: any, val: any) => {
  if (type == "single") {
    let nNode = reactive([]);
    val.forEach((e: any) => {
      if (e.id != id) {
        nNode.push(e as never);
      }
    });
    nodes.arr = nNode;
  }
};

let curId = ref(null);
const getId = () => {
  curId.value = new Date().getTime().toString() as never;
  return curId.value;
};
const addEdge = (arr: any, val: any) => {
  let edges = val.arr;
  // 当前点击的连线
  let curEdge = arr.node.options;
  // 找到当前连线的  source targ  -> 新增的节点在这个中间
  let curSource = curEdge.source;
  let curTarget = curEdge.target;
  // 修改旧的节点
  edges.forEach((e: any) => {
    if (e.target == curTarget) {
      e.target = curId.value;
    }
    if (e.source == curTarget) {
      e.source = curTarget;
    }
  });
  let obj = {
    id: `e_${curId.value}`,
    source: curId.value,
    target: curTarget,
    Class: EdgeClass,
  };
  edges.push(obj as never);
  edges.arr = [...new Set(edges)];
  return edges.arr;
};
const addNode = (arr: any) => {
  let obj = {
    id: getId(),
    label: "add",
    x: 0,
    y: 0,
    Class: NodeClassSend,
  };
  nodes.arr.push(obj as never);
  return obj;
};
onMounted(() => {
  let dom = document.getElementById("container");
  let canvas = new Canvas({
    root: dom, //canvas的根节点(必传)
    zoomable: true, //可缩放(可传)
    moveable: true, //可平移(可传)
    draggable: true, //节点可拖动(可传)
  });
  canvas.draw({
    nodes: nodes.arr, //节点信息
    edges: edges.arr,
  });
  canvas.on("system.node.click", (data: any) => {
    console.log(data);
  });
  canvas.on("getAdd", (data: any) => {
    console.log(data);
    canvas.addNode(addNode(data));
    canvas.redraw({
      nodes: nodes.arr,
      edges: addEdge(data, edges),
    });
  });
  canvas.on("getDel", (data: any) => {
    canvas.removeNode(data.delId);
    reNode("single", data.delId, nodes.arr);
    canvas.draw({
      edges: reLink("del", data.delId, edges),
    });
  });
});
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  border: 1px solid #dddddd;
  border-radius: 10px;
  background-color: #eeeeee;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
