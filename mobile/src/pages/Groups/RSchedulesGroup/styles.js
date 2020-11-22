import { Platform } from 'react-native';
import styled from 'styled-components';

import Input from '~/components/Input';
import Button from '~/components/Button';
import Picker from '~/components/Picker';
import DateInput from '~/components/DateInput';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
`;

export const Form = styled.View`
  align-self: stretch;
  margin-top: 50px;
`;

export const ContainerHours = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ContainerHour = styled.View`
  width: 48%;
`;

export const FormInput = styled(Input)`
`;

export const DateInputForm = styled(DateInput)`
`;

export const FormInputTextArea = styled(Input)`
  margin-bottom: 10px;
  height: 150px;
`;

export const Dropdown = styled(Picker)`
  margin-bottom: 10px;
`;

export const SubmitButton = styled(Button)`
  margin-top: 10px;
`;

export const RegisterButton = styled(Button)`
  background: #34cb79;
`;

export const BackButton = styled(Button)`
  margin-top: 10px;
  background: #f64c75;
`;

export const SignLink = styled.TouchableOpacity`
  margin-top: 20px;
`;

export const SignLinkText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export const LabelDate = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0;
`;

export const Title = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 20px;
`;

