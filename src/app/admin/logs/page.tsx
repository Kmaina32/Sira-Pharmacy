'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  event: string;
  description: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
        setLoading(false);
        return;
    }

    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
      setLogs(logsList);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching logs: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, authLoading]);

  const getBadgeVariant = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };
  
  if (loading || authLoading) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Audit Logs</h1>
            <Card><CardContent><p>Loading...</p></CardContent></Card>
        </div>
    );
  }

  if (!isAdmin) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Access Denied</h1>
            <Card><CardHeader><CardTitle>Permission Required</CardTitle></CardHeader>
            <CardContent><p>You do not have permission to view this page.</p></CardContent></Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold font-headline">Audit Logs</h1>
            <p className="text-muted-foreground">A chronological record of events that have occurred in the system.</p>
        </div>

        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Type</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(log.type)}>{log.type}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{log.event}</TableCell>
                                <TableCell className="text-muted-foreground">{log.description}</TableCell>
                                <TableCell className="text-right text-muted-foreground text-xs">
                                    {log.timestamp ? format(new Date(log.timestamp.seconds * 1000), 'Pp') : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {logs.length === 0 && !loading && (
                    <p className="p-6 text-center text-muted-foreground">No log entries yet.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
