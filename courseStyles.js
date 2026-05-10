import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #F4F7FA;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  margin-top: 10px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #EAEAEA;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

export const ScreenTitle = styled.Text`
  font-family: 'Inter-Medium'; 
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;
  letter-spacing: 0.2px;
  color: #401A65;
  flex: 1;
`;

export const ContentScroll = styled.ScrollView`
  flex: 1;
  padding-horizontal: 25px;
`;

export const ImageContainer = styled.View`
  align-items: center;
  margin-top: 30px; 
  margin-bottom: 30px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  elevation: 5;
`;

export const CourseImage = styled.Image`
  width: 318px;
  height: 159px;
  border-radius: 16px; 
`;

export const SectionTitle = styled.Text`
  font-family: 'Inter-SemiBold';
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0.2px;
  color: #401A65;
  margin-bottom: 10px;
`;

export const DescriptionText = styled.Text`
  font-family: 'Inter-Regular';
  font-size: 14px;
  line-height: 20px;
  color: #757575;
  margin-bottom: 25px;
`;

export const ButtonWrapper = styled.View`
  align-items: center;
  padding-bottom: 40px;
  padding-top: 20px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  width: 280px;
  height: 56px;
  background-color: #FF9100;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  shadow-color: #000000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 4;
`;

export const ButtonText = styled.Text`
  font-family: 'Inter-Bold';
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  letter-spacing: -0.26px;
  color: #F5F5F5;
`;