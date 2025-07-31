"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle, Eye, EyeOff, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  async function fetchKeys() {
    setIsLoading(true);
    try {
        const res = await fetch("/api/keys");
        if (res.ok) {
            const data = await res.json();
            setKeys(data);
        }
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  const createNewKey = async () => {
    await fetch("/api/keys", { method: "POST" });
    fetchKeys();
  };

  const revokeKey = async (keyId: string) => {
    await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyId }),
    });
    fetchKeys();
  };

  const handleRevealKey = (keyId: string) => {
    if (revealedKeyId === keyId) {
        setRevealedKeyId(null);
    } else {
        setRevealedKeyId(keyId);
        setTimeout(() => setRevealedKeyId(null), 5000); // Auto-hide after 5 seconds
    }
  }

  const handleCopyKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000); // Reset after 2 seconds
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys for accessing xAPI's services.</CardDescription>
        </div>
        <Button onClick={createNewKey} disabled={isLoading}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Key
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            ) : keys.length > 0 ? (
              keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                        {revealedKeyId === key.id ? key.key : `${key.key.substring(0, 12)}...`}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleCopyKey(key.key, key.id)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy Key</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRevealKey(key.id)}>
                      {revealedKeyId === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">Reveal Key</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => revokeKey(key.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Revoke Key</span>
                    </Button>
                    {copiedKeyId === key.id && <span className="text-xs text-muted-foreground">Copied!</span>}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={3} className="text-center">No API keys found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
