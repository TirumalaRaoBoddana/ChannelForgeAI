import re

with open('components/layout/footer.tsx', 'r') as f:
    content = f.read()

content = content.replace('href="#features"', 'href="/product"')
content = content.replace('href="#pricing"', 'href="/pricing"')
content = content.replace('href="#demo"', 'href="/product#demo"')
content = content.replace('href="#about"', 'href="/about"')
content = content.replace('href="#blog"', 'href="/blog"')

with open('components/layout/footer.tsx', 'w') as f:
    f.write(content)
