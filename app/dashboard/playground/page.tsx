"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteConfig } from "@/settings/config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Terminal, Send } from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
}

interface PlaygroundState {
  apiKey: string | null;
  selectedEndpoint: string;
  params: Record<string, string>;
  response: any;
  isLoading: boolean;
  error: string | null;
}

export default function PlaygroundPage() {
  const [state, setState] = useState<PlaygroundState>({
    apiKey: null,
    selectedEndpoint: siteConfig.apiCategories[0].endpoints[0].path,
    params: {},
    response: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    async function fetchKey() {
      try {
        const res = await fetch("/api/keys");
        if (!res.ok) throw new Error("Failed to fetch API keys.");
        const keys: ApiKey[] = await res.json();
        if (keys.length > 0) {
          setState(prev => ({ ...prev, apiKey: keys[0].key }));
        }
      } catch (error: any) {
        setState(prev => ({ ...prev, error: "Could not load your API key. Please ensure you have one."}));
      }
    }
    fetchKey();
  }, []);

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
        ...prev,
        params: { ...prev.params, [e.target.name]: e.target.value },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isLoading: true, response: null, error: null }));

    if (!state.apiKey) {
      setState(prev => ({ ...prev, error: "No API Key found. Please create one first.", isLoading: false }));
      return;
    }

    const endpointDetails = siteConfig.apiCategories
        .flatMap(c => c.endpoints)
        .find(e => e.path === state.selectedEndpoint);

    if (!endpointDetails) {
        setState(prev => ({ ...prev, error: "Selected endpoint details not found.", isLoading: false }));
        return;
    }

    const apiVersion = endpointDetails.versions[0] || 'v1'; // Default to v1 if not specified
    const url = new URL(`/api/${apiVersion}${state.selectedEndpoint}`, window.location.origin);
    endpointDetails.parameters.forEach(p => {
        if (state.params[p.name]) {
            url.searchParams.append(p.name, state.params[p.name]);
        }
    })

    try {
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${state.apiKey}` },
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await res.text();
        throw new Error(`Expected JSON response, but received ${contentType || 'text/plain'}. Response: ${responseText}`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      setState(prev => ({ ...prev, response: data, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, response: { error: err.message }, isLoading: false }));
    }
  };

  const endpointDetails = siteConfig.apiCategories
    .flatMap(c => c.endpoints)
    .find(e => e.path === state.selectedEndpoint);

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Playground</CardTitle>
        <CardDescription>Test API endpoints directly from the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!state.apiKey && !state.error && <p>Loading API Key...</p>}
        {state.apiKey && (
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                <Label>Using API Key:</Label>
                <Badge variant="outline">{state.apiKey.substring(0, 12)}...</Badge>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="endpoint">Endpoint</Label>
            <Select value={state.selectedEndpoint} onValueChange={val => setState(prev => ({...prev, selectedEndpoint: val, params: {}}))}>
                <SelectTrigger><SelectValue placeholder="Select an endpoint" /></SelectTrigger>
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
                id={param.name} name={param.name} type={param.type}
                placeholder={param.description} required={param.required}
                onChange={handleParamChange}
              />
            </div>
          ))}

          <Button type="submit" disabled={state.isLoading || !state.apiKey}>
            <Send className="mr-2 h-4 w-4" />
            {state.isLoading ? "Sending..." : "Send Request"}
          </Button>
        </form>

        {state.error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>An Error Occurred</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}

        {!state.apiKey && state.error && (
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>No API Key Found</AlertTitle>
                <AlertDescription>
                    You don't have an API key yet.
                    <Link href="/dashboard/apikeys" className="underline ml-1">Create one here.</Link>
                </AlertDescription>
            </Alert>
        )}

        {state.response && (
          <div>
            <Label>Response</Label>
            <pre className="mt-2 rounded-md bg-muted p-4 text-sm overflow-x-auto">
                <code>{JSON.stringify(state.response, null, 2)}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
