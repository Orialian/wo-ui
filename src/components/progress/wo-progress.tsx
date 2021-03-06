import {
  Component,
  Prop,
  Method,
  Element,
  Event,
  EventEmitter
} from "@stencil/core";

@Component({
  tag: "wo-progress",
  styleUrl: "index.less",
  shadow: true
})
export class ProgressControl {
  /**
   * 最大值
   */
  @Prop() max: number = 100;

  /**
   * 最小值
   */
  @Prop() min: number = 0;

  /**
   * 是否置灰
   */
  @Prop() inactive: boolean = false;

  /**
   * 传入的值
   */
  @Prop({ mutable: true, reflectToAttr: true }) value: number = this.min;

  /**
   * 字颜色
   */
  @Prop() color: string = '';

  /**
   * 圆颜色
   */
  @Prop() circleColor: string = '';

  /**
   * 是否显示百分比
   */
  @Prop({ mutable: true }) percent: boolean = true;

  /**
   * 进度条激活状态颜色
   */
  @Prop() activeColor: string;

  /**
   * 进度条默认状态颜色
   */
  @Prop() inactiveColor: string;

  private width: number;
  private leftWidth: number;
  // private timeout: any;

  // 获取组件元素
  @Element()
  el: HTMLElement;

  // 外传事件
  @Event()
  change: EventEmitter;

  // 调整圆环位置
  @Method()
  getCirclePos(e) {
    // let _this = this
    // if(_this.inactive) return
    // clearTimeout(_this.timeout);
    // let l = e.touches[0].clientX - _this.leftWidth - 3;
    // _this.timeout = setTimeout(function () {
    //   _this.calculateValue(l);
    // }, 50);  

    if(this.inactive) return ;
    let l = e.touches[0].clientX - this.leftWidth - 3;
    this.calculateValue(l);
  }

  // 圆环移动结束
  @Method()
  touchEventEnd() {
    if(this.inactive) return
    this.change.emit({ value: this.value});
  }

  // 点击进度条
  @Method()
  clickMode(e) {
    if(this.inactive) return
    let l = e.x - this.leftWidth;
    this.calculateValue(l);
    this.change.emit({ value: this.value});
  }

  // 计算值和百分比
  @Method()
  calculateValue(left) {
    let x = parseInt(((left / this.width) * this.max).toFixed(0));
    this.value = x;
    if (x <= this.min) {
      this.value = this.min;
    } else if (x >= this.max) {
      this.value = this.max;
    }
  }

  // 初始化进度条宽度 和 左边空白条长度
  componentDidLoad() {
    // this.width = this.el.getBoundingClientRect().width;
    let currentEl = this.el.shadowRoot.querySelector('.wo-progress--content').getBoundingClientRect()
    this.width = currentEl.width;
    this.leftWidth = currentEl.left
    // this.leftWidth = document.body.clientWidth * 0.25 + 25;
    if (this.percent) {
      this.percent = this.max === 100;
    }
  }

  // 数据校验
  componentWillLoad() {
    if (this.value < this.min) {
      throw "传入的value 不能小于 min";
    }
  }

  render() {
    return (
      <div class="wo-progress" style={{filter: `grayscale(${this.inactive?1:0})`}} >
        <p class="wo-progress--content" onClick={e => this.clickMode(e)} style={{backgroundColor:this.inactiveColor}}>
          <span class="wo-progress__value" style={{color:this.color}}>
            {this.value} {this.percent ? "%" : ""}
          </span>
          <span 
            class="wo-progress__circle"
            onTouchStart={e => this.getCirclePos(e)}
            style={{ 
              left: (this.value / this.max) * 100 + "%",
              backgroundColor: this.circleColor ? this.circleColor : this.color
            }}
            onTouchMove={e => this.getCirclePos(e)}
            onTouchEnd={() => this.touchEventEnd()}
          />
          <span
            class="wo-progress__mode"
            style={{ width: (this.value / this.max) * 100 + "%", background: this.activeColor }}
          />
        </p>
      </div>
    );
  }
}
