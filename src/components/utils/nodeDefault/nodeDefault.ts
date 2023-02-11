import {Node} from 'butterfly-dag';
import './nodeDefault.scss';

class BaseNode extends Node {
    constructor(opts: { id: any; x: any; y: any; }) {
        super(opts);
        this.id = opts.id;
        this.top = opts.x;
        this.left = opts.y;
        this.options = opts;
    }
  draw = (opts: { id: any; options: { label: string | number | boolean | ((this: HTMLElement, index: number, text: string) => string | number | boolean); }; }) => {
      let container = $('<div class="fruchterman-node"></div>')
          .css('top', this.top + 'px')
          .css('left', this.left + 'px')
          .attr('id', this.id = opts.id);
      container.text(opts.options.label);
      return container[0];
  }
}

export default BaseNode;
