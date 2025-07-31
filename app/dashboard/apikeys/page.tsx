"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle } from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchKeys() {
    setIsLoading(true);
    const res = await fetch("/api/keys");
    if (res.ok) {
      const data = await res.json();
      setKeys(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  const createNewKey = async () => {
    const res = await fetch("/api/keys", { method: "POST" });
    if (res.ok) {
      fetchKeys(); // Refresh the list
    }
  };

  const revokeKey = async (keyId: string) => {
    const res = await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyId }),
    });
    if (res.ok) {
      fetchKeys(); // Refresh the list
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys for accessing xAPI's services.</CardDescription>
        </div>
        <Button onClick={createNewKey}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Key
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key (Prefix)</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
            ) : keys.length > 0 ? (
              keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <Badge variant="outline">
                        {key.key.substring(0, 12)}...
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => revokeKey(key.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
