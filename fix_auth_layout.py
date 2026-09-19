import re
import os

for path in ['app/login/page.tsx', 'app/signup/page.tsx']:
    if not os.path.exists(path):
        continue
    with open(path, 'r') as f:
        content = f.read()
    
    # Replace min-h-screen with min-h-[80vh] to avoid double-scrolling with header/footer
    content = content.replace('min-h-screen', 'min-h-[80vh]')
    
    with open(path, 'w') as f:
        f.write(content)

