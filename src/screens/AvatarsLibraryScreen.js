import React from 'react';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
import useSWR, { mutate } from 'swr';
import ListEmptyComponent from '../components/ListEmptyComponent';
import { fetchAvatars } from '../api/avatars';
import AvatarTile from '../components/AvatarTile';
import colors from '../utils/colors';

const AvatarsLibraryScreen = ({ route }) => {
  const { data } = useSWR('/api/avatars', async () => {
    return await fetchAvatars();
  });

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={!data}
            onRefresh={() => mutate('/api/avatars')}
          />
        }
        keyExtractor={(item) => item.id.toString()}
        data={data && data.list}
        renderItem={({ item, index: itemIndex }) => {
          return (
            <AvatarTile
              key={item.id}
              {...item}
              setAvatarId={route.params.setAvatarId}
              setAvatarUrl={route.params.setAvatarUrl}
              setImage={route.params.setImage}
            />
          );
        }}
        ListEmptyComponent={ListEmptyComponent({ data })}
        ListHeaderComponent={() => <View style={styles.ListHeaderComponent} />}
        ItemSeparatorComponent={({ highlighted }) => (
          <View style={styles.separator}>
            <View style={styles.separatorBorder} />
          </View>
        )}
      />
    </View>
  );
};

export default AvatarsLibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  ListHeaderComponent: {
    height: 20,
  },
  separatorBorder: {
    height: 20,
  },
});
