<h1>Chrome Extension Sidebar</h1>

This is an extension for Google Chrome. A sidebar where you can inject your html code.
To start to use this you can add this project like a git submodule:
<code>
    git submodule add https://github.com/mrdaino/chromeSidebar.git
</code>
and add project folder to you .gitignore
<code>
    cd /path/your/project/root
    echo sidebar/ >> .gitignore
</code>
1) Put copy of out_manifest.json file in your root directory
2) Rename it to manifest.json
3) Put a copy of sidebar_injector.json in your root directory (not rename it!)
4) Replace content "[RESOURCE_TO_POINT_FOR_INJECTION]" with location your index.html file


N.B:
if your index.html file have script tag to file .js, you need to put sha256 code
in your manifest "content_security_policy" property. (Example in out_manifest.json)
