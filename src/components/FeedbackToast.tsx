import React from 'react';
import Toast, { AnyObject, BaseToast, BaseToastProps } from 'react-native-toast-message';

import { ImageSourcePropType } from 'react-native';
import info from '../assets/icons/info.png';
import success from '../assets/icons/success.png';
import error from '../assets/icons/error.png';
import close from '../assets/icons/close.png';

type ToastType = 'success' | 'error' | 'info';

const icons: Record<ToastType | 'close', ImageSourcePropType> = {
  success: success as ImageSourcePropType,
  error: error as ImageSourcePropType,
  info: info as ImageSourcePropType,
  close: close as ImageSourcePropType,
};

const colors: Record<ToastType, string> = {
  success: '#69C779',
  error: '#FE6301',
  info: '#87CEFA',
};

const backgroundColor = '#424242';
const shadow = {
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 2,
};

const ToastBuilder = ({
  type,
  text1,
  text2,
  ...rest
}: BaseToastProps & { type: ToastType }) => (
  <BaseToast
    {...rest}
    style={{ borderLeftColor: colors[type] }}
    contentContainerStyle={{
      backgroundColor,
      paddingLeft: 15,
      paddingRight: 15,
    }}
    leadingIconContainerStyle={{ backgroundColor, ...shadow }}
    trailingIconContainerStyle={{
      backgroundColor,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
      ...shadow,
    }}
    text1Style={{
      color: '#fafafa',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 3,
    }}
    text2Style={{
      color: '#e0e0e0',
      fontSize: 12,
    }}
    leadingIcon={icons[type]}
    trailingIcon={icons.close}
    text1={text1}
    text2={text2}
    onPress={() => Toast.hide()}
    onTrailingIconPress={() => Toast.hide()}
  />
);

const config: AnyObject = {
  info: (props: BaseToastProps) => ToastBuilder({ ...props, type: 'info' }),
  success: (props: BaseToastProps) => ToastBuilder({ ...props, type: 'success' }),
  error: (props: BaseToastProps) => ToastBuilder({ ...props, type: 'error' }),
};

const FeedbackToast = (): React.ReactElement => (
  <Toast
    ref={(ref) => { Toast.setRef(ref); }}
    style={{ elevation: 10 }}
    config={config}
    autoHide
    position="top"
    visibilityTime={4000}
  />
);

export default FeedbackToast;
