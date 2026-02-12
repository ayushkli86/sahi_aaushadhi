import { supabase } from '@/integrations/supabase/client';

export interface VerificationStats {
  totalScans: number;
  authenticCount: number;
  counterfeitCount: number;
  expiredCount: number;
  successRate: number;
  todayScans: number;
  weeklyGrowth: number;
}

export interface ScanByRegion {
  city: string;
  scans: number;
  authentic: number;
  counterfeit: number;
}

export interface MonthlyTrend {
  month: string;
  scans: number;
  alerts: number;
  authentic: number;
  counterfeit: number;
}

export interface BatchData {
  id: string;
  product_id: string;
  name: string;
  manufacturer: string;
  batch_number: string;
  manufacture_date: string;
  expiry_date: string;
  status: 'verified' | 'pending' | 'flagged';
  scanCount: number;
  created_at: string;
}

export interface CounterfeitAlert {
  id: string;
  product_id: string;
  drug_name: string;
  batch_number: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  affected_regions: string[];
  status: 'active' | 'resolved';
  created_at: string;
}

class AnalyticsService {
  private loadingDelay = 10000; // 10 seconds
  private initialScanCount = 20; // Start with 20 dummy scans

  /**
   * Simulate loading delay
   */
  private async simulateLoading(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.loadingDelay));
  }

  /**
   * Get scan count from localStorage (persists across sessions)
   */
  private getScanCount(): number {
    const stored = localStorage.getItem('dashboard_scan_count');
    return stored ? parseInt(stored, 10) : this.initialScanCount;
  }

  /**
   * Increment scan count
   */
  incrementScanCount(): void {
    const current = this.getScanCount();
    localStorage.setItem('dashboard_scan_count', (current + 1).toString());
  }

  /**
   * Get overall verification statistics
   */
  async getVerificationStats(): Promise<VerificationStats> {
    try {
      // Simulate 10-second loading
      await this.simulateLoading();

      // Get current scan count
      const totalScans = this.getScanCount();

      // Fetch all verification logs
      const { data: logs, error } = await (supabase as any)
        .from('verification_logs')
        .select('*')
        .order('verified_at', { ascending: false });

      if (error) throw error;

      // If no real data, use dummy data based on scan count
      if (!logs || logs.length === 0) {
        const authenticCount = Math.floor(totalScans * 0.85); // 85% authentic
        const counterfeitCount = totalScans - authenticCount;
        
        return {
          totalScans,
          authenticCount,
          counterfeitCount,
          expiredCount: 0,
          successRate: 85,
          todayScans: Math.floor(totalScans * 0.1), // 10% today
          weeklyGrowth: 12.5,
        };
      }

      // Combine real logs with scan count
      const realScans = logs.length;
      const scanCount = this.getScanCount();
      const combinedTotal = Math.max(realScans, scanCount);
      
      const authenticCount = logs.filter((log: any) => log.is_valid).length;
      const counterfeitCount = logs.filter((log: any) => !log.is_valid).length;
      
      // Calculate today's scans
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayScans = logs.filter((log: any) => 
        new Date(log.verified_at) >= today
      ).length;

      // Calculate weekly growth
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const weekScans = logs.filter((log: any) => 
        new Date(log.verified_at) >= lastWeek
      ).length;
      const previousWeek = new Date();
      previousWeek.setDate(previousWeek.getDate() - 14);
      const prevWeekScans = logs.filter((log: any) => {
        const date = new Date(log.verified_at);
        return date >= previousWeek && date < lastWeek;
      }).length;
      const weeklyGrowth = prevWeekScans > 0 
        ? ((weekScans - prevWeekScans) / prevWeekScans) * 100 
        : 0;

      return {
        totalScans: combinedTotal,
        authenticCount,
        counterfeitCount,
        expiredCount: 0, // TODO: Track expired separately
        successRate: combinedTotal > 0 ? (authenticCount / combinedTotal) * 100 : 0,
        todayScans,
        weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,
      };
    } catch (error) {
      console.error('Failed to fetch verification stats:', error);
      throw error;
    }
  }

  /**
   * Get scans grouped by region/city
   */
  async getScansByRegion(): Promise<ScanByRegion[]> {
    try {
      // Simulate loading
      await this.simulateLoading();

      const { data: logs, error } = await (supabase as any)
        .from('verification_logs')
        .select('*');

      if (error) throw error;

      // If no real data, return dummy data
      if (!logs || logs.length === 0) {
        const scanCount = this.getScanCount();
        return [
          { city: 'Kathmandu', scans: Math.floor(scanCount * 0.35), authentic: Math.floor(scanCount * 0.30), counterfeit: Math.floor(scanCount * 0.05) },
          { city: 'Pokhara', scans: Math.floor(scanCount * 0.20), authentic: Math.floor(scanCount * 0.18), counterfeit: Math.floor(scanCount * 0.02) },
          { city: 'Lalitpur', scans: Math.floor(scanCount * 0.15), authentic: Math.floor(scanCount * 0.13), counterfeit: Math.floor(scanCount * 0.02) },
          { city: 'Biratnagar', scans: Math.floor(scanCount * 0.12), authentic: Math.floor(scanCount * 0.10), counterfeit: Math.floor(scanCount * 0.02) },
          { city: 'Bharatpur', scans: Math.floor(scanCount * 0.10), authentic: Math.floor(scanCount * 0.09), counterfeit: Math.floor(scanCount * 0.01) },
          { city: 'Dharan', scans: Math.floor(scanCount * 0.08), authentic: Math.floor(scanCount * 0.07), counterfeit: Math.floor(scanCount * 0.01) },
        ];
      }

      // Group by city from metadata
      const cityMap = new Map<string, { scans: number; authentic: number; counterfeit: number }>();

      logs.forEach((log: any) => {
        const city = log.metadata?.city || 'Unknown';
        const existing = cityMap.get(city) || { scans: 0, authentic: 0, counterfeit: 0 };
        
        existing.scans++;
        if (log.is_valid) {
          existing.authentic++;
        } else {
          existing.counterfeit++;
        }
        
        cityMap.set(city, existing);
      });

      return Array.from(cityMap.entries())
        .map(([city, data]) => ({ city, ...data }))
        .sort((a, b) => b.scans - a.scans)
        .slice(0, 10); // Top 10 cities
    } catch (error) {
      console.error('Failed to fetch scans by region:', error);
      throw error;
    }
  }

  /**
   * Get monthly trend data
   */
  async getMonthlyTrends(): Promise<MonthlyTrend[]> {
    try {
      // Simulate loading
      await this.simulateLoading();

      const { data: logs, error } = await (supabase as any)
        .from('verification_logs')
        .select('*')
        .order('verified_at', { ascending: true });

      if (error) throw error;

      // If no real data, return dummy trend data
      if (!logs || logs.length === 0) {
        const scanCount = this.getScanCount();
        const months = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'];
        return months.map((month, i) => {
          const scans = Math.floor((scanCount / 6) * (1 + i * 0.1)); // Growing trend
          return {
            month,
            scans,
            alerts: Math.floor(scans * 0.05),
            authentic: Math.floor(scans * 0.85),
            counterfeit: Math.floor(scans * 0.15),
          };
        });
      }

      // Group by month
      const monthMap = new Map<string, { scans: number; alerts: number; authentic: number; counterfeit: number }>();

      logs.forEach((log: any) => {
        const date = new Date(log.verified_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        const existing = monthMap.get(monthKey) || { scans: 0, alerts: 0, authentic: 0, counterfeit: 0 };
        existing.scans++;
        
        if (log.is_valid) {
          existing.authentic++;
        } else {
          existing.counterfeit++;
          existing.alerts++;
        }
        
        monthMap.set(monthKey, existing);
      });

      return Array.from(monthMap.entries())
        .map(([month, data]) => ({ month, ...data }))
        .slice(-12); // Last 12 months
    } catch (error) {
      console.error('Failed to fetch monthly trends:', error);
      throw error;
    }
  }

  /**
   * Get all registered medicine batches with scan counts
   */
  async getBatchData(): Promise<BatchData[]> {
    try {
      // Simulate loading
      await this.simulateLoading();

      // Fetch medicines
      const { data: medicines, error: medError } = await (supabase as any)
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });

      if (medError) throw medError;

      // If no real data, return dummy batch data
      if (!medicines || medicines.length === 0) {
        const scanCount = this.getScanCount();
        return [
          {
            id: '1',
            product_id: 'MED-AUTH200000',
            name: 'Paracetamol 500mg',
            manufacturer: 'Nepal Pharma Ltd',
            batch_number: 'NPL-2026-PAR-001',
            manufacture_date: '2026-01-01',
            expiry_date: '2026-12-31',
            status: 'verified' as const,
            scanCount: Math.floor(scanCount * 0.25),
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            product_id: 'MED-AUTH200001',
            name: 'Amoxicillin 250mg',
            manufacturer: 'Himalayan Drugs',
            batch_number: 'HD-2026-AMX-002',
            manufacture_date: '2026-01-01',
            expiry_date: '2027-06-30',
            status: 'verified' as const,
            scanCount: Math.floor(scanCount * 0.20),
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            product_id: 'MED-AUTH200002',
            name: 'Ibuprofen 400mg',
            manufacturer: 'Nepal Pharma Ltd',
            batch_number: 'NPL-2026-IBU-003',
            manufacture_date: '2026-01-01',
            expiry_date: '2026-11-15',
            status: 'verified' as const,
            scanCount: Math.floor(scanCount * 0.15),
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            product_id: 'MED-AUTH200003',
            name: 'Ciprofloxacin 500mg',
            manufacturer: 'Kathmandu Pharmaceuticals',
            batch_number: 'KP-2026-CIP-004',
            manufacture_date: '2026-01-01',
            expiry_date: '2027-03-20',
            status: 'verified' as const,
            scanCount: Math.floor(scanCount * 0.12),
            created_at: new Date().toISOString(),
          },
          {
            id: '5',
            product_id: 'MED-AUTH200004',
            name: 'Metformin 500mg',
            manufacturer: 'Himalayan Drugs',
            batch_number: 'HD-2026-MET-005',
            manufacture_date: '2026-01-01',
            expiry_date: '2027-08-10',
            status: 'pending' as const,
            scanCount: Math.floor(scanCount * 0.10),
            created_at: new Date().toISOString(),
          },
        ];
      }

      // Fetch verification counts for each product
      const { data: logs, error: logError } = await (supabase as any)
        .from('verification_logs')
        .select('product_id');

      if (logError) throw logError;

      // Count scans per product
      const scanCounts = new Map<string, number>();
      logs?.forEach((log: any) => {
        const count = scanCounts.get(log.product_id) || 0;
        scanCounts.set(log.product_id, count + 1);
      });

      // Determine status based on expiry and blockchain
      const batches: BatchData[] = medicines.map((med: any) => {
        const expiryDate = new Date(med.expiry_date);
        const isExpired = expiryDate < new Date();
        const hasBlockchain = !!med.blockchain_tx;
        
        let status: 'verified' | 'pending' | 'flagged' = 'pending';
        if (isExpired) {
          status = 'flagged';
        } else if (hasBlockchain) {
          status = 'verified';
        }

        return {
          id: med.id,
          product_id: med.product_id,
          name: med.name,
          manufacturer: med.manufacturer,
          batch_number: med.batch_number,
          manufacture_date: med.manufacture_date,
          expiry_date: med.expiry_date,
          status,
          scanCount: scanCounts.get(med.product_id) || 0,
          created_at: med.created_at,
        };
      });

      return batches;
    } catch (error) {
      console.error('Failed to fetch batch data:', error);
      throw error;
    }
  }

  /**
   * Get counterfeit alerts
   * Note: This requires a counterfeit_alerts table to be created
   * For now, we'll derive from verification logs
   */
  async getCounterfeitAlerts(): Promise<CounterfeitAlert[]> {
    try {
      // Simulate loading
      await this.simulateLoading();

      // Fetch failed verifications
      const { data: logs, error } = await (supabase as any)
        .from('verification_logs')
        .select('*, medicines(*)')
        .eq('is_valid', false)
        .order('verified_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // If no real data, return dummy alerts (empty for now - all clear)
      if (!logs || logs.length === 0) {
        return [];
      }

      // Group by product_id to avoid duplicates
      const alertMap = new Map<string, CounterfeitAlert>();

      logs.forEach((log: any) => {
        if (!log.product_id || alertMap.has(log.product_id)) return;

        const medicine = log.medicines as any;
        const regions = log.metadata?.city ? [log.metadata.city] : ['Unknown'];

        alertMap.set(log.product_id, {
          id: log.id,
          product_id: log.product_id,
          drug_name: medicine?.name || 'Unknown Medicine',
          batch_number: medicine?.batch_number || 'N/A',
          severity: 'high', // Default to high for counterfeit
          description: 'Counterfeit medicine detected during verification',
          affected_regions: regions,
          status: 'active',
          created_at: log.verified_at,
        });
      });

      return Array.from(alertMap.values()).slice(0, 10);
    } catch (error) {
      console.error('Failed to fetch counterfeit alerts:', error);
      throw error;
    }
  }

  /**
   * Get verification distribution (pie chart data)
   */
  async getVerificationDistribution() {
    try {
      // Simulate loading
      await this.simulateLoading();

      const stats = await this.getVerificationStats();
      
      if (stats.totalScans === 0) {
        return [];
      }

      const authenticPercent = (stats.authenticCount / stats.totalScans) * 100;
      const counterfeitPercent = (stats.counterfeitCount / stats.totalScans) * 100;

      return [
        { 
          name: 'Authentic', 
          value: Math.round(authenticPercent * 10) / 10, 
          color: 'hsl(145, 63%, 42%)' 
        },
        { 
          name: 'Counterfeit', 
          value: Math.round(counterfeitPercent * 10) / 10, 
          color: 'hsl(6, 78%, 57%)' 
        },
      ];
    } catch (error) {
      console.error('Failed to fetch verification distribution:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
