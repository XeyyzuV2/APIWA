import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    features: [
      "100 Requests/Day",
      "Basic API Access",
      "Community Support",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$10",
    features: [
      "10,000 Requests/Day",
      "All API Access",
      "Email Support",
      "Higher Rate Limits",
    ],
    cta: "Go Pro",
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    features: [
      "Unlimited Requests",
      "All API Access",
      "Dedicated Support",
      "Custom Integrations",
    ],
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pricing Plans
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that's right for you.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription className="text-4xl font-bold">{tier.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{tier.cta}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
