import { useQuery } from '@tanstack/react-query';
import analyticsService from '@/services/analytics.service';

/**
 * Hook to fetch verification statistics
 */
export const useVerificationStats = () => {
  return useQuery({
    queryKey: ['verification-stats'],
    queryFn: () => analyticsService.getVerificationStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Hook to fetch scans by region
 */
export const useScansByRegion = () => {
  return useQuery({
    queryKey: ['scans-by-region'],
    queryFn: () => analyticsService.getScansByRegion(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch monthly trends
 */
export const useMonthlyTrends = () => {
  return useQuery({
    queryKey: ['monthly-trends'],
    queryFn: () => analyticsService.getMonthlyTrends(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch batch data
 */
export const useBatchData = () => {
  return useQuery({
    queryKey: ['batch-data'],
    queryFn: () => analyticsService.getBatchData(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Hook to fetch counterfeit alerts
 */
export const useCounterfeitAlerts = () => {
  return useQuery({
    queryKey: ['counterfeit-alerts'],
    queryFn: () => analyticsService.getCounterfeitAlerts(),
    staleTime: 1 * 60 * 1000, // 1 minute (critical data)
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

/**
 * Hook to fetch verification distribution
 */
export const useVerificationDistribution = () => {
  return useQuery({
    queryKey: ['verification-distribution'],
    queryFn: () => analyticsService.getVerificationDistribution(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch all dashboard data at once
 */
export const useDashboardData = () => {
  const stats = useVerificationStats();
  const scans = useScansByRegion();
  const trends = useMonthlyTrends();
  const batches = useBatchData();
  const alerts = useCounterfeitAlerts();
  const distribution = useVerificationDistribution();

  return {
    stats,
    scans,
    trends,
    batches,
    alerts,
    distribution,
    isLoading: stats.isLoading || scans.isLoading || trends.isLoading || batches.isLoading || alerts.isLoading || distribution.isLoading,
    isError: stats.isError || scans.isError || trends.isError || batches.isError || alerts.isError || distribution.isError,
  };
};
