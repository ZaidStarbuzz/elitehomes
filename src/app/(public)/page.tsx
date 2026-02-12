import Link from "next/link";
import { Building2, BedDouble, Shield, Users, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const features = [
  {
    icon: Building2,
    title: "Multi-Hostel Management",
    description:
      "Manage multiple hostels from a single dashboard. Each hostel gets isolated data and dedicated admin access.",
  },
  {
    icon: BedDouble,
    title: "Room & Bed Allocation",
    description:
      "Track rooms, beds, and occupancy in real-time. Auto-assign beds and manage availability effortlessly.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description:
      "Complete guest lifecycle from booking to checkout. Self-service portal for residents.",
  },
  {
    icon: Shield,
    title: "Staff & Operations",
    description:
      "Role-based access for wardens, cooks, and maintenance staff. Complaint tracking and task management.",
  },
];

const stats = [
  { value: "50+", label: "Hostels Managed" },
  { value: "10K+", label: "Beds Tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
              <Star className="mr-2 h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              Trusted by 50+ hostels across India
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Modern Hostel Management,{" "}
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              {APP_NAME} is the all-in-one platform to manage your hostels, rooms,
              guests, staff, and finances. Built for scale, designed for
              simplicity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From room allocation to financial tracking, {APP_NAME} handles every
              aspect of hostel operations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Rajesh Kumar",
                role: "Hostel Owner, Mumbai",
                quote:
                  "EliteHomes transformed how we manage our 3 hostels. Occupancy tracking and automated billing saved us hours every week.",
              },
              {
                name: "Priya Sharma",
                role: "Hostel Admin, Bangalore",
                quote:
                  "The complaint management system alone was worth it. Our residents love the self-service portal.",
              },
              {
                name: "Ahmed Khan",
                role: "Hostel Chain Manager, Delhi",
                quote:
                  "Managing 500+ beds across 5 locations is effortless now. The multi-tenant setup is exactly what we needed.",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Modernize Your Hostel?
            </h2>
            <p className="text-muted-foreground">
              Join hundreds of hostel owners who trust {APP_NAME} for their daily
              operations. Start your free trial today.
            </p>
            <Link href="/register">
              <Button size="lg">
                Get Started for Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
