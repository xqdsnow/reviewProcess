<template>
  <div ref="appCan" id="container" class="container"></div>
  <el-dialog v-model="dialogVisible" :title="title" width="30%">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { Canvas } from "butterfly-dag";
import "butterfly-dag/dist/index.css";

import NodeClassInit from "./node/nodeInit/node";
import NodeClassReview from "./node/nodeReview/node";
import NodeClassSend from "./node/nodeSend/node";
import NodeClassJudgeAdd from "./node/nodeJudgeAdd/node";
import NodeClassJudge from "./node/nodeJudge/node";
import NodeClassEnd from "./node/nodeEnd/node";
import EdgeClass from "./edge/addEdge/edge";

const dialogVisible = ref(false);
const nodeInfo = reactive({ arr: [] });
const title = ref();
const setInfo = () => {
  title.value = `${nodeInfo.arr?.options.label}-节点数据设置`;
};
const handleCancel = () => {
  dialogVisible.value = false;
};
const confirm = () => {
  console.log(nodeInfo.arr);
  // handleCancel();
};
// 条件分支
const judgePool = reactive({ arr: [] });

// 单节点
const inputId = ref();
let nodes = reactive({
  arr: [
    {
      id: "1",
      label: "发起人",
      x: 0,
      y: 500,
      type: "init",
      Class: NodeClassInit,
    },
    {
      id: "2",
      label: "审核人",
      type: "review",
      x: 180,
      y: 500,
      Class: NodeClassReview,
    },
    {
      id: "3",
      label: "抄送人",
      type: "send",
      x: 360,
      y: 500,
      Class: NodeClassSend,
    },
    {
      id: "4_1",
      label: "条件分支",
      type: "judge",
      x: 540,
      y: 500,
      Class: NodeClassJudgeAdd,
    },
    {
      id: "4",
      label: "条件分支",
      type: "judge",
      priority: 1,
      priorityTitle:'优先级一1',
      x: 720,
      y: 500,
      Class: NodeClassJudge,
    },
    {
      id: "9999",
      x: 900,
      y: 500,
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
      target: "4_1",
      Class: EdgeClass,
    },
    {
      id: "e4",
      source: "4_1",
      target: "4",
      Class: EdgeClass,
    },
    {
      id: "e5",
      source: "4",
      target: "9999",
      Class: EdgeClass,
    },
  ],
});

const appCan = ref(null);
const reOrder = (val: any) => {
  let top = 0;
  let left = 500;
  let data = val == null ? nodes.arr : val;
  data.forEach((e: any) => {
    e.x = top;
    e.y = left;
    top = Number(top) + 180;
  });
};
const reLink = (type: any, id: any, val: any) => {
  if (type == "del") {
    let arr = val.arr;
    // 需要删除的节点 上下文节点
    let source = ref(null);
    let target = ref(null);
    arr.forEach((e: any, index: number) => {
      if (e.source == id) {
        arr.splice(index, 1);
        source.value = e.source;
        target.value = e.target;
      }
    });
    arr.forEach((e: any) => {
      if (e.target == id) {
        e.target = target.value;
      }
    });
    // edges 重新赋值
    edges.arr = arr;
    reOrder(null);
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
    reOrder(nNode);
    nodes.arr = nNode;
  }
};

let curId = ref(10);
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
  let indexId = arr.node.targetNode.id;
  for (let i = 0; i < nodes.arr.length; i++) {
    if (indexId == nodes.arr[i].id) {
      inputId.value = i;
    }
  }
  if (arr.type == "review") {
    let obj = {
      id: getId(),
      label: `审核人_${curId.value}`,
      x: 0,
      y: 0,
      Class: NodeClassReview,
    };
    nodes.arr.splice(inputId.value, 0, obj as never);
    return nodes.arr;
  }
  if (arr.type == "send") {
    let obj = {
      id: getId(),
      label: `抄送人_${curId.value}`,
      x: 0,
      y: 0,
      Class: NodeClassSend,
    };
    nodes.arr.splice(inputId.value, 0, obj as never);
    return nodes.arr;
  }
  if (arr.type == "judge") {
    let obj = {
      id: getId(),
      label: `条件分支_${curId.value}`,
      x: 0,
      y: 0,
      Class: NodeClassJudge,
    };
    nodes.arr.splice(inputId.value, 0, obj as never);
    return nodes.arr;
  }
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

  canvas.on("getAdd", (data: any) => {
    canvas.addNode(addNode(data));
    reOrder(null);
    canvas.redraw({
      nodes: nodes.arr,
      edges: addEdge(data, edges),
    });
  });
  canvas.on("getDel", (data: any) => {
    canvas.removeNode(data.delId);
    reNode("single", data.delId, nodes.arr);
    canvas.redraw({
      nodes: nodes.arr,
      edges: reLink("del", data.delId, edges),
    });
  });
  canvas.on("dblclickNode", (data: any) => {
    nodeInfo.arr = data.node;
    setInfo();
    dialogVisible.value = true;
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
