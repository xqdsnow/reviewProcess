import { Edge } from "butterfly-dag";
import "./edge.scss";

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
    // console.log(this.dom)
    $(this.dom).on("click", (e) => {
      this.emit("system.link.click", {
        edge: this,
      });
      // console.log(e)
    });
  }
  /**
   * 线段是否能连接的方法
   * @return {boolean} - 返回该线段是否能连接。若返回true，则会生成线段；若返回false，则会把线段销毁。
   */
  //   isConnect() {}

  /**
   * 线段的渲染方法
   * @param {obj} data - 线段基本信息
   * @return {dom} - 返回渲染svg dom的根节点
   */
  //   draw(obj) {}

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
    let addDom = $(`<div class="add-node"></div>`);
    let addDomIcon = $(`<div class='dom-icon'><div>`);
    addDom.append(addDomIcon);
    addDomIcon.text("+");
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
