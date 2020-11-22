import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const ContainerChat = styled.ScrollView`
  flex: 2;
`;

export const Menu = styled.View`
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

export const InputContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: -30px;
  margin-left: 15px;
`;

export const InputText = styled.TextInput`
  border-width: 1px;
  background-color: #fff;
  font-size: 16px;
  padding: 10px;
  height: 50px;
  width: 85%;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingRight: 0, paddingLeft: 0, paddingBottom: 0, paddingLeft: 0 },
})``;
