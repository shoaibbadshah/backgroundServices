import axios from 'axios';
import React, {useState} from 'react';
import {
  Button,
  Image,
  ProgressBarAndroid,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Progressbar from './src/Progressbar';
const check = require('./src/Assets/check.jpeg');
import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

const App = () => {
  //
  const token = 'bf4d4a6c471b2d4787be2e4f549a4e15';
  const [count, setCount] = useState(0);
  const [img, setImg] = useState(null);

  // ========================================================================
  const uploadfromgallery = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response.assets[0].fileName));
        setImg({
          //   uri: check | image?.uri,
          //   type: 'image/jpeg' | image?.type,
          //   name: 'check.jpeg' | image.name,

          // filePath: response,
          // fileData: response.data,
          // fileUri: response.uri,
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        });
        // backgroundTasks({
        //   uri: response.assets[0].uri,
        //   type: response.assets[0].type,
        //   name: response.assets[0].fileName,
        // });
      }
    });
  };
  // console.log('state image', img);

  // ========================================================================

  const _UploadMedia = async image => {
    console.log('myimage', image);
    try {
      // console.log({image});
      let formData = new FormData();
      formData.append('token', token);

      formData.append('file', image, {
        uri: image.path,
        type: image.mime,
        name: image?.filename || `${Date.now()}.jpg`,
      });

      console.log('myformData', formData);

      const response = await axios({
        url: 'https://www.shareslate.com/apis/timeline/uploadTest.php',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // const response = await axios.post(
      //   'https://www.shareslate.com/apis/timeline/uploadTest.php',
      //   formData,
      // );
      console.log('responseDataafter', response?.data);
      if (response.status === 200) {
        // setPostID(response.data.postId);
        console.log('response.data.postId', response.data);
        return response.data.postId;
      } else {
        alert('An error has occurred');
        return;
      }
    } catch (error) {
      console.log('trycatch', error.message);
      alert('An error has occurred');
      return;
    }
  };

  const backgroundTasks = async () => {
    const sleep = time =>
      new Promise(resolve => setTimeout(() => resolve(), time));

    const veryIntensiveTask = async taskDataArguments => {
      // _UploadMedia(img);
      const {delay} = taskDataArguments;
      // console.log('this is myDeley', delay);

      await new Promise(async resolve => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          await BackgroundService.updateNotification({
            progressBar: {
              max: 1000,
              value: i,
            },
          });
          console.log('first', i);
          setCount(i / 1000);

          await sleep(delay);
          if (i == 1000) {
            await BackgroundService.stop();
          }
        }
      });
    };

    const bgOptions = {
      taskName: 'Example',
      taskTitle: 'ExampleTask title',
      taskDesc: 'ExampleTask description',
      progressBar: {max: 1000, indeterminate: false},
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane',
      parameters: {
        delay: 10,
      },
    };

    await BackgroundService.start(veryIntensiveTask, bgOptions);
    await BackgroundService.updateNotification({
      taskDesc: 'New ExampleTask description',
    });
  };

  const clickToOpen = () => {
    ImagePicker.openPicker({
      width: 570,
      height: 250,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      setImg({
        uri: image.path,
        type: image.mime,
        name: image?.filename || `${Date.now()}.jpg`,
      });
      console.log('final', image);
    });
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'space-around', paddingVertical: 100}}>
      {/* <Button title="upload from gallery" onPress={() => uploadfromgallery()} /> */}
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={count}
        style={{marginVertical: 12}}
      />
      <Button title="background Tasks" onPress={() => backgroundTasks()} />
      {/* <Button title="uploadMedia API call" onPress={() => _UploadMedia(img)} /> */}
      <Button title="cropper" onPress={() => clickToOpen()} />

      {img && (
        <Image source={{uri: img.uri}} style={{width: 200, height: 200}} />
      )}
    </SafeAreaView>
  );
};

export default App;
