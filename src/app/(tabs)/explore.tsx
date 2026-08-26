import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFlightsStore } from '@/store/flightStore';
import { FlightCard } from '@/components/flight-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function FlightsScreen() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();
  const { flights, loading, error, fetchFlights } = useFlightsStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFlights();
  }, [isAuthenticated]);

  const handleSelectFlight = (flightId: string) => {
  console.log('>>> handleSelectFlight called with:', flightId);
  router.push(`/flight/${flightId}`);
};

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Uçuşlar</ThemedText>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <ThemedText type="smallBold">Çıkış</ThemedText>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#208AEF" style={styles.loader} />
      ) : error ? (
        <ThemedText type="small" themeColor="textSecondary">
          {error}
        </ThemedText>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <FlightCard flight={item} onPress={() => handleSelectFlight(item.id)} />
          )}
          ListEmptyComponent={
            <ThemedText type="small" themeColor="textSecondary">
              Mevcut uçuş bulunamadı.
            </ThemedText>
          }
        />
      )}
    </ThemedView>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  logoutButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: '#E5E7EB',
  },
  loader: {
    marginTop: Spacing.six,
  },
  list: {
    paddingBottom: Spacing.four,
  },
  separator: {
    height: Spacing.four,
  },
});
