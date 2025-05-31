import { bangs } from "./bang";
import "./global.css";



const defaultBang = () => {
  const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  return bangs.find((b) => b.t === LS_DEFAULT_BANG);
}

const validBang = (bang: string) => {
  return bangs.some((b) => b.t === bang);
}


function noSearchDefaultPageRender(app: HTMLDivElement) {
  const copyButton = app.querySelector<HTMLButtonElement>("#copyButton")!;
  const copyIcon = copyButton.querySelector<HTMLImageElement>("img");
  const urlInput = app.querySelector<HTMLInputElement>("#urlInput")!;
  const defaultBangInput = app.querySelector<HTMLInputElement>("#defaultBang");
  const searchInput = app.querySelector<HTMLInputElement>("#search");
  const toast = app.querySelector<HTMLDivElement>("#toast");

  if (searchInput) {
    searchInput.value = ""
    searchInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        doBangRedirect(searchInput.value)
      }
    })
  }

  urlInput.innerText = `${window.location.protocol}//${window.location.host}?q=%s`

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.innerText);
    if (copyIcon) {
      if (toast) {
        toast.innerText = 'Copied';
        toast.classList.add('show')
      }
      setTimeout(() => {
        if (toast) {
          toast.classList.remove('show');
        }
      }, 2000);
    }
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



function doRedirect() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    document.addEventListener('DOMContentLoaded', () => {
      // Your code here
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach(link => {
        link.media = 'print';
        link.onload = () => { link.media = 'all'; };
      });
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