import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ApiDocsPreviewSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Easy-to-Use API
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our documentation is designed to be clear and intuitive.
          </p>
        </div>
        <Card className="font-mono text-sm">
            <CardHeader className="border-b">
                <CardTitle>API Endpoint Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline" className="text-green-400 border-green-400">GET</Badge>
                    <span className="text-muted-foreground">/api/v1/ai/luminai</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                    <pre>
                        <code>
{`{
  "status": true,
  "creator": "xAPI's Team",
  "result": {
    "reply": "Hello! I am LuminAI, how can I assist you today?"
  },
  "version": "v1"
}`}
                        </code>
                    </pre>
                </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
