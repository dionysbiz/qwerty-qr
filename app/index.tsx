import { Text, View } from "react-native";
var Buffer = require('buffer/').Buffer  // note: the trailing slash is important!
import App from './App'

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';
if (typeof global.ReadableStream === 'undefined') {
    global.ReadableStream = ReadableStream;
}

export default function Index() {
  return (
    <App />
  );
}
