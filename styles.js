import styled from 'styled-components/native';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #F4F7FA; 
`;

export const ScrollWrapper = styled.ScrollView`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  margin-top: 10px;
`;

export const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #ddd;
`;

export const WelcomeText = styled.Text`
  font-size: 24px;
  margin-left: 15px;
  color: #4a148c;
`;

export const SearchBar = styled.View`
  flex-direction: row;
  width: 90%; 
  height: 40px;
  align-self: center; 
  background-color: #EAEAEA; 
  border-width: 1px;
  border-color: #E0E0E0;
  border-radius: 25px; 
  padding: 0px 16px; 
  align-items: center;
  margin-bottom: 20px;
  gap: 8px; 
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #401A65;
  font-family: 'Inter-Regular'; 
`;

export const SectionTitle = styled.Text`
  font-size: 25px;
  font-weight: 800;
  font-family: 'Inter_800ExtraBold';
  margin-left: 20px;
  margin-bottom: 15px;
  color: #401A65;
`;

export const CardContainer = styled.TouchableOpacity`
  width: 193px;
  height: 153px;
  margin-right: 15px;
`;

export const BackgroundImage = styled.ImageBackground.attrs({
  imageStyle: { borderRadius: 26 },
  opacity: 0.6 
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const CardTitle = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`;


export const TabBar = styled.View`
  position: absolute;
  bottom: 25px; 
  align-self: center; 
  flex-direction: row;
  background-color: #FF9100;
  width: 90%; 
  height: 65px;
  border-radius: 35px;
  justify-content: space-around;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  elevation: 5;
`;

export const TabItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const TabText = styled.Text`
  color: white;
  font-size: 10px;
  font-family: 'Inter-Regular';
  margin-top: 2px;
`;
