(()=>{
  const categoryCss=document.createElement('link');
  categoryCss.rel='stylesheet';
  categoryCss.href='assets/css/category-preview-layout.css?v=live-4';
  document.head.appendChild(categoryCss);

  const categoryFixCss=document.createElement('link');
  categoryFixCss.rel='stylesheet';
  categoryFixCss.href='assets/css/category-live-fix.css?v=hide-legacy-1';
  document.head.appendChild(categoryFixCss);

  const appScript=document.createElement('script');
  appScript.src='assets/js/app-demo-clean.js?v=render-1';
  appScript.async=false;
  document.currentScript.after(appScript);

  appScript.addEventListener('load',()=>{
    const categoryScript=document.createElement('script');
    categoryScript.src='assets/js/category-preview-layout.js?v=filter-fix-4';
    categoryScript.async=false;
    appScript.after(categoryScript);
  });
})();
