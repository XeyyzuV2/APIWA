"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteConfig } from "@/settings/config";

interface ApiKey {
  id: string;
  key: string;
}

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(siteConfig.apiCategories[0].endpoints[0].path);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchKey() {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const keys: ApiKey[] = await res.json();
        if (keys.length > 0) {
          setApiKey(keys[0].key);
        }
      }
    }
    fetchKey();
  }, []);

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({
      ...params,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
        setResponse({ error: "No API Key found. Please create one first." });
        return;
    }

    setIsLoading(true);
    setResponse(null);

    const url = new URL(`/api${selectedEndpoint}`, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        if(value) url.searchParams.append(key, value);
    });

    try {
        const res = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        const data = await res.json();
        setResponse(data);
    } catch (error) {
        setResponse({ error: "Failed to fetch" });
    } finally {
        setIsLoading(false);
    }
  };

  const endpointDetails = siteConfig.apiCategories
    .flatMap(c => c.endpoints)
    .find(e => e.path === selectedEndpoint);

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Playground</CardTitle>
        <CardDescription>Test API endpoints directly from the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKey && (
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                <Label>Using API Key:</Label>
                <Badge variant="outline">{apiKey.substring(0, 12)}...</Badge>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="endpoint">Endpoint</Label>
            <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an endpoint" />
                </SelectTrigger>
                <SelectContent>
                    {siteConfig.apiCategories.flatMap(c => c.endpoints).map(endpoint => (
                        <SelectItem key={endpoint.path} value={endpoint.path}>
                            {endpoint.method} {endpoint.path}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          {endpointDetails?.parameters.map(param => (
            <div key={param.name} className="grid gap-2">
              <Label htmlFor={param.name}>{param.name} {param.required && '*'}</Label>
              <Input
                id={param.name}
                name={param.name}
                type={param.type}
                placeholder={param.description}
                required={param.required}
                onChange={handleParamChange}
              />
            </div>
          ))}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </form>

        {response && (
          <div>
            <Label>Response</Label>
            <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
                <code>{JSON.stringify(response, null, 2)}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
