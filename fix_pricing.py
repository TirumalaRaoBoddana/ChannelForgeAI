import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Make the Pro plan stand out more with the new accent token
# Find: className="rounded-3xl border-2 border-primary bg-card p-8 shadow-md relative"
# Replace with something that uses the accent for the glow/shadow and elevated look
pricing_card = r'className="rounded-3xl border-2 border-primary bg-card p-8 shadow-md relative"'
new_pricing_card = r'className="rounded-3xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10 relative transform md:-translate-y-2"'

content = content.replace(pricing_card, new_pricing_card)

with open('app/page.tsx', 'w') as f:
    f.write(content)
