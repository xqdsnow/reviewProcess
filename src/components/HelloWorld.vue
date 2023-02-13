<template>
  <div ref="appCan" id="container" class="container"></div>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="30%"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessageBox } from 'element-plus'

import { Canvas, Node } from "butterfly-dag";
import "butterfly-dag/dist/index.css";

import NodeClassInit from "./node/nodeInit/node";
import NodeClassReview from "./node/nodeReview/node";
import NodeClassSend from "./node/nodeSend/node";
import NodeClassEnd from "./node/nodeEnd/node";
import EdgeClass from "./edge/addEdge/edge";


const dialogVisible = ref(false)
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const appCan = ref(null);
onMounted(() => {
  let dom = document.getElementById("container");
  let nodes = [
    {
      id: "1",
      label: "发起人",
      x: 0,
      y: 300,
      type:'init',
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
    ,{
      id:'4',
      x: 500,
      y: 415,
      type:'end',
      Class: NodeClassEnd
    },
  ];
  let edges = [
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
    dialogVisible.value = true
  });
  canvas.on("getDel", (data: any) => {
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
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
