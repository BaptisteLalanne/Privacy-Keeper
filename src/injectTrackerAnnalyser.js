//This class implements all methods to analyse trackers whithin a web page
console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHH")

const scripts = document.scripts;
console.log("Nb of scripts: " + scripts.length);

let nbBeacon = 0;
for (let i=0; i<scripts.length; i++) {
  if(scripts[i].src) {
    externalSourceLink = scripts[i].src;
    console.log(externalSourceLink);
    
  }
  const scriptContent = scripts[i].text;
  if(scriptContent.includes("sendBeacon")){
    console.log("FOUND Beacon!")
    nbBeacon ++;
  }
}
console.log("Nbbeacons found: " + nbBeacon);