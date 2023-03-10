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
      `<div class="init-node def"><div class='node-title'>${opts.options.label}</div></div>`
    )
      .css("top", this.top + "px")
      .css("left", this.left + "px")
      .attr("id", (this.id = opts.id));
    let header = $(`<div class='init-node-head def-head'></div>`);
    let header_left = $(
      `<div class='init-node-head-left def-head-left'></div>`
    );
    let header_right = $(
      `<div class='init-node-head-right def-head-right'></div>`
    );

    container.append(header);
    header.append(header_left);
    header.append(header_right);

    header_left.text("所有人");
    header_right.text(">");
    container.on("dblclick", (e) => {
      this.emit("dblclickNode", {
        node: this,
      });
    });
    return container[0];
  };
}

export default BaseNode;
