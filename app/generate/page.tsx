"use client";

import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/custom/page-header";
import { GenerationCard } from "@/components/custom/generation-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function GenerateWorkflow() {
  const searchParams = useSearchParams();
  const idea = searchParams.get("idea") || "A new YouTube channel...";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <PageHeader 
          title="Generating Your Channel..." 
          description="Our AI is crafting your complete brand identity. This will take just a moment." 
        />
      </div>
      <div className="mt-8 space-y-6">
         <GenerationCard 
           status="generating" 
           prompt={idea} 
           progress={25} 
         />
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateWorkflow />
    </Suspense>
  )
}
