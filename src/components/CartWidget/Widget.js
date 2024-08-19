export default class Widget {
  constructor(template, parentNode) {
    this.node = template;
    this.parentNode = parentNode;
  }

  initWidget() {
    this.parentNode.append(this.node);
  }

  addListener(eventType, selector, callback) {
    const node = this.parentNode.querySelector(selector);
    node.addEventListener(eventType, callback);
  }
}
