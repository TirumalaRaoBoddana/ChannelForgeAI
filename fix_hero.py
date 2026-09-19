import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Let's add a subtle primary gradient glow behind the hero in light mode
# Find the hero section container
hero_pattern = r'(<section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b">)'
new_hero = hero_pattern + r'\n          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />'

content = re.sub(hero_pattern, new_hero, content)

with open('app/page.tsx', 'w') as f:
    f.write(content)
