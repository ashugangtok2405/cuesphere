import {
  Trophy,
  Users,
  Wallet,
  Target,
  Crown,
  Calendar,
  ImageOff,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { LiveBadge } from "@/components/shared/live-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";

const swatches = [
  { name: "Background", value: "#0B0E12", css: "bg-background border border-border" },
  { name: "Card", value: "#171A21", css: "bg-card border border-border" },
  { name: "Primary Gold", value: "#D4AF37", css: "bg-primary" },
  { name: "Success", value: "#00C853", css: "bg-success" },
  { name: "Danger", value: "#E53935", css: "bg-destructive" },
  { name: "Warning", value: "#F5A623", css: "bg-warning" },
  { name: "Info", value: "#3B9EFF", css: "bg-info" },
  { name: "Text Secondary", value: "#A0A6B0", css: "bg-muted-foreground" },
];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          XYZ Snooker Club
        </span>
        <h1 className="text-4xl font-bold sm:text-5xl">
          Design <span className="text-gradient-gold">System</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Luxury sports design language — dark, gold-accented, precision-built for tournaments,
          live scoring and rankings. Review each primitive below before we move on to layout.
        </p>
      </header>

      {/* Color palette */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Foundations" title="Color Palette" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className="space-y-2">
              <div className={`h-20 rounded-2xl ${s.css}`} />
              <p className="text-sm font-medium">{s.name}</p>
              <p className="font-tabular text-xs text-muted-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Foundations" title="Typography" />
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Poppins / Heading — H1</p>
              <h1 className="text-4xl font-bold">Monsoon Championship 2027</h1>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Poppins / Heading — H2</p>
              <h2 className="text-3xl font-bold">Quarter Finals — Table 2</h2>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Poppins / Heading — H3</p>
              <h3 className="text-xl font-semibold">Rahul Sharma vs Aman Verma</h3>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Inter / Body</p>
              <p className="text-base text-foreground">
                The premium snooker club where passion meets precision. Every frame tells a
                story.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Secondary text used for supporting copy and metadata.
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Roboto Mono / Scores &amp; Stats</p>
              <p className="font-tabular text-3xl font-bold text-primary">147 &middot; 05:42</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Buttons" />
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            <Button size="lg">Register for Tournament</Button>
            <Button variant="secondary" size="lg">
              Watch Live
            </Button>
            <Button variant="outline" size="lg">
              View Details
            </Button>
            <Button variant="ghost" size="lg">
              Ghost Action
            </Button>
            <Button variant="destructive" size="lg">
              Cancel Match
            </Button>
            <Button variant="link">Link style</Button>
            <Button size="icon" aria-label="Favorite">
              <Trophy className="size-4" />
            </Button>
            <Button size="lg" disabled>
              Disabled
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Badges &amp; Status" />
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            <LiveBadge />
            <StatusBadge status="upcoming" />
            <StatusBadge status="completed" />
            <StatusBadge status="registration-open" />
            <StatusBadge status="coming-soon" />
            <StatusBadge status="cancelled" />
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </CardContent>
        </Card>
      </section>

      {/* Stat cards */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Stat Cards" description="Animated counters, count up on scroll into view." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={<Trophy className="size-5" />} label="Tournaments" value={48} accent="gold" />
          <StatCard icon={<Users className="size-5" />} label="Players" value={624} accent="info" />
          <StatCard icon={<Target className="size-5" />} label="Matches" value={3826} accent="success" />
          <StatCard
            icon={<Wallet className="size-5" />}
            label="Prize Money"
            value={1200000}
            prefix="₹"
            accent="danger"
            trend={{ value: 12, positive: true }}
          />
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Cards" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="size-4 text-primary" /> Standard Card
              </CardTitle>
              <CardDescription>Hover for elevation lift</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rounded 16px corners, soft border, subtle shadow.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">
                Action
              </Button>
            </CardFooter>
          </Card>

          <div className="relative overflow-hidden rounded-2xl felt-texture p-6">
            <div className="absolute inset-0 bg-grid-fade opacity-40" />
            <div className="relative z-10 space-y-2">
              <Sparkles className="size-5 text-primary" />
              <p className="font-heading text-lg font-semibold">Felt Texture Surface</p>
              <p className="text-sm text-white/70">Used for hero panels &amp; table imagery overlays.</p>
            </div>
          </div>

          <div className="glass relative rounded-2xl p-6">
            <p className="font-heading text-lg font-semibold">Glass Navigation Surface</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Blurred translucent background for sticky navbars &amp; overlays.
            </p>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Form Elements" />
        <Card>
          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ds-name">Full Name</Label>
              <Input id="ds-name" placeholder="Rahul Sharma" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds-format">Tournament Format</Label>
              <Select>
                <SelectTrigger id="ds-format" className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="knockout">Knockout</SelectItem>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                  <SelectItem value="league">League + Playoffs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ds-message">Message</Label>
              <Textarea id="ds-message" placeholder="Tell us about your enquiry..." />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="ds-notify" defaultChecked />
              <Label htmlFor="ds-notify">Email notifications</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="ds-terms" defaultChecked />
              <Label htmlFor="ds-terms">I agree to the club rules</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tabs + Table */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Tabs &amp; Data Table" />
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="fixtures">
              <TabsList>
                <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="fixtures" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Highest Break</TableHead>
                      <TableHead className="text-right">Wins</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { player: "Rahul Sharma", rating: 1850, hb: 119, wins: 21 },
                      { player: "Aman Verma", rating: 1740, hb: 105, wins: 18 },
                      { player: "Vivek Singh", rating: 1685, hb: 98, wins: 15 },
                    ].map((row) => (
                      <TableRow key={row.player}>
                        <TableCell className="font-medium">{row.player}</TableCell>
                        <TableCell className="font-tabular">{row.rating}</TableCell>
                        <TableCell className="font-tabular text-primary">{row.hb}</TableCell>
                        <TableCell className="text-right font-tabular">{row.wins}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="results" className="mt-4 text-sm text-muted-foreground">
                Results content goes here.
              </TabsContent>
              <TabsContent value="stats" className="mt-4 text-sm text-muted-foreground">
                Stats content goes here.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Progress */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Progress" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Tournament Progress</span>
                <span>Quarter Finals</span>
              </div>
              <Progress value={62} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Skeletons */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Skeleton Loading" />
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Skeleton className="size-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Empty state */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Empty States" />
        <EmptyState
          icon={<ImageOff className="size-6" />}
          title="No gallery items yet"
          description="Photos and videos from tournaments will appear here once uploaded."
          action={<Button size="sm">Upload Media</Button>}
        />
      </section>

      {/* Dialog */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Components" title="Dialog" />
        <Dialog>
          <DialogTrigger render={<Button />}>
            <Calendar className="size-4" /> Open Dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Registration</DialogTitle>
              <DialogDescription>
                You are about to register for the Diwali Open 2027. Entry fee ₹1,000.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
