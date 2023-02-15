import { Node } from "butterfly-dag";
import "./node.scss";

class BaseNode extends Node {
  constructor(opts: { id: any; x: any; y: any }) {
    super(opts);
    this.top = opts.x;
    this.left = opts.y;
    this.options = opts;
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
    let container = $(`
    <div class="end-node">
      <div class='end-node-head'></div>
      <div class='end-node-bottom'>流程结束</div>
    </div>`)
      .css("top", this.top + "px")
      .css("left", this.left + "px")
      .attr("id", (this.id = opts.id));
    return container[0];
  };
}

export default BaseNode;
