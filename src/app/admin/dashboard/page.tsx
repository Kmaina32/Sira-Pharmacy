'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, Box } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Kpi {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  changeType: 'increase' | 'decrease';
}

const chartConfig = {
  thisMonth: {
    label: 'This Month',
    color: 'hsl(var(--primary))',
  },
};

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<Kpi[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const productsCollection = collection(db, 'products');
      const ordersCollection = collection(db, 'orders');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

      const recentOrdersQuery = query(ordersCollection, where('createdAt', '>=', thirtyDaysAgoTimestamp));

      const [productsSnapshot, recentOrdersSnapshot] = await Promise.all([
        getDocs(productsCollection),
        getDocs(recentOrdersQuery),
      ]);
      
      const productsInStock = productsSnapshot.docs.reduce((acc, doc) => acc + (doc.data().stock || 0), 0);
      const recentOrders = recentOrdersSnapshot.docs.map(doc => doc.data());
      
      const totalRevenue = recentOrders.reduce((acc, order) => acc + order.total, 0);
      const totalSales = recentOrders.length;
      
      const uniqueCustomers = new Set(recentOrders.map(order => order.userId)).size;

      setKpiData([
        { title: 'Total Revenue (Last 30d)', value: formatCurrency(totalRevenue), icon: DollarSign, change: '', changeType: 'increase' },
        { title: 'Total Sales (Last 30d)', value: `+${totalSales}`, icon: ShoppingCart, change: '', changeType: 'increase' },
        { title: 'New Customers (Last 30d)', value: `+${uniqueCustomers}`, icon: Users, change: '', changeType: 'increase' },
        { title: 'Products in Stock', value: productsInStock.toString(), icon: Box, change: '', changeType: 'increase' },
      ]);
      
      const monthlySales = recentOrders.reduce((acc: { [key: string]: number }, order) => {
        const date = (order.createdAt as Timestamp).toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + order.total;
        return acc;
      }, {});

      const formattedSalesData = Object.entries(monthlySales)
        .map(([date, total]) => ({ date, 'thisMonth': total }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setSalesData(formattedSalesData);
      setLoading(false);
    };

    fetchData();
  }, []);


  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        {loading ? <p>Loading dashboard data...</p> : (
            <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi) => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                             {kpi.change && (
                                <p className={`text-xs ${kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                                    {kpi.change}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Sales Analytics (Last 30 Days)</CardTitle>
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
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            </>
        )}
    </div>
  );
}
