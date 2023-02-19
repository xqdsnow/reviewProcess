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
import { Canvas, Edge } from "butterfly-dag";
import "butterfly-dag/dist/index.css";

import NodeClassInit from "./node/nodeInit/node";
import NodeClassReview from "./node/nodeReview/node";
import NodeClassSend from "./node/nodeSend/node";
import NodeClassJudgeAdd from "./node/nodeJudgeAdd/node";
import NodeClassJudge from "./node/nodeJudge/node";
import NodeClassEnd from "./node/nodeEnd/node";
import EdgeClass from "./edge/addEdge/edge";
import { ja } from "element-plus/es/locale";

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
// 单节点
const inputId = ref();
let nodes = reactive({
  arr: [
    {
      id: "1",
      label: "发起人",
      x: 0,
      y: 100,
      type: "init",
      Class: NodeClassInit,
    },
    {
      id: "9999",
      x: 300,
      y: 100,
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
      target: "9999",
      Class: EdgeClass,
    },
  ],
});

const appCan = ref(null);
const reOrder = (val: any) => {
  let top = 0;
  let left = 100;
  let data = val == null ? nodes.arr : val;
  let judgeSite = { x: "", y: "" };
  data.forEach((e: any) => {
    if (e.type != "judge") {
      e.x = top;
      e.y = left;
      top = Number(top) + 180;
    }
    if (e.priority == 1 && e.type == "judge") {
      e.x = top;
      e.y = left;
      top = Number(top) + 180;
      judgeSite = getJudgeOneSite(e);
    }
    if (
      e.priority != 1 &&
      e.type == "judge" &&
      e.id == judgePool.arr[judgePool.arr.length - 1].opts[0]
    ) {
      e.x = judgeSite.x;
      e.y = judgeSite.y + 300 * judgePool.arr.length;
    }
  });
};
const reLink = (type: any, id: any, val: any) => {
  // console.log(id);
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
// 条件分支
const judgePool = reactive({ arr: [] });
const edgepool = reactive({});
const addEdge = (arr: any, val: any, type: any) => {
  let pool = reactive({arr:[]});
  let data = preNodePool.arr.flat();
  for (let i = 0; i < data.length - 1; i++) {
    console.log("++++");
    console.log(data[i]);
    if (data[i] != "9999") {
      if (data[i].search("_") == -1) {
        let obj = {
          id: `e_${data[i]}`,
          source: data[i],
          target: data[i + 1],
          Class: EdgeClass,
        };
        pool.arr.push(obj as never)
        // console.log(obj);
      } else {
        let obj = {
          id: `e_${data[i]}`,
          source: data[i],
          target: data[i + 1],
        };
        pool.arr.push(obj as never)
      }
    }
  }
  edges.arr = pool.arr;
  return edges.arr;
};
const priority = ref(2);
const poolIndex = ref(0);

let preNodePool = reactive({ arr: [["1", "9999"]] });
const addNode = (arr: any) => {
  getId();
  let nodeId = curId.value;
  let preNodeId = arr.node.sourceNode.id;
  let judgeMainId = `${poolIndex.value}_${poolIndex.value}`;
  if (arr.type == "judge") {
    // 生成条件分支
    let jArr = ref([]);
    jArr.value = [
      judgeMainId as never,
      (curId.value + 1) as never,
      "9999" as never,
    ];
    preNodePool.arr.push(jArr.value as never);
  }
  preNodePool.arr.forEach((e: any, index: any) => {
    e.forEach((e1: any, index1: any) => {
      if (e1 == preNodeId) {
        preNodePool.arr[index].splice(index1 + 1, 0, nodeId as never);
        if (arr.type == "judge") {
          preNodePool.arr[index].splice(index1 + 1, 0, judgeMainId as never);
        }
      }
    });
  });

  console.log(preNodePool.arr);
  // let obj = {};
  // let preNodeId = arr.node.sourceNode.id;
  // let judgeMainId = `${poolIndex.value}_${poolIndex.value}`;
  // preNodePool.arr.forEach((e: any, index: any) => {
  //   if (e == preNodeId) {
  //     preNodePool.arr.splice(index + 1, 0, curId.value as never);
  //     if (arr.type == "judge") {
  //       preNodePool.arr.splice(index + 1, 0, judgeMainId as never);
  //     }
  //   }
  // });
  // preNodePoolF.arr.forEach((e: any, index: any) => {
  //   if (e == preNodeId) {
  //     preNodePoolF.arr.splice(index + 1, 0, (curId.value + 1) as never);
  //     if (arr.type == "judge") {
  //       preNodePoolF.arr.splice(index + 1, 0, judgeMainId as never);
  //     }
  //   }
  // });
  // if (arr.type == "judge") {
  //   if (JSON.stringify(judgeNodePool.child) === "{}") {
  //     obj = {
  //       id: poolIndex.value,
  //       linkId: `${poolIndex.value}_${poolIndex.value}`,
  //       opts: [preNodePool, preNodePoolF],
  //       child: {},
  //     };
  //     judgeNodePool.child = obj;
  //   } else {
  //     setPrePool(judgeNodePool.child);
  //   }
  // }
  // console.log(preNodePool.arr);
  // console.log(preNodePoolF.arr);
  // // console.log(judgeNodePool.child);

  let indexId = arr.node.targetNode.id;
  for (let i = 0; i < nodes.arr.length; i++) {
    if (indexId == nodes.arr[i].id) {
      inputId.value = i;
    }
  }
  if (arr.type == "review") {
    let obj = {
      id: curId.value,
      label: `审核人_${curId.value.toString().slice(-4)}`,
      x: 0,
      y: 0,
      Class: NodeClassReview,
    };
    nodes.arr.splice(inputId.value, 0, obj as never);
    return nodes.arr;
  }
  if (arr.type == "send") {
    let obj = {
      id: curId.value,
      label: `抄送人_${curId.value.toString().slice(-4)}`,
      x: 0,
      y: 0,
      Class: NodeClassSend,
    };
    nodes.arr.splice(inputId.value, 0, obj as never);
    return nodes.arr;
  }
  if (arr.type == "judge") {
    let pool = {
      id: poolIndex.value,
      opts: [],
      linkId: "",
    };
    pool.linkId = `${poolIndex.value}_${poolIndex.value}`;
    let obj = {
      id: curId.value + 1,
      label: `条件分支_${priority.value}`,
      priority: priority.value,
      priorityTitle: `优先级_${priority.value}`,
      x: 0,
      y: 0,
      type: "judge",
      Class: NodeClassJudge,
    };
    pool.opts.push((curId.value + 1) as never);
    nodes.arr.splice(inputId.value, 0, obj as never);
    --priority.value;
    let obj1 = {
      id: curId.value,
      label: `条件分支_${priority.value}`,
      priority: priority.value,
      priorityTitle: `优先级_${priority.value}`,
      x: 0,
      y: 0,
      type: "judge",
      Class: NodeClassJudge,
    };
    pool.opts.push(curId.value as never);
    nodes.arr.splice(inputId.value, 0, obj1 as never);
    judgePool.arr.push(pool as never);
    priority.value = 2;
    return nodes.arr;
  }
};
const addNodeJudge = (arr: any) => {
  let index = ++poolIndex.value;
  let linkId = `${index}_${index}`;
  let indexId = arr.node.targetNode.id;
  let valueId = ref(0);
  for (let i = 0; i < nodes.arr.length; i++) {
    if (indexId == nodes.arr[i].id) {
      valueId.value = i;
    }
  }
  let obj = {
    Class: NodeClassJudgeAdd,
    id: linkId,
    type: "judgeMian",
  };
  nodes.arr.splice(valueId.value, 0, obj as never);
  return nodes.arr;
};
const getJudgeOneSite = (val: any) => {
  return {
    x: val.x,
    y: val.y,
  };
};
const reLinkJudge = (val: any) => {
  let linkName = `e_${poolIndex.value}_${poolIndex.value}`;
  let linkInfo = val.node.options;
  let linkId = linkInfo.id;
  let linkS = ref();
  let linkT = ref();
  edges.arr.forEach((e: any) => {
    if (e.id == linkId) {
      linkS.value = e.source;
      linkT.value = e.target;
    }
  });
  edges.arr.forEach((e: any) => {
    if (e.source == linkS.value) {
      e.target = `${poolIndex.value}_${poolIndex.value}`;
    }
    if (e.target == linkT.value) {
      e.source = linkId;
    }
  });
  let obj = {
    id: linkName,
    source: `${poolIndex.value}_${poolIndex.value}`,
    target: linkT.value,
    Class: EdgeClass,
  };
  edges.arr.push(obj);
};

onMounted(() => {
  let dom = document.getElementById("container");
  let canvas = new Canvas({
    root: dom, //canvas的根节点(必传)
    zoomable: true, //可缩放(可传)
    moveable: true, //可平移(可传)
    draggable: true, //节点可拖动(可传)
    theme: {
      //主题
      edge: {
        arrow: true,
        shapeType: "AdvancedBezier", //Manhattan
        hasRadius: true,
        arrowPosition: 0.6,
        arrowOffset: 20,
      },
    },
  });
  canvas.draw({
    nodes: nodes.arr, //节点信息
    edges: edges.arr,
  });
  canvas.on("getAdd", (data: any) => {
    if (data.type == "judge") {
      canvas.addNode(addNodeJudge(data));
      reOrder(null);
      canvas.addNode(addNode(data));
      reOrder(null);
      reLinkJudge(data);
      canvas.redraw({
        nodes: nodes.arr,
        edges: addEdge(data, edges, data.type),
      });
    } else {
      canvas.addNode(addNode(data));
      reOrder(null);
      canvas.redraw({
        nodes: nodes.arr,
        edges: addEdge(data, edges, null),
      });
    }
  });
  canvas.on("getDelJudge", (data: any) => {
    // console.log(data)
    // canvas.removeNode(data.delId);
    canvas.removeNode(data.delId);
    reNode("single", data.delId, nodes.arr);
    canvas.redraw({
      nodes: nodes.arr,
      edges: reLink("del", data.delId, edges),
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
