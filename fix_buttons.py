import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Replace button onClick with link
# Starter button
content = content.replace(
    'onClick={() => window.scrollTo(0, 0)}>\n                  Start Free\n                </Button>',
    'asChild>\n                  <Link href="/signup">Start Free</Link>\n                </Button>'
)
# Pro button
content = content.replace(
    'onClick={() => window.scrollTo(0, 0)}>\n                  Upgrade to Pro\n                </Button>',
    'asChild>\n                  <Link href="/signup">Upgrade to Pro</Link>\n                </Button>'
)
# Make sure Link is imported
if 'import Link from "next/link";' not in content:
    content = content.replace('import { Button } from "@/components/ui/button";', 'import { Button } from "@/components/ui/button";\nimport Link from "next/link";')

with open('app/page.tsx', 'w') as f:
    f.write(content)
