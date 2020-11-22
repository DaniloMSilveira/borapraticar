import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const InfoContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: -40px;
`;

export const DetailsContainer = styled.View`
`;

export const DescrContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 15px 0px 5px;
`;

export const PanelContainer = styled.View`
  background-color: rgba(0,0,0,0.4);
  margin: 10px 30px 0px 30px;
  padding: 8px 5px 8px 5px;
`;

export const PartContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const ButtonsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const PartUsersContainer = styled.View`
  margin-left: 15px;
`;

export const Avatar = styled.Image`
  width: 120px;
  height: 110px;
  border-radius: 60px;
  margin-top: 10px;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: 15px;
  margin-bottom: 5px;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-bottom: 1px;
`;

export const DescrTitle = styled.Text`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-bottom: 5px;
`;

export const Descr = styled.Text`
  font-size: 16px;
  color: #d1d1d1;
  font-weight: bold;
  align-self: center;
  text-align: center;
`;

export const RegisterButton = styled(Button)`
  margin: 10px 10px 0px 10px;
`;

export const SearchButton = styled(Button)`
  margin: 10px;
  background: #34cb79;
`;

export const GRemoveButton = styled(Button)`
  margin: 10px;
  background: #f64c75;
`;

export const List = styled.FlatList.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { padding: 30 },
  })``;