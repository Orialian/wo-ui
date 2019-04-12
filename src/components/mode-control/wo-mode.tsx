import { Component, Prop, Event, EventEmitter, Method } from "@stencil/core";

interface Mode {
  name: string,
  selected: boolean
}

@Component({
  tag: "wo-mode",
  styleUrl: "index.less",
  shadow: true
})
export class ModeControl {

  /**
   *选中时的文字颜色
   */
  @Prop() activeColor: string = '';

  /**
   *选中时的背景颜色
   */
  @Prop() activeBackground: string = '';

  /**
   *未选中时的文字颜色
   */
  @Prop() color: string = '';

  /**
   *未选中时的背景颜色
   */
  @Prop() background: string = '';

  /**
   *模式数组
   */
  @Prop({ mutable: true, reflectToAttr: true })
  lists: Array<Mode> = [];

  /**
   *对外提供当前模式数据
   */
  @Event()
  change: EventEmitter;
  showModeHandler(item, index) {
    if (item.selected) return;
    this.setMode(item);
    this.change.emit({
      current: item,
      index: index,
      all: this.lists
    });
  }

  /**
   * 设置当前的模式
   * @param item 
   */
  @Method()
  setMode(item) {
    this.lists = this.lists.map(it => {
      it.selected = false;
      return it;
    });
    item.selected = true;
  }

  /**
   * 数据校验
   */
  componentWillLoad() {
    let count = 0;
    this.lists.forEach(item => {
      count = item.selected ? count + 1 : count;
    });
    if (count > 1) {
      throw `'lists' 的成员最多只能有一个 selected 为 true`;
    }
  }

  render() {
    return (
      <div class="wo-mode">
        {this.lists.map((item, index) => {
          if (item.selected) {
            return (<span
              class='wo-mode__item active'
              style={{ 'color': this.activeColor, 'background-color': this.activeBackground }}
            >
              {item.name}
            </span>)
          } else {
            return (<span
              class='wo-mode__item'
              onClick={() => this.showModeHandler(item, index)}
              style={{ 'color': this.color, 'background-color': this.background }}
            >
              {item.name}
            </span>)
          }
        })}
      </div>
    );
  }
}
