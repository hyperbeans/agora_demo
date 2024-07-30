import React, { useEffect, useState } from "react";
import AgoraUIKit, { renderMode } from "agora-rn-uikit";
import {RenderModeType, RtcSurfaceView} from 'react-native-agora';
// import AgoraUIKit from 'agora-rn-uikit';
// {
//   RtcLocalView,
//   RtcRemoteView,
//   AgoraUIKit,
// } 

// RenderModeType, VideoRenderMode , {RenderModeType }
// import {RenderModeType} from 'react-native-agora';
import {
  Text,
  PermissionsAndroid,
  Alert,
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Videocall = ({ navigation }) => {
  const [videoCall, setVideoCall] = useState(false);
  const [buttonsState, setButtonState] = useState("flex");
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [userCount, setUserCount] = useState(1);
  const [isHost, setIsHost] = useState(true);

  // const styleProps = {
  //   // usernameText: { padding: 10, right: 0 },
  //   // localBtnContainer: { display: buttonsState },
  //   // UIKitContainer: {height: '50%', width: '100%'}
  //   // renderMode:VideoRenderMode.Hidden,
  //   // videoMode:"fullscreen"
  // };
  
  
  

  const styleProps = {
    videoMode:{
      max:RenderModeType.RenderModeHidden,
      min:RenderModeType.RenderModeHidden,
    },
    RtcLocalView: 
    {
      containerStyle: styles.localContainer,
      videoStyle: styles.localVideo,
      renderMode: RenderModeType.RenderModeHidden,
    },
    RtcRemoteView: 
{
      containerStyle: styles.remoteContainer,
      videoStyle: styles.remoteVideo,
      renderMode: RenderModeType.RenderModeHidden,
      
    },
    Button: 
{
      buttonStyle: styles.button,
      textStyle: styles.buttonText,
      iconStyle: styles.buttonIcon,
    },
  };

  const props = {
    connectionData: {
      appId: "a233f454a3f64ce19d6b480aaa018a93",
      channel: "agoratest",
      layout: 0,
      displayUsername: true,
      username: "vikash",
      role: isHost ? 1 : 2,
    },
    rtcCallbacks: {
      EndCall: () => {
        setVideoCall(false);
        setRemoteUsers([]);
      },

      UserJoined: (uid, elapsed) => {
        setRemoteUsers((prevUsers) => [...prevUsers, { uid, role: 2 }]);
        setUserCount((prevCount) => prevCount + 1);
      },
      UserOffline: (uid, reason) => {
        setRemoteUsers((prevUsers) =>
          prevUsers.filter((user) => user.uid !== uid)
        );
        setUserCount((prevCount) => prevCount - 1);
      },
    },
  };


  useEffect(() => {
    console.log('Remote Users:', remoteUsers);
    console.log('Filtered Users:', filteredRemoteUsers);
  }, [remoteUsers]);

  const filteredRemoteUsers = isHost
    ? remoteUsers.filter((user) => user.role !== 2).map((user) => user.uid)
    : remoteUsers.map((user) => user.uid);

  return videoCall ? (
    // <SafeAreaView style={styles.max}>
    <View style=
{styles.container}>
      <AgoraUIKit
        connectionData={props.connectionData}
        rtcCallbacks={props.rtcCallbacks}
        styleProps={styleProps}
        videoPlaceholderProps={{ showButtons: false }}
        remoteUsers={filteredRemoteUsers}
      />
      <Text style={styles.userCountText}>Connected Users: {userCount}</Text>
      </View>
    // </SafeAreaView>
  ) : (
    <>
      <Text
        style={styles.startCallText}
        onPress={() => {
          setVideoCall(true);
          setUserCount(1);
        }}
      >
        Start Call
      </Text>

      <Text
        style={styles.LiveStreamText}
        onPress={() => navigation.navigate("Livestream")}
      >
        {" "}
        Live Stream
      </Text>

      <Text
        style={styles.rtcStreamText}
        onPress={() => navigation.navigate("Rtc")}
      >
        {" "}
        RTC Stream
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },

  fullView: {
    width: width,
    height: height,
  },
  fullView1: {
    width: width,
    height: height,
  },
  userCountText: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "white",
    fontSize: 16,
  },
  startCallText: {
    marginTop: "10%",
    textAlign: "center",
  },
  LiveStreamText: {
    marginTop: "10%",
    textAlign: "center",
  },
  rtcStreamText: {
    marginTop: "10%",
    textAlign: "center",
  },
  container: 
{
    flex: 1,
    backgroundColor: '#fff',
  },
  localContainer: 
{
    position: 'absolute',
    top: 10,
    left: 10,
    width: 100,
    height: 150,
    borderWidth: 1,
    borderColor: 'black',
  },
  localVideo: 
{
    width: '100%',
    height: '100%',
  },
  remoteContainer: 
{
    flex: 1,
  },
  remoteVideo: 
{
    width: '100%',
    height: '100%',
  },
  button: 
{
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: 
{
    color: '#fff',
    fontSize: 16,
  },
  buttonIcon: 
{
    color: '#fff',
  },
});

export default Videocall;
