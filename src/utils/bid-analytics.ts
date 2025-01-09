import type { ChartData } from "@/components/BidAnalytics/Chart";

interface BidDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

interface BidChartData {
  responsive: boolean;
  labels: string[];
  datasets: BidDataset[];
}

export interface BidOutputData {
  title: string;
  chartData: BidChartData;
}

interface VacancyDataset {
  type: string;
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  yAxisID: string;
}

export interface VacancyOutputData {
  data: VacancyDataset[];
}

export function mergeDatasets(
  dataset1: BidOutputData,
  dataset2: VacancyOutputData,
): ChartData[] {
  const { labels, datasets: bidsDatasets } = dataset1.chartData;
  const vacanciesDatasets = dataset2.data;

  // Extract data from bids datasets
  const medianBidData =
    bidsDatasets.find((ds) => ds.label === "Median Bid")?.data ?? [];
  const minBidData =
    bidsDatasets.find((ds) => ds.label === "Min Bid")?.data ?? [];

  // Extract data from vacancies datasets
  const befVacData =
    vacanciesDatasets.find((ds) => ds.label === "Before Process Vacancies")
      ?.data ?? [];
  const aftVacData =
    vacanciesDatasets.find((ds) => ds.label === "After Process Vacancies")
      ?.data ?? [];

  const chartData: ChartData[] = labels.map((window, index) => ({
    window,
    befVac: befVacData[index] ?? 0,
    aftVac: aftVacData[index] ?? 0,
    minBid: minBidData[index] ?? 0,
    medBid: medianBidData[index] ?? 0,
  }));

  return chartData;
}
