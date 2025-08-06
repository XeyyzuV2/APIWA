"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

export function GetFreeKeyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("free-api-key");
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleGenerateKey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/free-key");
      const data = await response.json();
      if (data.status) {
        setApiKey(data.api_key);
        localStorage.setItem("free-api-key", data.api_key);
      }
    } catch (error) {
      console.error("Failed to generate API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>🎁 Get Free API Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Free API Key</DialogTitle>
          <DialogDescription>
            Here is your free API key. It is limited to 500 requests per 2 hours.
          </DialogDescription>
        </DialogHeader>
        {apiKey ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input value={apiKey} readOnly />
              <Button size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Tier: Free (xapis-LLC)
            </p>
          </div>
        ) : (
          <Button onClick={handleGenerateKey} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Key"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
