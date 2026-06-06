import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PurpleBackground = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.topBg || '#5A189A'};
`;

export const TopSection = styled.View`
  align-items: center;
  padding-horizontal: 25px;
  padding-bottom: 30px;
  padding-top: 10px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props) => props.backBtnBg || '#EAEAEA'};
  justify-content: center;
  align-items: center;
`;

export const EditProfileText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-family: 'Inter-Medium';
  text-decoration-line: underline;
`;

export const ProfileImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-top: 20px;
`;

export const UserName = styled.Text`
  font-family: 'Inter-Medium';
  font-weight: 500;
  font-size: 30px;
  line-height: 40px;
  letter-spacing: 0.2px;
  color: #ffffff;
  margin-top: 15px;
`;

export const BottomSection = styled.View`
  flex: 1;
  background-color: ${(props) => props.bg || '#F4F7FA'};
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  padding: 35px 30px;
`;

export const SettingsTitle = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 24px;
  color: ${(props) => props.titleColor || '#401A65'};
  margin-bottom: 30px;
`;

export const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;

export const IconWrapper = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  background-color: ${(props) => props.bgColor || '#5A189A'};
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

export const MenuText = styled.Text`
  font-family: 'Inter-SemiBold';
  font-weight: 600;
  font-size: 22px;
  color: ${(props) => props.textColor || '#401A65'};
  flex: 1;
`;

export const MenuStatus = styled.Text`
  font-family: 'Inter-SemiBold';
  font-size: 16px;
  color: ${(props) => props.statusColor || '#1A1A1A3D'};
  margin-right: 10px;
`;
