import { auth } from "@/auth";
import { handleSignOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <form action={handleSignOut}>
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>
            You are signed in securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User avatar"} />
            <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{session?.user?.name || "Anonymous User"}</h2>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
