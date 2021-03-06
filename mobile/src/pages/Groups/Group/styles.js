import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const MyGroup = styled.SafeAreaView`
  flex: 1;
  margin-top: -240px;
`;

export const Menu = styled.View`
  flex: 1;
  flex-direction: row;
  margin-top: 30px;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  margin-top: -230px;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: 30px;
`;

export const Subtitle = styled.Text`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: 30px;
`;

export const RegisterButton = styled(Button)`
  width: 120px;
  height: 45px;
`;

export const SearchButton = styled(Button)`
  width: 120px;
  height: 45px;
  background: #34cb79;
`;

export const GInfoButton = styled(Button)`
  width: 100%;
  height: 30px;
`;

export const GContainer = styled.View`
  margin-bottom: 15px;
  padding: 15px 15px 8px 15px;
  border-radius: 4px;
  background: #fff;
  display: flex;
  justify-content: space-between;
`;

export const GLeft = styled.View`
  display: flex;
  flex-direction: row;
`;

export const GAccess = styled.View`
  margin-top: 10px;
`;

export const GInfo = styled.View`
  margin-left: 15px;
`;

export const GTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
`;

export const GName = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-top: 1px;
`;

export const GDescr = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #999;
`;

export const GAvatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-top: 10px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 30 },
})``;