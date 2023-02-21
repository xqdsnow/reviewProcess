import { Node,Tips } from "butterfly-dag";
import "./node.scss";
import "./../sty/style.scss";

import '@uiw/icons/fonts/w-icon.css';

class BaseNode extends Node {
  constructor(opts: { id: any; x: any; y: any }) {
    super(opts);
    this.id = opts.id;
    this.top = opts.x;
    this.left = opts.y;
    this.options = opts;
  }
  mounted() {

  }
  draw = (opts: {
    id: any;
    options: {
      label:
        | string
        | number
        | boolean
        | ((
            this: HTMLElement,
            index: number,
            text: string
          ) => string | number | boolean);
    };
  }) => {
    let container = $(`<div class="judgeNodeMain def">
    <div class='judgeNodeMain-container'>
    <i class="w-icon-plus-circle-o"></i>
    <p class='judgeNodeMain-title'>添加条件</p>
    </div>
    </div>`)
      .css("top", this.top + "px")
      .css("left", this.left + "px")
      .attr("id", (this.id = opts.id));
  
    container.on("click", (e) => {
      this.emit("judgeAdd", {
        node: this,
      });
    });
    let handelDom = $(`
    <div class="handelDom-judge">
        添加同级条件判断
    </div>`);
    let containerChild = container.children('')[0]
    Tips.createTip({
      targetDom: containerChild,
      genTipDom: () => {
        return handelDom[0];
      },
      placement: "bottom",
    });
    return container[0];
  };
}

export default BaseNode;

