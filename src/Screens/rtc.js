
import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ClientRole,
  ChannelProfile,
} from 'react-native-agora';

const appId = 'a233f454a3f64ce19d6b480aaa018a93';
const channelName = 'agoratest';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHost: true,
      joinSucceed: false,
      peerIds: [],
    };

    if (Platform.OS === 'android') {
      this.requestCameraAndAudioPermission();
    }
  }

  async componentDidMount() {
    await this.initAgora();
  }

  requestCameraAndAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the cameras & mic');
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  initAgora = async () => {
    this._engine = await RtcEngine.create(appId);
    await this._engine.enableVideo();

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      this.setState({ peerIds: [...this.state.peerIds, uid] });
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      this.setState({
        peerIds: this.state.peerIds.filter((id) => id !== uid),
      });
    });

    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      this.setState({ joinSucceed: true });
    });

    await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await this._engine.setClientRole(
      this.state.isHost ? ClientRole.Broadcaster : ClientRole.Audience
    );

    await this._engine.joinChannel( channelName, null, 0);
  };

  render() {
    return (
      <View style={styles.max}>
        {this.state.joinSucceed ? (
          <View style={styles.max}>
            {this.state.isHost && (
              <RtcLocalView.SurfaceView
                style={styles.max}
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
              />
            )}
            {this._renderRemoteVideos()}
          </View>
        ) : (
          <Text>Joining...</Text>
        )}
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            onPress={this._leaveChannel}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Leave Channel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderRemoteVideos = () => {
    const { peerIds } = this.state;
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal={true}
      >
        {peerIds.map((uid) => (
          <RtcRemoteView.SurfaceView
            style={styles.remote}
            key={uid}
            uid={uid}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
          />
        ))}
      </ScrollView>
    );
  };

  _leaveChannel = async () => {
    await this._engine.leaveChannel();
    this.setState({ peerIds: [], joinSucceed: false });
  };
}

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  remoteContainer: {
    width: dimensions.width,
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 120,
    height: 120,
    marginHorizontal: 2.5,
  },
});

export default App;
