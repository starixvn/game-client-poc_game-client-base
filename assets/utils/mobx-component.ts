// tslint:disable: variable-name
import mobx from "mobx";
import * as cc from "cc";
const { autorun, reaction } = mobx;

export class MobxComponent extends cc.Component {
  protected __disposer: mobx.IReactionDisposer[] = [];
  protected __reaction?: string[];
  protected __autorun?: string[];
  protected componentName: string;

  protected addAutoRun(actions: string[]) {
    this.__autorun = this.__autorun ?? [];
    this.__autorun.push(...actions);
  }
  /**
   * 开始ob
   */
  public _observe() {
    // console.log("_observe", {
    //   __disposer: this.__disposer,
    //   __autorun: this.__autorun,
    //   __reaction: this.__reaction,
    // });
    const __disposer = this.__disposer;
    if (__disposer.length) {
      return;
    }
    const __autorun = this.__autorun;
    const __reaction = this.__reaction;
    if (__autorun) {
      //console.log("__autorun", { __autorun });
      __autorun.forEach((fn: string) => {
        if (!fn || fn === "") {
          console.log({ __autorun, fn });
          return;
        }

        const view = (this as any)[fn].bind(this);
        const disposer = autorun(view, { name: this.componentName + "#" + fn });
        __disposer.push(disposer);
      });
    }
    if (__reaction) {
      //console.log("__reaction", { __reaction });
      __reaction.forEach((fn) => {
        if (!fn || fn === "") {
          console.log({ __reaction, fn });
          return;
        }

        const disposer = (this as any)[fn]();
        __disposer.push(disposer);
      });
    }
  }
  /**
   * 结束ob
   */
  public _dispose() {
    const __disposer = this.__disposer;
    if (__disposer.length) {
      __disposer.splice(0).forEach((x) => x());
    }
  }
  public onLoad() {
    super.onLoad && super.onLoad();
    this._observe();
  }
  public onDestroy() {
    this._dispose();
    if (super.onDestroy) {
      super.onDestroy();
    }
  }
}
