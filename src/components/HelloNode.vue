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
  // console.log(nodeInfo.arr);
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
      y: (document.body.clientWidth - 240) / 2,
      type: "init",
      Class: NodeClassInit,
    },
    {
      id: "9999",
      x: 300,
      y: (document.body.clientWidth - 240) / 2,
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
let preNodePool = reactive({ arr: [["1", "9999"]] });
const appCan = ref(null);
const getSite = (val: any) => {
  let num = reactive({
    form: {
      top: "",
      left: "",
    },
  });
  let id = val.id;
  let jId = ref(0);
  judgePool.arr.forEach((e: any) => {
    if (e.opts.indexOf(id) != -1) {
      jId.value = e.linkId;
    }
  });
  nodes.arr.forEach((e: any) => {
    if (e.id == jId.value) {
      num.form.top = e.x;
      num.form.left = e.y;
    }
  });
  return num.form;
};
const getPreSite = (val: any, arr?: any) => {
  // 判读末端高度
  let maxHeight = ref(0);
  maxHeight.value =
    nodes.arr[nodes.arr.length - 2].x > maxHeight.value
      ? nodes.arr[nodes.arr.length - 2].x
      : maxHeight.value;
  if (val == 1) {
    return {
      top: 10,
      left: (document.body.clientWidth - 240) / 2,
    };
  }
  if (val == 9999) {
    return {
      top: maxHeight.value + 500,
      left: (document.body.clientWidth - 240) / 2,
    };
  }
  let num = reactive({
    form: {
      top: 0,
      left: 0,
    },
  });
  let curId = ref("");
  edges.arr.forEach((e: any) => {
    if (e.target == val) {
      curId.value = e.source;
    }
  });

  nodes.arr.forEach((e: any) => {
    if (e.id == curId.value) {
      num.form.top = e.x;
      num.form.left = e.y;
    }
  });
  return num.form;
};
const planSite = (val: any, left: any) => {
  let i = val.length;
  // // 求中位数
  if (i % 2 != 0) {
  } else {
    // 没有中位数
    let flag = i / 2;
    var lArr = val.slice(0, flag);
    var rArr = val.slice(flag, val.length);
  }
  let aArr = {
    lArr: lArr,
    rArr: rArr,
    left: "",
  };
  aArr.left = left;
  return aArr;
};
const getErrNode = (val: any) => {
  for (let i = 0; i < nodes.arr.length; i++) {
    if (nodes.arr[i].id == val) {
      return nodes.arr[i - 1];
    }
  }
};
let dArr = reactive({ a: [] });
const reOrder = () => {
  // 获取父节点的位置
  let nodeW = "240";
  let nodeH = "70";
  let aNodeW = "30";
  let aNodeH = "30";
  let site = "30";
  // 初始位置
  let top = ref(0);
  nodes.arr.forEach((e: any) => {
    // 节点无法衔接
    if (getPreSite(e.id).left == "" ) {
      e.x = getErrNode(e.id).x + Number(aNodeH);
      e.y = getErrNode(e.id).y;
    } else if(getPreSite(e.id).top == ""){
      // e.x = getErrNode(e.id).x;
      // e.y = getErrNode(e.id).y;
      // e.x = 100
    }else {
      e.x = getPreSite(e.id).top;
      e.y = getPreSite(e.id).left;
    }

    if (e.type == "judge") {
      let obj = getSite(e);
      e.x = obj.top;
      e.y = obj.left;
      dArr.a.forEach((e1: any, index: any) => {
        e1.lArr.forEach((e2: any, index: any) => {
          if (e2 == e.id) {
            e.y = Number(e1.left) + (index + 1) * Number(nodeW);
          }
        });
        e1.rArr.forEach((e2: any, index: any) => {
          if (e2 == e.id) {
            e.y = Number(e1.left) - (index + 1) * Number(nodeW);
          }
        });
      });
    } else if (e.type == "judgeMian") {
      e.x = top.value + e.x;
      top.value = Number(nodeH) + Number(aNodeH) + Number(site);
      judgePool.arr.forEach((e1: any) => {
        if (e1.linkId == e.id) {
          dArr.a.push(planSite(e1.opts, e.y) as never);
        }
      });
    } else {
      if (e.id != 9999) {
        e.x = top.value + e.x;
        top.value = Number(nodeH) + Number(aNodeH) + Number(site);
      } else {
        e.x = Number(getPreSite(e.id).top) + Number(aNodeH) + Number(site);
      }
    }
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
    reOrder();
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
    reOrder();
    nodes.arr = nNode;
  }
  if (type == "double") {
    let nNode = reactive([]);
    val.forEach((e: any) => {
      if (id.indexOf(e.id) == -1) {
        nNode.push(e as never);
      }
      if (e.id == "9999") {
        nNode.push(e as never);
      }
    });
    nodes.arr = nNode;
    reOrder();
  }
};
let curId = ref(10);
const getId = () => {
  curId.value = new Date().getTime().toString() as never;
  return curId.value;
};
// 条件分支
const judgePool = reactive({ arr: [] });
const addEdge = () => {
  edges.arr.length = 0;
  let pool = reactive({ arr: [] });
  let data = preNodePool.arr.flat();
  for (let i = 0; i < data.length - 1; i++) {
    let obj = {
      id: `e_${data[i]}`,
      source: data[i],
      target: data[i + 1],
      Class: EdgeClass,
    };
    if (data[i] != "9999") {
      if (data[i].search("_") == -1) {
        pool.arr.push(obj as never);
      } else {
        obj.Class = undefined as never;
        pool.arr.push(obj as never);
      }
    }
  }
  edges.arr = pool.arr;
  return edges.arr;
};
const priority = ref(2);
const poolIndex = ref(0);
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
      label: `条件分支_${(Number(curId.value) + 1).toString().slice(-4)}`,
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
      label: `条件分支_${curId.value.toString().slice(-4)}`,
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
        shapeType: "Flow", //Bezier/Flow/Straight/Manhattan/AdvancedBezier/Bezier2-1/Bezier2-2/Bezier2-3/BrokenLine
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
      canvas.addNode(addNode(data));
      addEdge();
      reOrder();
      canvas.redraw({
        nodes: nodes.arr,
        edges: edges.arr,
      });
    } else {
      canvas.addNode(addNode(data));
      addEdge();
      reOrder();
      canvas.redraw({
        nodes: nodes.arr,
        edges: edges.arr,
      });
    }
  });
  canvas.on("getDelJudge", (data: any) => {
    // 找到当前多分枝的数量
    let jNum = ref();
    let linkId = ref();
    let jArr = reactive({ arr: [] });
    judgePool.arr.forEach((e: any) => {
      if (e.opts.indexOf(data.delId) != -1) {
        jNum.value = e.opts.length;
        linkId.value = e.linkId;
        jArr.arr = e.opts;
      }
    });
    // +++
    // +++ 主分支
    let curPoint = ref();
    let curPointScoure = reactive({ arr: [] });
    let curPointTarget = reactive({ arr: [] });
    let isCen = ref(true);
    // +++
    // 中枢节点
    let curMainPool = reactive({ arr: [] });
    preNodePool.arr.forEach((p: any, pindex: any) => {
      if (p.indexOf(data.delId) != -1) {
        // 该分支下所有的中枢节点
        // 查找delId所属的分支
        if (p[0] == "1") {
          isCen.value = true;
          // **** 情况1 主分支 *****
          p.find(function (val: any, index: any) {
            // 筛选 linkid 在分支的位置
            if (val == linkId.value) {
              curPoint.value = index;
            }
          });
          // 筛选 _ 元素 ｜ 头元素
          curPointScoure.arr = p.slice(0, curPoint.value);
          curPointTarget.arr = p.slice(curPoint.value, p.length);
          curPointTarget.arr.forEach((c: any, cindex: any) => {
            if (c.indexOf("_") != -1) {
              curMainPool.arr.push(c as never);
            }
            jArr.arr.push(c as never);
          });
        } else {
          // 其余分支
          isCen.value = false;
          if (p[0] == linkId.value) {
            // 确定当前分支
            p.forEach((e1: any, index1: any) => {
              // 放入删除池
              jArr.arr.push(e1 as never);
              // _
              if (e1.indexOf("_") != -1) {
                curMainPool.arr.push(e1 as never);
              }
            });
          }
        }
      }
    });
    console.log(preNodePool.arr);
    jArr.arr = [...new Set(jArr.arr)];
    console.log(jArr.arr);
    console.log(curMainPool.arr);
    // 主分支
    if (isCen.value) {
      preNodePool.arr[0] = curPointScoure.arr;
      preNodePool.arr.forEach((p: any, pindex: any) => {
        if (p[0] == linkId.value) {
          p.forEach((e: any, index: any) => {
            if (index > 1) {
              preNodePool.arr[0].push(e);
            }
          });
          preNodePool.arr.splice(pindex, 1);
        }
      });
      jArr.arr = [...new Set(jArr.arr)];
      canvas.removeNode(linkId.value);
      jArr.arr.forEach((e: any) => {
        if (e != "9999") {
          canvas.removeNode(e);
        }
      });
      reNode("double", jArr.arr, nodes.arr);
      canvas.redraw({
        nodes: nodes.arr,
        edges: addEdge(),
      });
    } else {
    }
    console.log("++++");
    console.log(preNodePool.arr);
    console.log(edges.arr);
    console.log(nodes.arr);
    console.log(judgePool.arr);
    console.log("++++");
  });
  canvas.on("getDel", (data: any) => {
    canvas.removeNode(data.delId);
    let arr = preNodePool.arr;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(data.delId) != -1) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] == data.delId) {
            arr[i].splice(j, 1);
          }
        }
      }
    }
    preNodePool.arr = arr;
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
