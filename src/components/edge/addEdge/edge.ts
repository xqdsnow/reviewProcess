import { Edge, Tips } from "butterfly-dag";
import "./edge.scss";
import '@uiw/icons/fonts/w-icon.css';

class addEdge extends Edge {
  constructor(opts: { id: any; x: any; y: any }) {
    super(opts);
    // console.log(this.dom)
    // console.log(opts);
  }
  /**
   * 线段挂载后的回调
   */
  mounted() {
    // Edge.setZIndex (0)
  }
  /**
   * 线段是否能连接的方法
   * @return {boolean} - 返回该线段是否能连接。若返回true，则会生成线段；若返回false，则会把线段销毁。
   */
  // isConnect() {

  // }

  /**
   * 线段的渲染方法
   * @param {obj} data - 线段基本信息
   * @return {dom} - 返回渲染svg dom的根节点
   */
  // draw(obj:any) {
  // }

  /**
   * 箭头的渲染方法
   * @param {string} pathString - 线段path的描绘字符串(path中的d属性)
   * @return {dom} - 返回箭头渲染dom的根节点
   */
  //   drawArrow() {path}

  /**
   * 注释的渲染方法
   * @param {string/dom} label - 注释的内容字符串或者是label的dom
   * @return {dom} - 返回注释渲染dom的根节点
   */
  drawLabel() {
    let addDom = $(
      `<div class="add-node">
        <div class='dom-icon'>
        +
        <div>
      </div>`
    ).css("cursor", "pointer");
    // let icon = addDom.children(".dom-icon");
    // icon.on("click", (e: any) => {
    //   this.emit("getAdd", {
    //     node: this,
    //   });
    // });
    let handelDom = $(`
    <div class="handelDom">
        <div class="review"><i class="w-icon-user"></i> 审 核 人</div>
        <div class="send"><i class="w-icon-link"></i> 抄 送 人</div>
        <div class="judge"><i class="w-icon-asterisk"></i> 条件分支</div>
    </div>`);
    //给文本添加气泡
    Tips.createTip({
      className: `butterfly-custom-tips`,
      targetDom: addDom[0],
      genTipDom: () => {
        return handelDom[0];
      },
      placement: "right",
    });
    let reviewHandel = $(handelDom.children("")[0]);
    let sendHandel = $(handelDom.children("")[1]);
    let judgeHandel = $(handelDom.children("")[2]);
    let that = this
    let objApi = function(val:any){
      return {
        node: that,
        type:val
      }
    }
    reviewHandel.on("click", (e: any) => {
      $(handelDom[0]).hide();
      this.emit("getAdd",objApi('review'))
    });
    sendHandel.on("click", (e: any) => {
      $(handelDom[0]).hide();
      this.emit("getAdd",objApi('send'))
    });
    judgeHandel.on("click", (e: any) => {
      $(handelDom[0]).hide();
      this.emit("getAdd",objApi('judge'))
    });
    // this.emit("getAdd", {
    //   node: this,
    //   type: "send",
    // });
    return addDom[0];
  }

  /**
   * 自定义计算线段路径方法
   * @param {object} sourcePoint - 来源点的坐标及线段出线的方向
   * @param {object} targetPoint - 目标点的坐标及线段入线的方向
   * @return {string} - 返回线段path的描绘字符串(path中的d属性)
   */
  //   calcPath(sourcePoint, targetPoint) {}
}

export default addEdge;
