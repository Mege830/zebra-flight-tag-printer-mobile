import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { FlightSummary } from '@/types/flightSummary';

interface FlightCardProps {
  flight: FlightSummary;
  onPress: () => void;
}

export function FlightCard({ flight, onPress }: FlightCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{flight.flightNumber}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {flight.airline} • {flight.status}
          </ThemedText>
        </View>

        <View style={styles.row}>
          <ThemedText type="smallBold">Kalkış</ThemedText>
          <ThemedText type="small">{flight.departureCity}</ThemedText>
        </View>

        <View style={styles.row}>
          <ThemedText type="smallBold">Varış</ThemedText>
          <ThemedText type="small">{flight.arrivalCity}</ThemedText>
        </View>

        <View style={styles.footer}>
           <ThemedText type="smallBold">Ücret</ThemedText>
           <ThemedText type="small">{flight.priceAmount} {flight.priceCurrency}</ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  header: {
    marginBottom: 10,
  },
  row: {
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
