import React, { Component } from 'react';
import classNames from 'classnames';
import { isBlank } from '../utils/string';

export interface ShowMoreProps {
  children: React.ReactChild;
  ellipsisText?: string;
  className?: string;
  ellipsisClassName?: string;
  lines?: number;
  width?: number;
  onAfterChange?: () => void;
  title?: string;
  expandable?: boolean;
}

interface ShowMoreStates {
  isTruncated: boolean;
  hiddenTextElement: boolean;
  previewText: string;
  hiddenText: string;
}

export default class ShowMore extends Component<ShowMoreProps, ShowMoreStates> {
  static defaultProps = {
    children: '',
    ellipsisText: 'Show More',
    lines: 2,
    width: 0,
    expandable: true
  };

  prefixCls: string = 'ab-show-more';
  targetElement: HTMLSpanElement | null;
  textElement: HTMLSpanElement | null;
  setTargetElement = (el: HTMLSpanElement) => (this.targetElement = el);
  setChildrenElement = (el: HTMLSpanElement) => (this.textElement = el);
  canvasContext: CanvasRenderingContext2D;
  timer: any;
  targetWidth: number;

  constructor(props: ShowMoreProps) {
    super(props);
    this.state = {
      isTruncated: true,
      hiddenTextElement: false,
      previewText: '',
      hiddenText: ''
    };
  }

  componentDidMount() {
    const canvas = document.createElement('canvas');
    this.canvasContext = canvas.getContext('2d');
    this.delayCalculate();
  }

  componentDidUpdate(prevProps: ShowMoreProps) {
    if (this.props.children !== prevProps.children || this.props.width !== prevProps.width) {
      // 执行render，并且跳过shouldComponentUpdate
      this.delayCalculate();
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  // 等页面其他元素加载完成，延迟计算宽度
  delayCalculate() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // children显示的时候, DidMount
    if (!this.state.hiddenTextElement) {
      this.timer = setTimeout(() =>
        this.calcTargetWidth(() => {
          if (this.textElement) {
            this.setState({
              hiddenTextElement: true
            });
          }
        })
      );
      return;
    }
    // children隐藏的时候, DidUpdate
    this.timer = setTimeout(() => {
      this.setState(
        {
          hiddenTextElement: false
        },
        () => {
          this.calcTargetWidth(() => {
            if (this.textElement) {
              this.setState({
                hiddenTextElement: true
              });
            }
          });
        }
      );
    });
  }

  onChange = () => {
    if (!this.props.expandable) {
      return;
    }
    this.setRenderText(this.props.onAfterChange, false);
  };

  innerText = (node: HTMLSpanElement) => {
    const div = document.createElement('div');
    const contentKey = 'innerText' in window.HTMLElement.prototype ? 'innerText' : 'textContent';

    div.innerHTML = node.innerHTML.replace(/\r\n|\r|\n/g, ' ');

    let text = div[contentKey];

    const test = document.createElement('div');
    test.innerHTML = 'foo<br/>bar';

    if (test[contentKey].replace(/\r\n|\r/g, '\n') !== 'foo\nbar') {
      div.innerHTML = div.innerHTML.replace(/<br.*?[\/]?>/gi, '\n');
      text = div[contentKey];
    }

    return text;
  };

  calcTargetWidth = (callback?: () => void) => {
    const targetElement = this.targetElement;

    if (!targetElement) {
      return;
    }
    // 需要减去padding值
    const parentNode = targetElement.parentNode as HTMLElement;
    const clientWidth = parentNode.clientWidth;
    const contentPaddingLeft = parseFloat(window.getComputedStyle(parentNode)['padding-left']);
    const contentPaddingRight = parseFloat(window.getComputedStyle(parentNode)['padding-right']);
    this.targetWidth = this.props.width || clientWidth - contentPaddingLeft - contentPaddingRight;

    const style = window.getComputedStyle(targetElement);

    // todo: font-weight放首位在ie下失效
    this.canvasContext.font = [
      style['font-style'],
      style['font-weight'],
      style['font-size'],
      style['font-family']
    ].join(' ');
    this.setRenderText(callback);
  };

  measureWidth = (text: string) => {
    return this.canvasContext.measureText(text).width;
  };

  getLines = (targetWidth: number) => {
    const {
      props: { lines: numLines, ellipsisText, expandable },
      innerText,
      measureWidth,
      prefixCls: cls
    } = this;
    const { ellipsisClassName } = this.props;
    const lines = [];
    // children没显示，无法计算
    if (!this.textElement) {
      return {
        lines,
        hiddenLineStr: ''
      };
    }
    const text = innerText(this.textElement);
    let hiddenLineStr = text;
    // 先按换行符拆分，再按空格拆分成组
    const textLines = text.split('\n').map(line => line.split(' '));

    // 省略号和按钮的宽度
    const ellipsisWidth = measureWidth(ellipsisText) + measureWidth('... ');

    for (let line = 1; line <= numLines; line++) {
      const textWords = textLines[0];

      // 一行中单词显示完了，转到第二行
      if (textWords.length === 0) {
        lines.push();
        textLines.shift();
        line--;
        continue;
      }

      let resultLine: React.ReactChild = textWords.join(' ');

      if (measureWidth(resultLine) <= targetWidth) {
        if (textLines.length === 1) {
          lines.push(resultLine);
          hiddenLineStr = hiddenLineStr.substr(
            hiddenLineStr.indexOf(resultLine),
            resultLine.length
          );
          break;
        }
      }

      // 最后一行时，要加上ellipsisWidth
      if (line === numLines) {
        const textRest = textWords.join(' ');

        let lower = 0;
        let upper = textRest.length - 1;

        while (lower <= upper) {
          const middle = Math.floor((lower + upper) / 2);

          const testLine = textRest.slice(0, middle + 1);

          if (measureWidth(testLine) + ellipsisWidth <= targetWidth) {
            lower = middle + 1;
          } else {
            upper = middle - 1;
          }
        }

        let lastLineText = textRest.slice(0, lower);
        hiddenLineStr = hiddenLineStr.replace(lastLineText, '');
        resultLine = (
          <React.Fragment>
            {`${lastLineText}... `}
            <span
              className={classNames(ellipsisClassName, `${cls}-ellipsis`, {
                [`${cls}-btn`]: expandable
              })}
              onClick={this.onChange}
            >
              {ellipsisText}
            </span>
          </React.Fragment>
        );
      } else {
        let lower = 0;
        let upper = textWords.length - 1;

        while (lower <= upper) {
          const middle = Math.floor((lower + upper) / 2);

          const testLine = textWords.slice(0, middle + 1).join(' ');

          if (measureWidth(testLine) <= targetWidth) {
            lower = middle + 1;
          } else {
            upper = middle - 1;
          }
        }

        // 单词太长，只显示最后一行
        if (lower === 0) {
          line = numLines - 1;
          continue;
        }

        resultLine = textWords.slice(0, lower).join(' ');
        hiddenLineStr = hiddenLineStr.replace(resultLine, '');
        textLines[0].splice(0, lower);
      }
      lines.push(resultLine);
    }

    return { lines, hiddenLineStr };
  };

  renderLine = (line: React.ReactChild, i: number, arr: React.ReactChild[]) => {
    if (i === arr.length - 1) {
      return <React.Fragment key={i}>{line}</React.Fragment>;
    } else {
      const br = <br key={i + 'br'} />;

      if (line) {
        return [<React.Fragment key={i}>{line}</React.Fragment>, br];
      } else {
        return br;
      }
    }
  };

  setRenderText = (callback: () => void, isHidden?: boolean) => {
    const targetWidth = this.targetWidth;
    const { children, lines: numLines } = this.props;
    let previewText;
    let hiddenText;
    const isTruncated = isBlank(isHidden) ? this.state.isTruncated : isHidden;
    if (numLines > 0 && isTruncated && targetWidth) {
      const { lines, hiddenLineStr } = this.getLines(targetWidth);
      previewText = lines.map(this.renderLine);
      hiddenText = hiddenLineStr;
    } else {
      previewText = children;
      hiddenText = '';
    }
    this.setState(
      {
        previewText,
        hiddenText,
        isTruncated
      },
      callback
    );
  };

  render() {
    const { hiddenTextElement, previewText, hiddenText } = this.state;
    const { children, className, title } = this.props;
    const titleParam = title ? { title } : null;
    const cls = this.prefixCls;
    return (
      <React.Fragment>
        <span ref={this.setTargetElement} className={classNames(cls, className)} {...titleParam}>
          {previewText}
          {hiddenText ? <span className={`${cls}-hidden`}>{hiddenText}</span> : null}
        </span>
        {hiddenTextElement ? null : (
          <span ref={this.setChildrenElement} className={`${cls}-text`}>
            {children}
          </span>
        )}
      </React.Fragment>
    );
  }
}
