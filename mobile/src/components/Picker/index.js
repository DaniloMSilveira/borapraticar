import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Container, TDrop, TitlePicker, ContainerTwo } from './styles';
import { Title } from '~/pages/SignIn/styles';

function Picker({ style, icon, ...rest }, ref) {
  return (
    <Container style={style}>
      {icon && <Icon name={icon} size={20} color="rgba(255,255,255,0.6)" />}
      <TDrop {...rest} ref={ref} />
    </Container>
  );
}

Picker.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Picker.defaultProps = {
  style: {},
  icon: null,
};

export default forwardRef(Picker);
