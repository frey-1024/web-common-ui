import React from 'react';
import { boolean, number, text } from '@storybook/addon-knobs';
import README from './README.md';
import Carousel from 'src/carousel/index.tsx';
import 'src/carousel/style/index.js';
import './style.scss';

class CarouselData extends React.Component {
  onNext = () => {
    this.carouselEl.next();
  };
  onPrev = () => {
    this.carouselEl.prev();
  };
  render() {
    return (
      <div className="demo-carousel">
        <Carousel {...this.props} ref={el => (this.carouselEl = el)}>
          <p style={{ backgroundColor: '#0fcc40' }}>1111113333333333331111</p>
          <p style={{ backgroundColor: '#ccc' }}>222222</p>
          <p style={{ backgroundColor: '#ccc422' }}>3333333</p>
          <p style={{ backgroundColor: '#32a3cc' }}>4444444</p>
          <p style={{ backgroundColor: '#cc2097' }}>55555555</p>
        </Carousel>
        <button onClick={this.onPrev}>prev</button>
        <button onClick={this.onNext}>next</button>
      </div>
    );
  }
}

export default function CarouselDemo() {
  return (
    <CarouselData
      controllable={boolean('controllable(只有在移动端才有效果)', true)}
      autoplay={boolean('autoplay', true)}
      fadeEffect={boolean('fadeEffect', false)}
      delay={number('delay', 5000)}
      sensitivity={number('sensitivity', 30)}
      height={text('height', '')}
    />
  );
}

export const carouselDoc = README;
