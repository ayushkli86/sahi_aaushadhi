import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Shield, AlertTriangle, Package, QrCode, MapPin, TrendingUp, Bell, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import EmptyState from "@/components/EmptyState";

const Dashboard = () => {
  const { stats, scans, trends, batches, alerts, distribution, isLoading, isError } = useDashboardData();

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={AlertTriangle}
            title="Failed to Load Dashboard"
            description="Unable to fetch dashboard data. Please check your connection and try again."
            action={<Button onClick={() => window.location.reload()}>Retry</Button>}
          />
        </div>
      </div>
    );
  }

  // Empty state - no data at all
  if (!stats.data || stats.data.totalScans === 0) {
    return (
      <div className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={Database}
            title="No Verification Data Yet"
            description="Start verifying medicines to see analytics and insights here. The dashboard will populate automatically as users scan QR codes."
            action={
              <Button onClick={() => window.location.href = '/verify'} className="gradient-hero text-primary-foreground border-0">
                <QrCode className="w-4 h-4 mr-2" />
                Verify Medicine
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const statsData = stats.data;
  const scanData = scans.data || [];
  const trendData = trends.data || [];
  const batchData = batches.data || [];
  const alertData = alerts.data || [];
  const pieData = distribution.data || [];

  // Calculate active batches
  const activeBatches = batchData.filter(b => b.status === 'verified').length;
  const counterfeitAlerts = alertData.filter(a => a.status === 'active').length;

  // Get unique cities
  const citiesCount = new Set(scanData.map(s => s.city)).size;

  const statCards = [
    { 
      label: "Total Scans", 
      value: statsData.totalScans.toLocaleString(), 
      change: `+${statsData.weeklyGrowth}%`, 
      icon: QrCode, 
      gradient: "gradient-hero" 
    },
    { 
      label: "Active Batches", 
      value: activeBatches.toString(), 
      change: `${batchData.length} total`, 
      icon: Package, 
      gradient: "gradient-hero" 
    },
    { 
      label: "Counterfeit Alerts", 
      value: counterfeitAlerts.toString(), 
      change: `${statsData.successRate.toFixed(1)}% authentic`, 
      icon: AlertTriangle, 
      gradient: counterfeitAlerts > 0 ? "gradient-danger" : "gradient-hero" 
    },
    { 
      label: "Cities Covered", 
      value: citiesCount.toString(), 
      change: `${statsData.todayScans} today`, 
      icon: MapPin, 
      gradient: "gradient-hero" 
    },
  ];
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, Admin</h1>
          <p className="text-slate-500">Here are the latest updates of today</p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statsData.totalScans.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Total Scans</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{activeBatches}</p>
                <p className="text-xs text-slate-500">Active Batches</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statsData.successRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Score Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <h3 className="font-semibold text-slate-800">Verification Success Score</h3>
                </div>
                <span className="text-xs text-slate-500">Updated today</span>
              </div>
              
              <div className="mb-4">
                <div className="text-5xl font-bold text-teal-600 mb-1">{statsData.successRate.toFixed(1)}%</div>
                <p className="text-sm text-slate-500">Success rate this month</p>
              </div>

              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={scanData.slice(0, 7)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="city" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Bar dataKey="scans" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-sm text-slate-400">
                  No data available yet
                </div>
              )}
            </div>

            {/* Report Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <h3 className="font-semibold text-slate-800">Monthly Scan Report</h3>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-600">Overview</button>
                  <button className="px-3 py-1 text-xs rounded-lg bg-teal-500 text-white">Goals</button>
                </div>
              </div>

              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="scans" 
                      stroke="#14b8a6" 
                      strokeWidth={3} 
                      dot={{ fill: '#14b8a6', r: 4 }}
                      fill="url(#colorScans)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                  No trend data available yet
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Treatment Plan / Alerts */}
          <div className="space-y-6">
            {/* Treatment Plan Card (Alerts) */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Alert Status</h3>
              </div>
              
              <div className="mb-6">
                <div className="text-5xl font-bold mb-1">{counterfeitAlerts}</div>
                <p className="text-teal-100 text-sm">Active Alerts</p>
              </div>

              {alertData.length > 0 ? (
                <div className="space-y-2">
                  {alertData.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm font-medium">{alert.drug_name}</p>
                      <p className="text-xs text-teal-100">{alert.affected_regions.join(", ")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All Clear</p>
                  <p className="text-xs text-teal-100">No active alerts</p>
                </div>
              )}
            </div>

            {/* Medicine Batches Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-slate-800">Recent Batches</h3>
              </div>

              {batchData.length > 0 ? (
                <div className="space-y-3">
                  {batchData.slice(0, 4).map((batch) => (
                    <div key={batch.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        batch.status === 'verified' ? 'bg-teal-500' : 
                        batch.status === 'flagged' ? 'bg-red-500' : 'bg-slate-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{batch.name}</p>
                        <p className="text-xs text-slate-500">{batch.manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600">{batch.scanCount}</p>
                        <p className="text-xs text-slate-400">scans</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm text-slate-500">No batches yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="batches" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="batches" className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              Batch Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              Alerts {counterfeitAlerts > 0 && `(${counterfeitAlerts})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batches">
            {batchData.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left p-4 font-semibold text-slate-700">Product ID</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Drug</th>
                        <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Manufacturer</th>
                        <th className="text-left p-4 font-semibold text-slate-700 hidden lg:table-cell">Expiry Date</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                        <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Scans</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.map((b) => (
                        <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-600">{b.product_id}</td>
                          <td className="p-4 font-medium text-slate-800">{b.name}</td>
                          <td className="p-4 text-slate-600 hidden md:table-cell">{b.manufacturer}</td>
                          <td className="p-4 text-slate-600 hidden lg:table-cell">
                            {new Date(b.expiry_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={b.status === "verified" ? "default" : b.status === "flagged" ? "destructive" : "secondary"}
                              className={`${
                                b.status === "verified" ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : 
                                b.status === "flagged" ? "bg-red-100 text-red-700 hover:bg-red-200" : 
                                "bg-slate-100 text-slate-700"
                              } border-0`}
                            >
                              {b.status === "verified" && <Shield className="w-3 h-3 mr-1" />}
                              {b.status === "verified" ? "Verified" : b.status === "flagged" ? "Flagged" : "Pending"}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-600 hidden md:table-cell font-medium">{b.scanCount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No Batches Registered"
                description="Register medicine batches to track them in the supply chain."
              />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scanning by City */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Scans by Region</h3>
                {scanData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={scanData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Bar dataKey="scans" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                    No regional data available yet
                  </div>
                )}
              </div>

              {/* Verification Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Verification Results</h3>
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={70} 
                          outerRadius={100} 
                          paddingAngle={4} 
                          dataKey="value"
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-5 mt-2">
                      {pieData.map((d, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-slate-600">{d.name} ({d.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                    No verification data available yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {alertData.length > 0 ? (
              alertData.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-red-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-800 text-sm">{a.drug_name}</p>
                      <Badge variant="destructive" className="text-xs bg-red-100 text-red-700 border-0">
                        {a.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Batch <span className="font-mono font-medium">{a.batch_number}</span> detected in{" "}
                      <span className="font-medium text-slate-800">{a.affected_regions.join(", ")}</span>
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100">
                <EmptyState
                  icon={Shield}
                  title="No Active Alerts"
                  description="All verified medicines are authentic. Alerts will appear here when counterfeit products are detected."
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="batches">
            {batchData.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left p-4 font-semibold text-slate-700">Product ID</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Drug</th>
                        <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Manufacturer</th>
                        <th className="text-left p-4 font-semibold text-slate-700 hidden lg:table-cell">Expiry Date</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                        <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Scans</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.map((b) => (
                        <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-600">{b.product_id}</td>
                          <td className="p-4 font-medium text-slate-800">{b.name}</td>
                          <td className="p-4 text-slate-600 hidden md:table-cell">{b.manufacturer}</td>
                          <td className="p-4 text-slate-600 hidden lg:table-cell">
                            {new Date(b.expiry_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={b.status === "verified" ? "default" : b.status === "flagged" ? "destructive" : "secondary"}
                              className={`${
                                b.status === "verified" ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : 
                                b.status === "flagged" ? "bg-red-100 text-red-700 hover:bg-red-200" : 
                                "bg-slate-100 text-slate-700"
                              } border-0`}
                            >
                              {b.status === "verified" && <Shield className="w-3 h-3 mr-1" />}
                              {b.status === "verified" ? "Verified" : b.status === "flagged" ? "Flagged" : "Pending"}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-600 hidden md:table-cell font-medium">{b.scanCount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100">
                <EmptyState
                  icon={Package}
                  title="No Batches Registered"
                  description="Register medicine batches to track them in the supply chain."
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
