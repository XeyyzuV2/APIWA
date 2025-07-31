"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  totalRequests: number;
  lastRequest: string | null;
}

interface ApiKey {
    id: string;
}

export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [analyticsRes, keysRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/keys"),
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setKeys(keysData);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Requests</CardTitle>
          <CardDescription>All-time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{analytics?.totalRequests ?? 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Last Request</CardTitle>
            <CardDescription>The last time you used your key</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">
                {analytics?.lastRequest ? new Date(analytics.lastRequest).toLocaleTimeString() : 'N/A'}
            </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Avg. Response</CardTitle>
            <CardDescription>Coming Soon</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">-</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Keys</CardTitle>
          <CardDescription>Your active API keys</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{keys?.length ?? 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
