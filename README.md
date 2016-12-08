## Chrome Extension Sidebar

This is an extension for Google Chrome. A sidebar where you can inject your html code.

### Download

You can add sidebar to your project like a git submodule:
```bash
git submodule add https://github.com/mrdaino/chromeSidebar.git
```
download library through npm
```bash
cd /path/your/project/root
cd sidebar
npm install
```
and add project folder to you .gitignore
```bash
cd /path/your/project/root
echo sidebar/ >> .gitignore
```

### Start

**1)** Put copy of out_manifest.json file in your root directory

**2)** Rename it to manifest.json

**3)** Put a copy of sidebar_injector.json in your root directory (not rename it!)

**4)** Replace content "[RESOURCE_TO_POINT_FOR_INJECTION]" with location your index.html file


**N.B:**

If your index.html file have script tag to file .js, you need to put sha256 code
in your manifest "content_security_policy" property. (Example in out_manifest.json)
