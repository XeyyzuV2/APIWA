import { NavBar } from "@/components/nav-bar";
import { ApiEndpoints } from "@/components/api-endpoints";
import { siteConfig } from "@/settings/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

        <section id="authentication" className="mb-12">
            <Card>
                <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                    <CardDescription>How to authenticate your API requests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        To use the xAPI's services, you need to include an API key in your requests. You can get your API key from the developer dashboard.
                    </p>
                    <p>
                        All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.
                    </p>
                    <p>
                        Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
                    </p>
                    <p>
                        Authentication to the API is performed via HTTP Bearer authentication. Provide your API key in the `Authorization` header.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                        <pre>
                            <code>
{`Authorization: Bearer YOUR_API_KEY`}
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
