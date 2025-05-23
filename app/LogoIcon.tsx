import * as React from "react";
import { Image, StyleSheet } from "react-native";

export default function SvgComponent(props: any) {
  return (
    <Image 
      source={require('../assets/images/ifiage.png')} 
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    resizeMode: 'contain'
  }
});
