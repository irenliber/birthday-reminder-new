import React from 'react';
import useSWR, { mutate } from 'swr';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import colors from '../utils/colors';
import { fetchCards } from '../api/cards';
import Loading from '../components/Loading';

const width = Dimensions.get('window').width;

const getScale = ({ w, h }) => {
  const aspectRatio = w / h;
  const newWidth = width - 40;
  const newHeight = newWidth / aspectRatio;
  return { width: newWidth, height: newHeight };
};

const downloadResumable = (url) =>
  FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + 'image.jpg',
    {}
  );

const CardsScreen = () => {
  const { data } = useSWR('/api/cards', async () => {
    return await fetchCards();
  });
  return (
    <View style={styles.container}>
      {!data && <Loading />}
      <ScrollView style={styles.scrollView}>
        {data &&
          data?.list?.map((el) => {
            const newDimensions = getScale({
              w: el.image.metadata.width,
              h: el.image.metadata.height,
            });
            return (
              <TouchableOpacity
                style={styles.wrapper}
                onPress={async () => {
                  try {
                    await mutate('global_loading', true, false);
                    if (!(await Sharing.isAvailableAsync())) {
                      alert(`Uh oh, sharing isn't available on your platform`);
                      return;
                    }
                    const { uri } = await downloadResumable(
                      el.image.url
                    ).downloadAsync();
                    console.log('Finished downloading to ', uri);
                    await Sharing.shareAsync(uri);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    await mutate('global_loading', false, false);
                    // await showInterstitialAd();
                  }
                }}
                key={el.id}
              >
                <Image
                  style={{
                    ...newDimensions,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                  source={{ uri: el.image.url }}
                  indicator={ProgressBar.Pie}
                  indicatorProps={{
                    size: 80,
                    borderWidth: 0,
                    color: 'rgba(150, 150, 150, 1)',
                    unfilledColor: 'rgba(200, 200, 200, 0.2)',
                  }}
                />
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default CardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingTop: 20,
  },
  wrapper: {
    borderRadius: 10,
    backgroundColor: colors.ultraLight,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
