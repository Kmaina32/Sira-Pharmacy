'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, Box } from 'lucide-react';
import { salesData } from '@/lib/placeholder-data';
import { formatCurrency } from '@/lib/utils';

const chartConfig = {
  thisMonth: {
    label: 'This Month',
    color: 'hsl(var(--primary))',
  },
  lastMonth: {
    label: 'Last Month',
    color: 'hsl(var(--secondary))',
  },
};

export default function DashboardPage() {
  const kpiData = [
    { title: 'Total Revenue', value: formatCurrency(54230.89), icon: DollarSign, change: '+12.5%' },
    { title: 'Total Sales', value: '+1250', icon: ShoppingCart, change: '+8.1%' },
    { title: 'New Customers', value: '+340', icon: Users, change: '+20.3%' },
    { title: 'Products in Stock', value: '345', icon: Box, change: '-2.1%' },
  ];

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi) => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {kpi.change} from last month
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={(value) => formatCurrency(value as number).replace('Ksh','')}
                            />
                            <ChartTooltip 
                                content={<ChartTooltipContent 
                                    formatter={(value) => formatCurrency(value as number)}
                                />} 
                            />
                            <Bar dataKey="thisMonth" fill="var(--color-thisMonth)" radius={4} />
                            <Bar dataKey="lastMonth" fill="var(--color-lastMonth)" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
