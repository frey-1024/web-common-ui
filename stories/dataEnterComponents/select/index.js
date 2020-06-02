import React from 'react';
import { boolean, select, text } from '@storybook/addon-knobs';
import README from './README.md';
import Select from 'src/select';
import 'src/select/style';
import './style.scss';

class SelectData extends React.Component {
  options = [
    {
      name: 2009,
      value: 2009
    },
    {
      name: 2010,
      value: 2010
    },
    {
      name: 2011,
      value: 2011
    },
    {
      name: 2012,
      value: 2012
    },
    {
      name: 2013,
      value: 2013
    },
    {
      name: 2014,
      value: 2014
    },
    {
      name: 2015,
      value: 2015
    },
    {
      name: 2016,
      value: 2016
    }
  ];
  constructor(props) {
    super(props);
    this.state = {
      selectYearValue: ''
    };
  }

  isMobile = false;
  onCloseModal = () => {
    this.setState({
      visible: false
    });
  };
  onSelectYear = item => {
    this.setState({
      selectYearValue: item.value
    });
  };
  render() {
    const { selectYearValue } = this.state;
    return (
      <div className="select-demo">
        <Select
          {...this.props}
          className={`select-group`}
          options={this.options}
          value={selectYearValue}
          onChange={this.onSelectYear}
        />
      </div>
    );
  }
}

export default function SelectDemo() {
  return (
    <SelectData
      columnCount={select('columnCount', [1, 2, 3, 4], 2)}
      placement={select(
        'placement',
        ['bottomLeft', 'topLeft', 'bottomRight', 'topRight'],
        'bottomLeft'
      )}
      hiddenIcon={boolean('hiddenIcon', false)}
      isMinRootWidth={boolean('isMinRootWidth', true)}
      placeholder={text('placeholder', 'Select Year')}
    />
  );
}

export const selectDoc = README;
