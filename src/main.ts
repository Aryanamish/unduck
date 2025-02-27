import { bangs } from "./bang";
import "./global.css";



const defaultBang = ()=>{
  const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  return bangs.find((b) => b.t === LS_DEFAULT_BANG);
}

const validBang = (bang:string)=>{
  return bangs.some((b) => b.t === bang);
}


function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `<div class="flex flex-col items-center justify-center h-screen">
        <div class="max-w-2xl mx-auto px-2 text-center">
          <h1 class="text-3xl font-semibold mb-4">Und*ck</h1>
          <p class="text-gray-600 mb-6">
            DuckDuckGo's bang redirects are too slow. Add the following URL as a
            custom search engine to your browser. Enables
            <a
              href="https://duckduckgo.com/bang.html"
              target="_blank"
              class="text-gray-700 hover:text-gray-900 underline"
              >all of DuckDuckGo's bangs.</a
            >
          </p>
          <div class="relative">
            <input
            id="search"
              type="text"
              placeholder="Search..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-100 outline-none"
            />
            <div class="w-6 h-6 absolute flex top-0 h-full ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="text-slate-500 w-full h-full">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21l-4.3-4.3" />
                </g>
              </svg>
          </div>

          </div>
          
          <div class="flex items-center gap-2 mt-4 w-full">
            <input
            id="urlInput"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 font-mono text-sm"
              value="https://unduck.link?q=%s"
              readonly
            />
            <button class="p-2 rounded hover:bg-gray-100 active:bg-gray-200" id="copyButton">
              <img
                src="/clipboard.svg"
                alt="Copy"
                class="w-5 h-5 text-gray-600"
              />
            </button>
          </div>
          <div class="flex gap-10 justify-between items-center mt-5">
            <label>Default Bang</label>
            <input
              id="defaultBang"
              placeholder="!g"
              class="flex-grow px-3 py-2 border border-gray-300 rounded bg-gray-100 font-mono text-sm"
            />
          </div>
          <div class="mt-4 flex items-center gap-2 w-full"></div>
        </div>
        <footer
          class="fixed bottom-4 inset-x-0 text-center text-sm text-gray-600"
        >
          <a
            href="https://t3.chat"
            target="_blank"
            class="font-medium hover:text-gray-800"
            >t3.chat</a
          >
          •
          <a
            href="https://x.com/theo"
            target="_blank"
            class="font-medium hover:text-gray-800"
            >theo</a
          >
          •
          <a
            href="https://github.com/t3dotgg/unduck"
            target="_blank"
            class="font-medium hover:text-gray-800"
            >github</a
          >
        </footer>
      </div>`
  const copyButton = app.querySelector<HTMLButtonElement>("#copyButton")!;
  const copyIcon = copyButton.querySelector<HTMLImageElement>("img");
  const urlInput = app.querySelector<HTMLInputElement>("#urlInput")!;
  const defaultBangInput = app.querySelector<HTMLInputElement>("#defaultBang");
  const searchInput = app.querySelector<HTMLInputElement>("#search")

  if(searchInput){
    searchInput.value = ""
    searchInput?.addEventListener("keydown", (e)=>{
      if(e.key === "Enter"){
        doBangRedirect(searchInput.value)
      }
    })
  }

  urlInput.value = `${window.location.protocol}//${window.location.host}?q=%s`

  copyButton.addEventListener("click", async () => {
    console.log("Loggin")
    await navigator.clipboard.writeText(urlInput.value);
    if(copyIcon){
      copyIcon.src = "/clipboard-check.svg";
      setTimeout(() => {
        copyIcon.src = "/clipboard.svg";
      }, 2000);
    }
  });

  if(defaultBangInput !== null){
    defaultBangInput.value = "!" + (localStorage.getItem("default-bang") ?? 'g')
    defaultBangInput.addEventListener("blur", ()=>{
      let value = defaultBangInput.value;
      if(value.startsWith('!')){
        value = value.slice(1);
      }
      if(value === ''){
        value = 'g'
      }
      if(validBang(value)){
        defaultBangInput.classList.remove("input-error")
        localStorage.setItem("default-bang", value)
        defaultBangInput.value = "!" + value
      }else{
        defaultBangInput.classList.add("input-error")
        console.log("Not a valid bang")
      }
    })
  }
}


function doBangRedirect(query:string) {
  
  

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang();

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;
  window.location.href  = searchUrl;
}

function doRedirect() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {

    noSearchDefaultPageRender();
    return null;
  }else{
    doBangRedirect(query)
  }
  
}
doRedirect()