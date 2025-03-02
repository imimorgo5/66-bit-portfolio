import React from 'react';


export default class Button extends React.Component {
  render = () => (
    <button className='button'>{this.props.text}</button>
  );
}

Button.defaultProps = {
    text: 'Кнопка'
}
