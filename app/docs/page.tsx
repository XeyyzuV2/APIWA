import { NavBar } from "@/components/nav-bar";
import { ApiEndpoints } from "@/components/api-endpoints";
import { siteConfig } from "@/settings/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { GetFreeKeyModal } from "@/components/get-free-key-modal";

export default function DocsPage() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            API Documentation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Welcome to the xAPI's documentation. Here you'll find everything you need to integrate with our services.
          </p>
        </header>

        <section id="tier-info" className="mb-12 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Free Tier</CardTitle>
              <CardDescription>Key starts with `free_`</CardDescription>
            </CardHeader>
            <CardContent>
              <p>500 req / 2h</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pro Tier</CardTitle>
              <CardDescription>Key starts with `pro_`</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Up to 5k req/hour (custom)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Tier</CardTitle>
              <CardDescription>Key starts with `ent_`</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Custom everything</p>
            </CardContent>
          </Card>
        </section>

        <section id="authentication" className="mb-12">
            <Card>
                <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                    <CardDescription>How to authenticate your API requests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <GetFreeKeyModal />
                    <p>
                        To use the xAPI's services, you need to include an API key in your requests. You can get your API key from the developer dashboard.
                    </p>
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                        Requests without a valid API key will return a `401 Unauthorized` error.
                        </AlertDescription>
                    </Alert>
                    <p>
                        Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
                    </p>
                    <p>
                        Authentication to the API is performed via HTTP Bearer authentication. Provide your API key in the `Authorization` header.
                    </p>

                    <h3 className="font-semibold">cURL Example</h3>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                        <pre>
                            <code>
{`curl -H "Authorization: Bearer YOUR_API_KEY" "${siteConfig.api.baseUrl}/api/v1/ai/luminai?text=Hello"`}
                            </code>
                        </pre>
                    </div>

                    <h3 className="font-semibold">JavaScript (fetch) Example</h3>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                        <pre>
                            <code>
{`fetch('${siteConfig.api.baseUrl}/api/v1/ai/luminai?text=Hello', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                            </code>
                        </pre>
                    </div>

                    <h3 className="font-semibold">Python (requests) Example</h3>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                        <pre>
                            <code>
{`import requests

url = "${siteConfig.api.baseUrl}/api/v1/ai/luminai?text=Hello"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
print(response.json())`}
                            </code>
                        </pre>
                    </div>

                </CardContent>
            </Card>
        </section>

        <ApiEndpoints />

        <section id="errors" className="mb-12">
            <Card>
                <CardHeader>
                    <CardTitle>Error Codes</CardTitle>
                    <CardDescription>Common error codes and their meanings.</CardDescription>
                </CardHeader>
                <CardContent>
                <ul className="space-y-2">
                    {siteConfig.statusCodes.map(code => (
                        <li key={code.code}>
                            <strong>{code.code} {code.name}</strong>: {code.description}
                        </li>
                    ))}
                </ul>
                </CardContent>
            </Card>
        </section>

      </div>
    </>
  );
}
