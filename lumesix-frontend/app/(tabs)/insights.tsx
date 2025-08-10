import { StyleSheet, View, FlatList } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { mockInsights } from '@/constants/MockData';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

const getInsightTypeMetadata = (type: string) => {
  switch (type) {
    case 'churn_prediction':
      return { icon: 'trending.down', color: Colors.pastel.orange };
    case 'price_optimization':
      return { icon: 'currency.usd', color: Colors.pastel.green };
    case 'cohort_analysis':
      return { icon: 'person.3.fill', color: Colors.pastel.blue };
    case 'seasonal_pattern':
      return { icon: 'calendar', color: Colors.pastel.purple };
    default:
      return { icon: 'lightbulb.fill', color: Colors.pastel.yellow };
  }
};

const InsightCard = ({ insight }: { insight: typeof mockInsights[0] }) => {
  const metadata = getInsightTypeMetadata(insight.type);

  return (
    <ThemedView style={[styles.insightCard, { backgroundColor: Colors.card, borderColor: Colors.cardStroke }]}>
      <View style={styles.insightHeader}>
        <IconSymbol name={metadata.icon as any} size={20} color={metadata.color} />
        <ThemedText type="defaultSemiBold" style={{ color: Colors.text, marginLeft: 8 }}>
          {insight.title}
        </ThemedText>
      </View>
      <ThemedText style={{ color: Colors.text }}>{insight.description}</ThemedText>
      <ThemedText style={[styles.insightAction, { color: Colors.text }]}>{`Action: ${insight.recommendedAction}`}</ThemedText>
    </ThemedView>
  );
};

export default function InsightsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={[styles.title, { color: Colors.text }]}>AI Insights</ThemedText>
      <FlatList
        data={mockInsights}
        renderItem={({ item }) => <InsightCard insight={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightAction: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});