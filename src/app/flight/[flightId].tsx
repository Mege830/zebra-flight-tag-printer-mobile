import { useEffect } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useBaggageStore } from '@/store/baggageStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function FlightDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isAuthenticated } = useAuthStore();
  const {
    detail,
    loading,
    error,
    zplData,
    barcodeLoading,
    barcodeError,
    printLoading,
    printError,
    fetchBaggageDetail,
    printBarcode,
    reset,
  } = useBaggageStore();

  const flightId = params.flightId as string | undefined;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(tabs)');
      return;
    }

    if (!flightId) {
      return;
    }

    fetchBaggageDetail(flightId);

    return () => reset();
  }, [isAuthenticated, flightId]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {!flightId ? (
          <ThemedText type="small" themeColor="textSecondary">
            Uçuş id bulunamadı.
          </ThemedText>
        ) : loading ? (
          <ActivityIndicator size="large" color="#208AEF" style={styles.loader} />
        ) : error ? (
          <ThemedText type="small" themeColor="textSecondary">
            {error}
          </ThemedText>
        ) : detail ? (
          <View style={styles.card}>
            <ThemedText type="subtitle">{detail.flightNumber}</ThemedText>
            <ThemedText type="smallBold">Havayolu: {detail.airline}</ThemedText>
            <ThemedText type="small">Uçuş ID: {detail.flightId}</ThemedText>
            <ThemedText type="small">Baggage ID: {detail.baggage_id ?? 'Yok'}</ThemedText>

            <ThemedText type="smallBold" style={styles.sectionTitle}>Bagaj Politikası</ThemedText>
            <View style={styles.allowance}>
              <ThemedText type="smallBold">Kabin bagajı:</ThemedText>
              <ThemedText type="small">{detail.baggagePolicy.cabinBaggageAllowance}</ThemedText>
            </View>
            <View style={styles.allowance}>
              <ThemedText type="smallBold">Bagaj (kargo):</ThemedText>
              <ThemedText type="small">{detail.baggagePolicy.checkedBaggageAllowance}</ThemedText>
            </View>
            <ThemedText type="small">Ekstra bagaj ücreti: {detail.baggagePolicy.extraFeePerKg}</ThemedText>
            <ThemedText type="small">Özel kurallar: {detail.baggagePolicy.specialRules}</ThemedText>

            {detail.baggage_id ? (
  <View style={styles.barcodeSection}>
    <Button
      title={printLoading ? 'Yazdırılıyor...' : 'Yazıcıya Gönder'}
      onPress={printBarcode}
      disabled={printLoading}
    />

    {printError ? (
      <ThemedText type="small" themeColor="textSecondary">
        {printError}
      </ThemedText>
    ) : null}
    
    {zplData ? (
      <ThemedText type="small" themeColor="textSecondary">
        ZPL Hazır.
      </ThemedText>
    ) : null}
  </View>
) : null}
          </View>
        ) : (
          <ThemedText type="small">Detay bulunamadı.</ThemedText>
        )}
      </ScrollView>
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
  content: {
    gap: Spacing.four,
  },
  loader: {
    marginTop: Spacing.six,
  },
  card: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#F0F0F3',
  },
  sectionTitle: {
    marginTop: Spacing.three,
  },
  allowance: {
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  barcodeSection: {
    gap: Spacing.two,
  },
});