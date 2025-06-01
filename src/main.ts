import { bangs } from "./bang";
import "./global.css";

type Themes = 'light' | 'dark'

const defaultBang = () => {
  const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  return bangs.find((b) => b.t === LS_DEFAULT_BANG);
}

const validBang = (bang: string) => {
  return bangs.some((b) => b.t === bang);
}


function noSearchDefaultPageRender(app: HTMLDivElement) {
  const copyButton = app.querySelector<HTMLButtonElement>("#copyButton")!;
  const urlInput = app.querySelector<HTMLInputElement>("#urlInput")!;
  const defaultBangInput = app.querySelector<HTMLInputElement>("#defaultBang");
  const searchInput = app.querySelector<HTMLInputElement>("#search");
  const toast = app.querySelector<HTMLDivElement>("#toast");
  const themeToggle = app.querySelector<HTMLDivElement>("#themeToggle");
  const html = document.getElementsByTagName("html")[0]
  const searchBtn = app.querySelector<HTMLButtonElement>("#searchBtn");

  themeToggle?.addEventListener('click', () => {
    const oldTheme: Themes = html.getAttribute("data-theme") as Themes;

    if (oldTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  })


  searchBtn?.addEventListener('click', () => {
    doSearch()
  })
  const doSearch = () => {
    if (!searchInput) return;
    const val = searchInput.value;
    if (val.trim() === '') return;
    doBangRedirect(val);
  }
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      doSearch()
    }
  })

  // }

  urlInput.innerText = `${window.location.protocol}//${window.location.host}?q=%s`

  copyButton.addEventListener("click", async () => {
    try {

      await navigator.clipboard.writeText(urlInput.innerText);
    } catch (e) {

    }
    if (toast) {
      toast.innerText = 'Copied';
      toast.classList.add('show')
    }
    setTimeout(() => {
      if (toast) {
        toast.classList.remove('show');
      }
    }, 2000);
  });

  if (defaultBangInput !== null) {
    defaultBangInput.value = "!" + (localStorage.getItem("default-bang") ?? 'g')
    defaultBangInput.addEventListener("blur", () => {
      let value = defaultBangInput.value;
      if (value.startsWith('!')) {
        value = value.slice(1);
      }
      if (value === '') {
        value = 'g'
      }
      if (validBang(value)) {
        defaultBangInput.classList.remove("input-error")
        localStorage.setItem("default-bang", value)
        defaultBangInput.value = "!" + value
      } else {
        defaultBangInput.classList.add("input-error")
        console.log("Not a valid bang")
      }
    })
  }
}


function doBangRedirect(query: string) {
  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang();

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;
  window.location.href = searchUrl;
}

function getSystemTheme(): Themes {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  } else {
    return 'light'; // If not dark, it's typically light or no preference
  }
}

function setTheme(theme_name: Themes) {
  document.querySelector("html")?.setAttribute("data-theme", theme_name);
  localStorage.setItem('theme', theme_name)
}

function doRedirect() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    document.addEventListener('DOMContentLoaded', () => {
      // Your code here
      let currTheme = (localStorage.getItem('theme') as Themes) || getSystemTheme();
      setTheme(currTheme);
      const app = (document.querySelector<HTMLDivElement>("#app") as HTMLDivElement)

      noSearchDefaultPageRender(app);

      window.addEventListener('load', () => {
        app.style.opacity = "1";
      });

      // app.classList.
    });
    return null;
  } else {
    doBangRedirect(query)
  }

}
doRedirect();
// registerServiceWorker()