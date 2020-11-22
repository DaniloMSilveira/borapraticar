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

export const Area = styled.SafeAreaView`
  flex: 500;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: -30px;
  margin-left: 15px;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 15px 0px 5px;
`;

export const RegisterButton = styled(Button)`
  width: 90%;
  height: 40px;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5px;
  margin-bottom: 10px;
  background: #34cb79;
`;

export const InfoButton = styled(Button)`
  width: 50%;
  height: 30px;
  margin-right: 8px;
`;

export const LeaveButton = styled(Button)`
  width: 50%;
  height: 30px;
  background: #f64c75;
`;

export const PContainer = styled.View`
  margin-bottom: 15px;
  padding: 10px 15px 8px 15px;
  border-radius: 4px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Access = styled.View`
  margin-top: 10px;
`;

export const Info = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const SubTitle = styled.Text`
  font-weight: bold;
  font-size: 17px;
  color: #333;
  margin-top: 5px;
  text-align: center;
`;

export const DescrDate = styled.Text`
  font-size: 14px;
  color: #999;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
`;

export const Descr = styled.Text`
  font-size: 14px;
  text-align: center;
  margin-bottom: 8px;
  font-weight: bold;
`;


export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingRight: 20, paddingLeft: 20, paddingBottom: 20 },
})``;
