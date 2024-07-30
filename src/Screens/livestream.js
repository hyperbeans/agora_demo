
import React, { useEffect, useState } from "react";
import AgoraUIKit, { ClientRoleType }  from "agora-rn-uikit";
// RenderModeType, VideoRenderMode , {RenderModeType }
// import {RenderModeType} from 'react-native-agora';
import { Text, PermissionsAndroid, Alert, SafeAreaView, View ,StyleSheet,Dimensions} from "react-native";

const { width, height } = Dimensions.get('window');




const Livestream = ({navigation}) => {
  const [videoCall, setVideoCall] = useState(false);
  const [buttonsState, setButtonState] = useState("flex");

  const [userCount, setUserCount] = useState(1);
  

  

  const styleProps = {
    usernameText: { padding: 10, right: 0 },
    localBtnContainer: { display: buttonsState },
  };
  



  const props = {
    connectionData: {
      appId: "a233f454a3f64ce19d6b480aaa018a93",
      channel: "agoratest",
      layout: 0,
      displayUsername: true,
      username : "vikash",
      role:2,
      
    },
    rtcCallbacks: {
      EndCall: () => setVideoCall(false),
      UserJoined: (uid, elapsed) => setUserCount(prevCount => prevCount + 1),
      UserOffline: (uid, reason) => setUserCount(prevCount => prevCount - 1),
    },
  };

  return videoCall ? (
    <SafeAreaView style={styles.max}>
      
      <AgoraUIKit
        connectionData={props.connectionData}
        rtcCallbacks={props.rtcCallbacks}
        styleProps={styleProps}
        videoPlaceholderProps={{ showButtons: false }}
      />
       <Text style={styles.userCountText}>Connected Users: {userCount}</Text>
      </SafeAreaView >

  ) : (<>
    <Text style={styles.startCallText} onPress={() => {setVideoCall(true); setUserCount(1)}}>
      Stream 
    </Text>

<Text style={styles.LiveStreamText} onPress={() => navigation.navigate("Videocall") } > Host call</Text></>
  );
};





const styles =  StyleSheet.create({
  max: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',
  },
  
  fullView: {
    width: width,
    height: height ,
  },
  fullView1: {
    width: width,
    height: height,
  },
  userCountText: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: 'white',
    fontSize: 16,
  },
  startCallText: {
            marginTop: "10%",
            textAlign: 'center',
          },
  LiveStreamText: {
            marginTop: "10%",
            textAlign: 'center',
          },
  
});






export default Livestream;


 // "bundleIdentifier": "com.vikashhyperbeans.testagoracall"
