import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding-bottom: 10px;
`;

export const Menu = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

export const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: -30px;
  margin-left: 25px;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 15px 0px 5px;
`;

export const LeaveButton = styled(Button)`
  width: 100%;
  height: 30px;
  background: #f64c75;
`;

export const PContainer = styled.View`
  margin-bottom: 15px;
  padding: 15px 15px 8px 15px;
  border-radius: 4px;
  background: #fff;
  display: flex;
  justify-content: space-between;
`;

export const Left = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Access = styled.View`
  margin-top: 10px;
`;

export const Info = styled.View`
  margin-left: 20px;
  align-items: center;
  justify-content: center;
`;

export const SubTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
`;

export const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-top: 10px;
`;

export const Descr = styled.Text`
  font-weight: bold;
  font-size: 12px;
  color: #666;
`;

export const Area = styled.SafeAreaView`
  flex: 500;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 20 },
})``;