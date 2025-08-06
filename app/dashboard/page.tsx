"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface AnalyticsData {
  totalRequests: number;
  lastRequest: string | null;
}

interface ApiKey {
    id: string;
}

interface KeyInfo {
    tier: string;
    owner: string;
    remaining: number;
    limit: number;
    resetAt: number;
}

export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const apiKey = localStorage.getItem("free-api-key");

      const [analyticsRes, keysRes, keyInfoRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/keys"),
        apiKey ? fetch("/api/internal/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey }),
        }) : Promise.resolve(null),
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setKeys(keysData);
      }
      if (keyInfoRes && keyInfoRes.ok) {
        const keyInfoData = await keyInfoRes.json();
        setKeyInfo(keyInfoData);
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
            <CardTitle>Current Tier</CardTitle>
            <CardDescription>{keyInfo?.owner}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{keyInfo?.tier ?? 'N/A'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            {keyInfo ? `${keyInfo.limit - keyInfo.remaining} / ${keyInfo.limit} requests used` : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {keyInfo && <Progress value={((keyInfo.limit - keyInfo.remaining) / keyInfo.limit) * 100} />}
            {keyInfo && <p className="text-xs text-muted-foreground mt-2">Resets in {new Date(keyInfo.resetAt).toLocaleTimeString()}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
