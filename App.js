import axios from 'axios';
import React, {useState} from 'react';
import {Button, Image, ProgressBarAndroid, SafeAreaView} from 'react-native';
const check = require('./src/Assets/check.jpeg');
import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import Upload from 'react-native-background-upload';

const App = () => {
  //
  const [count, setCount] = useState(0);

  const nextLibUpload = () => {
    ImagePicker.openPicker({
      width: 570,
      height: 250,
      cropping: false,
      multiple: true,
      mediaType: 'video',
    }).then(image => {
      const options = {
        url: 'https://www.shareslate.com/apis/timeline/uploadTest.php',
        path: image[0].path.replace('file://', ''),
        method: 'POST',
        field: 'uploaded_media',
        type: 'multipart',
        // maxRetries: 2, // set retry count (Android only). Default 2
        headers: {
          'content-type': 'application/octet-stream', // Customize content-type
          'my-custom-header': 's3headervalueorwhateveryouneed',
        },
        // Below are options only supported on Android
        notification: {
          enabled: true,
        },
        useUtf8Charset: true,
      };

      Upload.startUpload(options)
        .then(uploadId => {
          console.log('Upload started');

          Upload.addListener('progress', uploadId, data => {
            console.log(`Progress: ${data.progress}%`);
            setCount(data.progress / 100);
          });
          Upload.addListener('error', uploadId, data => {
            console.log(`Error: ${data.error}`);
          });
          Upload.addListener('cancelled', uploadId, data => {
            console.log(`Cancelled!`);
          });
          Upload.addListener('completed', uploadId, data => {
            // data includes responseCode: number and responseBody: Object
            console.log('Completed!');
          });
        })
        .catch(err => {
          console.log('Upload error!', err);
        });
    });
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'space-around', paddingVertical: 100}}>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={count}
        style={{marginVertical: 12}}
      />

      <Button title="nextLibUpload" onPress={() => nextLibUpload()} />
    </SafeAreaView>
  );
};

export default App;
