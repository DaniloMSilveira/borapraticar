import { Platform } from 'react-native';
import styled from 'styled-components';

import Input from '~/components/Input';
import Button from '~/components/Button';
import Picker from '~/components/Picker';
import DateInput from '~/components/DateInput';

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px 30px;
`;

export const Form = styled.ScrollView`
  flex: 2;
`;

export const FormInput = styled(Input)`
  margin-bottom: 10px;
`;

export const FormInputTextArea = styled(Input)`
  margin-bottom: 10px;
  height: 80px;
`;

export const Dropdown = styled(Picker)`
  margin-bottom: 10px;
`;

export const SubmitButton = styled(Button)`
  margin-top: 5px;
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

export const Title = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
`;

export const AvatarContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
`;

export const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

export const ButtonChose = styled(Button)`
  margin-top: 10px;
  background: #34cb79;
`;

export const RegisterButton = styled(Button)`
  margin-top: 10px;
  background: #34cb79;
`;

export const LabelDate = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0;
`;

export const DateInputForm = styled(DateInput)`
`;

export const ContainerHours = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ContainerHour = styled.View`
  width: 48%;
`;



