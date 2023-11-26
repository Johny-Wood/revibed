export class SmoothScroll {
  constructor(window) {
    this.settings = {
      node: window,
      html: document.documentElement,
      target: 0,
      scroll: 0,
    };

    this.rAF = false;

    this.update = this.update.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this.settings.node.addEventListener('wheel', this.onWheel, false);
    this.settings.node.addEventListener('scroll', this.onScroll, false);
  }

  update() {
    this.settings.scroll += (this.settings.target - this.settings.scroll) * 0.1;

    if (Math.abs(this.settings.scroll.toFixed(5) - this.settings.target) <= 0.47131) {
      cancelAnimationFrame(this.rAF);

      this.rAF = false;
    }

    if (window) {
      this.settings.node.scrollTo(0, this.settings.scroll);
    } else {
      this.settings.node.scrollTop = this.settings.scroll;
    }

    if (this.rAF) this.rAF = requestAnimationFrame(this.update);
  }

  onWheel(e) {
    e?.preventDefault();
    e?.stopPropagation();

    const scrollEnd =
      this.settings.node == window
        ? this.settings.html.scrollHeight - this.settings.html.clientHeight
        : this.settings.node.scrollHeight - this.settings.node.clientHeight;

    this.settings.target += e?.wheelDelta > 0 ? -70 : 70;

    if (this.settings.target < 0) this.settings.target = 0;

    if (this.settings.target > scrollEnd) this.settings.target = scrollEnd;

    if (!this.rAF) this.rAF = requestAnimationFrame(this.update);
  }

  onScroll(e) {
    if (this.rAF) return;

    this.settings.target =
      this.settings.node == window ? window.scrollY || this.settings.html.scrollTop : this.settings.node.scrollTop;

    this.settings.scroll = this.settings.target;
  }
}
