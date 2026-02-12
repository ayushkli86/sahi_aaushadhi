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
    <div className="min-h-screen pt-16 bg-white relative">
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(135deg, #163A2C 0%, #1B4433 35%, #0F2A21 70%, #0B2019 100%)'
        }}
      />
      
      {/* Content - keeping original styling for now, can be updated incrementally */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h1>
            <p className="text-white/70">Here are the latest updates of today</p>
          </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <QrCode className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statsData.totalScans.toLocaleString()}</p>
                <p className="text-xs text-emerald-200/70">Total Scans</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Package className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeBatches}</p>
                <p className="text-xs text-emerald-200/70">Active Batches</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Shield className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statsData.successRate.toFixed(1)}%</p>
                <p className="text-xs text-emerald-200/70">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Score Card */}
            <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-300" />
                  <h3 className="font-semibold text-white">Verification Success Score</h3>
                </div>
                <span className="text-xs text-emerald-200/60">Updated today</span>
              </div>
              
              <div className="mb-4">
                <div className="text-5xl font-bold text-emerald-300 mb-1">{statsData.successRate.toFixed(1)}%</div>
                <p className="text-sm text-emerald-200/70">Success rate this month</p>
              </div>

              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={scanData.slice(0, 7)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d5a47" vertical={false} />
                    <XAxis dataKey="city" tick={{ fontSize: 11, fill: '#a7f3d0' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#a7f3d0' }} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a4434', 
                        border: '1px solid #34d399',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="scans" fill="#34d399" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-sm text-emerald-200/50">
                  No data available yet
                </div>
              )}
            </div>

            {/* Report Chart */}
            <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                  <h3 className="font-semibold text-white">Monthly Scan Report</h3>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">Overview</button>
                  <button className="px-3 py-1 text-xs rounded-lg bg-emerald-500 text-white">Goals</button>
                </div>
              </div>

              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d5a47" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a7f3d0' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#a7f3d0' }} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a4434', 
                        border: '1px solid #34d399',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                        color: '#fff'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="scans" 
                      stroke="#34d399" 
                      strokeWidth={3} 
                      dot={{ fill: '#34d399', r: 4 }}
                      fill="url(#colorScans)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-sm text-emerald-200/50">
                  No trend data available yet
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Treatment Plan / Alerts */}
          <div className="space-y-6">
            {/* Treatment Plan Card (Alerts) */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg border border-emerald-500/50">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Alert Status</h3>
              </div>
              
              <div className="mb-6">
                <div className="text-5xl font-bold mb-1">{counterfeitAlerts}</div>
                <p className="text-emerald-100 text-sm">Active Alerts</p>
              </div>

              {alertData.length > 0 ? (
                <div className="space-y-2">
                  {alertData.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-sm font-medium">{alert.drug_name}</p>
                      <p className="text-xs text-emerald-100">{alert.affected_regions.join(", ")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All Clear</p>
                  <p className="text-xs text-emerald-100">No active alerts</p>
                </div>
              )}
            </div>

            {/* Medicine Batches Card */}
            <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-emerald-300" />
                <h3 className="font-semibold text-white">Recent Batches</h3>
              </div>

              {batchData.length > 0 ? (
                <div className="space-y-3">
                  {batchData.slice(0, 4).map((batch) => (
                    <div key={batch.id} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-900/30 hover:bg-emerald-900/50 transition-colors border border-emerald-700/30">
                      <div className={`w-2 h-2 rounded-full ${
                        batch.status === 'verified' ? 'bg-emerald-400' : 
                        batch.status === 'flagged' ? 'bg-red-400' : 'bg-slate-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{batch.name}</p>
                        <p className="text-xs text-emerald-200/70">{batch.manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-emerald-200">{batch.scanCount}</p>
                        <p className="text-xs text-emerald-200/50">scans</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-2 text-emerald-300/30" />
                  <p className="text-sm text-emerald-200/60">No batches yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="batches" className="space-y-6">
          <TabsList className="bg-[#1a4434]/70 backdrop-blur-lg border border-emerald-700/50 p-1 rounded-xl">
            <TabsTrigger value="batches" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-emerald-200">
              Batch Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-emerald-200">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-emerald-200">
              Alerts {counterfeitAlerts > 0 && `(${counterfeitAlerts})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batches">
            {batchData.length > 0 ? (
              <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl border border-emerald-700/50 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-emerald-700/50 bg-emerald-900/30">
                        <th className="text-left p-4 font-semibold text-emerald-200">Product ID</th>
                        <th className="text-left p-4 font-semibold text-emerald-200">Drug</th>
                        <th className="text-left p-4 font-semibold text-emerald-200 hidden md:table-cell">Manufacturer</th>
                        <th className="text-left p-4 font-semibold text-emerald-200 hidden lg:table-cell">Expiry Date</th>
                        <th className="text-left p-4 font-semibold text-emerald-200">Status</th>
                        <th className="text-left p-4 font-semibold text-emerald-200 hidden md:table-cell">Scans</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.map((b) => (
                        <tr key={b.id} className="border-b border-emerald-700/30 last:border-0 hover:bg-emerald-900/30 transition-colors">
                          <td className="p-4 font-mono text-xs text-emerald-200/80">{b.product_id}</td>
                          <td className="p-4 font-medium text-white">{b.name}</td>
                          <td className="p-4 text-emerald-200/80 hidden md:table-cell">{b.manufacturer}</td>
                          <td className="p-4 text-emerald-200/80 hidden lg:table-cell">
                            {new Date(b.expiry_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={b.status === "verified" ? "default" : b.status === "flagged" ? "destructive" : "secondary"}
                              className={`${
                                b.status === "verified" ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30" : 
                                b.status === "flagged" ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30" : 
                                "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                              }`}
                            >
                              {b.status === "verified" && <Shield className="w-3 h-3 mr-1" />}
                              {b.status === "verified" ? "Verified" : b.status === "flagged" ? "Flagged" : "Pending"}
                            </Badge>
                          </td>
                          <td className="p-4 text-emerald-200/80 hidden md:table-cell font-medium">{b.scanCount.toLocaleString()}</td>
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
              <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
                <h3 className="font-semibold text-white mb-4">Scans by Region</h3>
                {scanData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={scanData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d5a47" vertical={false} />
                      <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#a7f3d0' }} axisLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#a7f3d0' }} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a4434', 
                          border: '1px solid #34d399',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                          color: '#fff'
                        }} 
                      />
                      <Bar dataKey="scans" fill="#34d399" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-sm text-emerald-200/50">
                    No regional data available yet
                  </div>
                )}
              </div>

              {/* Verification Distribution */}
              <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-6 border border-emerald-700/50 shadow-lg">
                <h3 className="font-semibold text-white mb-4">Verification Results</h3>
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
                            backgroundColor: '#1a4434', 
                            border: '1px solid #34d399',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                            color: '#fff'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-5 mt-2">
                      {pieData.map((d, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-emerald-200/80">{d.name} ({d.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center text-sm text-emerald-200/50">
                    No verification data available yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {alertData.length > 0 ? (
              alertData.map((a) => (
                <div key={a.id} className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-5 border border-red-500/50 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
                    <AlertTriangle className="w-5 h-5 text-red-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white text-sm">{a.drug_name}</p>
                      <Badge variant="destructive" className="text-xs bg-red-500/20 text-red-300 border border-red-500/30">
                        {a.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-emerald-200/70">
                      Batch <span className="font-mono font-medium">{a.batch_number}</span> detected in{" "}
                      <span className="font-medium text-white">{a.affected_regions.join(", ")}</span>
                    </p>
                  </div>
                  <span className="text-xs text-emerald-200/50 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-12 border border-emerald-700/50 shadow-lg">
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
              <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl border border-emerald-700/50 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-emerald-700/50 bg-emerald-900/30">
                        <th className="text-left p-4 font-semibold text-emerald-200">Product ID</th>
                        <th className="text-left p-4 font-semibold text-emerald-200">Drug</th>
                        <th className="text-left p-4 font-semibold text-emerald-200 hidden md:table-cell">Manufacturer</th>
                        <th className="text-left p-4 font-semibold text-emerald-200 hidden lg:table-cell">Expiry Date</th>
                        <th className="text-left p-4 font-semibold text-emerald-200">Status</th>
                        <th className="text-left p-4 font-semibold text-emerald-200 hidden md:table-cell">Scans</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.map((b) => (
                        <tr key={b.id} className="border-b border-emerald-700/30 last:border-0 hover:bg-emerald-900/30 transition-colors">
                          <td className="p-4 font-mono text-xs text-emerald-200/80">{b.product_id}</td>
                          <td className="p-4 font-medium text-white">{b.name}</td>
                          <td className="p-4 text-emerald-200/80 hidden md:table-cell">{b.manufacturer}</td>
                          <td className="p-4 text-emerald-200/80 hidden lg:table-cell">
                            {new Date(b.expiry_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={b.status === "verified" ? "default" : b.status === "flagged" ? "destructive" : "secondary"}
                              className={`${
                                b.status === "verified" ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30" : 
                                b.status === "flagged" ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30" : 
                                "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                              }`}
                            >
                              {b.status === "verified" && <Shield className="w-3 h-3 mr-1" />}
                              {b.status === "verified" ? "Verified" : b.status === "flagged" ? "Flagged" : "Pending"}
                            </Badge>
                          </td>
                          <td className="p-4 text-emerald-200/80 hidden md:table-cell font-medium">{b.scanCount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl p-12 border border-emerald-700/50 shadow-lg">
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
    </div>
  );
};

export default Dashboard;
