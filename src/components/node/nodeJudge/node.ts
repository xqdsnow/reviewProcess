import { Node } from "butterfly-dag";
import "./node.scss";
import "./../sty/style.scss";
import "@uiw/icons/fonts/w-icon.css";

class BaseNode extends Node {
  constructor(opts: { id: any; x: any; y: any }) {
    super(opts);
    this.id = opts.id;
    this.top = opts.x;
    this.left = opts.y;
    this.options = opts;
  }
  mounted() {}
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
    let container = $(
      `<div class="judge-node def"><div class='node-title'><i class="w-icon-asterisk"></i>${opts.options.label}</div></div>`
    )
      .css("top", this.top + "px")
      .css("left", this.left + "px")
      .attr("id", (this.id = opts.id));
    let del = $(
      `<div class="del-node"><i class="w-icon-circle-close"></i></div>`
    );
    let header = $(`<div class='judge-node-head def-head'></div>`);
    let header_left = $(
      `<div class='judge-node-head-left def-head-left'></div>`
    );
    let header_right = $(
      `<div class='judge-node-head-right def-head-right'>${opts.options.priorityTitle}</div>`
    );
    container.append(header);

    container.append(del);
    header.append(header_left);
    header.append(header_right);

    header_left.text("所有人");
    del.on("click", (e) => {
      this.emit("getDelJudge", {
        nodedel: this,
        delId: this.id,
      });
    });
    container.on("dblclick", (e) => {
      this.emit("dblclickNode", {
        node: this,
        indexOf:this.id
      });
    });
    return container[0];
  };
}

export default BaseNode;
