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

  const copyButton = app.querySelector<HTMLButtonElement>("#copyButton")!;
  const copyIcon = copyButton.querySelector<HTMLImageElement>("img");
  const urlInput = app.querySelector<HTMLInputElement>("#urlInput")!;
  const defaultBangInput = app.querySelector<HTMLInputElement>("#defaultBang");

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


function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {

    noSearchDefaultPageRender();
    return null;
  }

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

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}
doRedirect()