import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import * as buttonTheme from './theme';

const styles = css`
  width: 140px;
  height: 40px;
  border: 0;
  border-radius: 20px;
  appearance: none;
  color: white;
  cursor: pointer;
  background: ${props => buttonTheme[props.theme]['bg']};
  margin 0 3.5px;
  
  &:hover {
    background: ${props => buttonTheme[props.theme]['bg-hover']};
  }
`;

const StylesButton = styled.button`${styles}`;

const Button = ({ children, theme, onClick }) => {
  return <StylesButton theme={theme}> {children} </StylesButton> 
}

export default Button;