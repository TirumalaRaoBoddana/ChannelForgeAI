import { auth } from "@/auth";

export default async function ProjectsPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
      <p className="text-muted-foreground">Manage your generated channels and assets here.</p>
    </div>
  );
}
