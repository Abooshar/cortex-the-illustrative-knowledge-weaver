import { motion } from 'framer-motion';
import { User, BarChart2, CheckSquare, Map, BrainCircuit, FileText, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockUser, mockStats, mockRoadmap } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const StatCard = ({ icon, title, value, change }: { icon: React.ReactNode, title: string, value: string, change?: string }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && <p className="text-xs text-muted-foreground">{change}</p>}
    </CardContent>
  </Card>
);
export function ProfilePage() {
  const chartData = Object.entries(mockStats.contentByType).map(([name, value]) => ({ name, value }));
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <User className="w-8 h-8 text-cortex-primary" />
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            User Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Your knowledge base at a glance.
          </p>
        </div>
      </motion.div>
      <div className="space-y-8">
        <Card className="border-border/50">
          <CardContent className="p-6 flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{mockUser.name}</h2>
              <p className="text-muted-foreground">{mockUser.email}</p>
              <Badge variant="secondary" className="mt-2">Pro Member</Badge>
            </div>
          </CardContent>
        </Card>
        <section>
          <h2 className="text-xl font-display font-bold mb-4">Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<BrainCircuit className="h-4 w-4 text-muted-foreground" />} title="Total Nodes" value={mockStats.totalNodes.toString()} change="+5 this week" />
            <StatCard icon={<FileText className="h-4 w-4 text-muted-foreground" />} title="Content Items" value={mockStats.contentItems.toString()} change="+2 this week" />
            <StatCard icon={<LinkIcon className="h-4 w-4 text-muted-foreground" />} title="Connections" value={mockStats.connections.toString()} />
            <StatCard icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />} title="Avg. Connections" value={mockStats.avgConnections.toFixed(1)} />
          </div>
        </section>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-sans font-semibold">Content by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-sans font-semibold flex items-center gap-2"><Map className="w-5 h-5" /> Project Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockRoadmap.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>{item.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}