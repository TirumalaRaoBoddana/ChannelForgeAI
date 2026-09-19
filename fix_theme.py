import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# 1. Hero Section
# change bg-zinc-50 dark:bg-zinc-950 to bg-accent/30 dark:bg-background
content = content.replace('bg-zinc-50 dark:bg-zinc-950', 'bg-accent/40 dark:bg-background')
# change text-zinc-900 dark:text-zinc-50 to text-foreground
content = content.replace('text-zinc-900 dark:text-zinc-50', 'text-foreground')

# 3. Product Preview
# change bg-zinc-50 dark:bg-zinc-900/10 to bg-secondary/40 dark:bg-zinc-900/10
content = content.replace('bg-zinc-50 dark:bg-zinc-900/10', 'bg-secondary/50 dark:bg-zinc-900/10')
# replace from-zinc-200 to-zinc-50 with from-border to-background
content = content.replace('from-zinc-200 to-zinc-50', 'from-border/50 to-background')

# 5. Before/After
# let's keep the dark section dark even in light mode? Prompt says:
# "Do not make the entire page one continuous white background... white content section -> light pricing section"
# Actually, the dark section is cool. I'll just change the blue gradient to primary gradient.
content = content.replace('from-blue-900/40', 'from-primary/20')
content = content.replace('border-blue-500/30', 'border-primary/30')
content = content.replace('bg-blue-500/20', 'bg-primary/20')
content = content.replace('text-blue-300', 'text-primary-foreground')
content = content.replace('text-blue-400', 'text-primary')

# 7. FAQ
content = content.replace('bg-zinc-50 dark:bg-zinc-900/20', 'bg-secondary/30 dark:bg-zinc-900/20')

# Features grid cards
# "subtle white/elevated surface, soft border, hover slightly elevate"
# Currently: className="bg-card border rounded-2xl p-6 text-left hover:border-primary/50 transition-colors"
content = content.replace('bg-card border rounded-2xl p-6 text-left hover:border-primary/50 transition-colors', 'bg-card border border-border/60 shadow-sm rounded-2xl p-6 text-left hover:shadow-md hover:border-primary/40 transition-all duration-300 hover:-translate-y-1')
content = content.replace('bg-primary/10 text-primary', 'bg-primary/10 text-primary')

with open('app/page.tsx', 'w') as f:
    f.write(content)
