/** Inline script to avoid flash before DarkModeToggle mounts. */
export default function ThemeScript() {
  const code = `
(function(){
  try {
    var t = localStorage.getItem('alp-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
