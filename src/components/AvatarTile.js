import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import colors from '../utils/colors';

const AvatarTile = (params) => {
  const navigation = useNavigation();
  console.log(params);
  const {
    id,
    image: { url },
    setAvatarId,
    setAvatarUrl,
    setImage,
  } = params;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setAvatarId(id);
          setAvatarUrl(url);
          setImage(null);
          navigation.goBack();
        }}
      >
        <Image
          style={styles.avatar}
          indicator={ProgressBar.Pie}
          indicatorProps={{
            size: 80,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          source={{ uri: url }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AvatarTile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    overflow: 'hidden',
    height: 160,
    width: 160,
    borderRadius: 100,
    backgroundColor: colors.ultraLight,
  },
});
