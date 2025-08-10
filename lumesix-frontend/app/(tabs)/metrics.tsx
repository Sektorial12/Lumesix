import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { mockHistory } from '@/constants/MockData';
import { FlatList, StyleSheet, View } from 'react-native';

const ChartPlaceholder = () => {
  const barColor = Colors.text;
  return (
    <ThemedView style={[styles.chartCard, { backgroundColor: Colors.card, borderColor: Colors.cardStroke }]}>
      <View style={styles.chartBars}>
        <View style={[styles.bar, { height: '50%', backgroundColor: barColor }]} />
        <View style={[styles.bar, { height: '70%', backgroundColor: barColor }]} />
        <View style={[styles.bar, { height: '40%', backgroundColor: barColor }]} />
        <View style={[styles.bar, { height: '90%', backgroundColor: Colors.pastel.orange }]} />
        <View style={[styles.bar, { height: '60%', backgroundColor: barColor }]} />
        <View style={[styles.bar, { height: '30%', backgroundColor: barColor }]} />
      </View>
    </ThemedView>
  );
};

export default function MetricsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ChartPlaceholder />

      <ThemedView style={[styles.expensesCard, { backgroundColor: Colors.card, borderColor: Colors.cardStroke }]}>
        <ThemedText>Expenses</ThemedText>
        <ThemedText type="subtitle">-$1240.40</ThemedText>
      </ThemedView>

      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">History</ThemedText>
        <ThemedText type="link">View all</ThemedText>
      </View>

      <FlatList
        data={mockHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={[styles.historyItem, { backgroundColor: item.color }]}>
            <ThemedText style={styles.historyText}>{item.name}</ThemedText>
            <ThemedText style={styles.historyAmount}>${item.amount.toFixed(2)}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  chartCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    height: 200,
    borderWidth: 1,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 8,
  },
  expensesCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
  },
  historyText: {
    fontWeight: 'bold',
  },
  historyAmount: {
    fontWeight: 'bold',
  },
});
