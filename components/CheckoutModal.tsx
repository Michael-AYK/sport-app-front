import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';


interface CheckoutModalProps {
  displayCheckoutModal: boolean;
  setDisplayCheckoutModal: React.Dispatch<React.SetStateAction<boolean>>;
  paymentUrl: string;
  webviewRef: React.RefObject<WebView>;
  handleWebViewNavigationStateChange: (nativeEvent: any) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  displayCheckoutModal,
  setDisplayCheckoutModal,
  paymentUrl,
  webviewRef,
  handleWebViewNavigationStateChange,
}) => {
  return (
    <Modal transparent visible={displayCheckoutModal} >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 8, width: '90%', height: 500 }}>
          <Pressable onPress={() => setDisplayCheckoutModal(false)} style={{
            position: 'absolute',
            right: 5,
            top: 5,
            padding: 15,
            zIndex: 1,
            opacity: 0
          }}>
            <AntDesign name="close" size={20} color="#d22" />
          </Pressable>
          <WebView
            ref={webviewRef}
            source={{ uri: paymentUrl }}
            style={{ opacity: .99 }}
            onLoadEnd={handleWebViewNavigationStateChange}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CheckoutModal;
