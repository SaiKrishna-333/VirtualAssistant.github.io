let btn = document.querySelector("#btn")
let content = document.querySelector("#content")
let voice = document.querySelector("#voice")

let voices = []
let selectedVoice = null

// This function gets available voices and selects one
function loadVoices() {
    voices = window.speechSynthesis.getVoices()
    selectedVoice = voices.find(voice => voice.lang === "Microsoft Hazel") // Change this to any desired language/voice code
}

// Call loadVoices once voices are available
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = loadVoices
} else {
    loadVoices() // In case voices are already loaded
}

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text)
    text_speak.rate = 1
    text_speak.pitch = 1
    text_speak.volume = 1
    text_speak.lang = "en-GB"
    window.speechSynthesis.speak(text_speak)
}

function wishMe() {
    let day = new Date()
    let hours = day.getHours()
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir")
    }
    else if (hours >= 12 && hours < 16) {
        speak("Good afternoon Sir")
    } else {
        speak("Good Evening Sir")
    }
}
// Fetch time from PHP
function fetchTime() {
    fetch('index.php?action=getTime')
        .then(response => response.json())
        .then(data => {
            console.log('Time data:', data);
            if (data.time) {
                speak("The current time is " + data.time);
            } else {
                throw new Error('Invalid time data');
            }
        })
        .catch(error => {
            console.error('Time fetch error:', error);
            let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
            speak(time);
        });
}
// Fetch date from PHP
function fetchDate() {
    fetch('index.php?action=getDate')
        .then(response => response.json())
        .then(data => {
            console.log('Date data:', data);
            if (data.date) {
                speak("Today's date is " + data.date);
            } else {
                throw new Error('Invalid date data');
            }
        })
        .catch(error => {
            console.error('Date fetch error:', error);
            let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
            speak(date);
        });
}

// Fetch greetings from JSON file
function fetchGreetings() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Greetings data:', data);
            let hours = new Date().getHours();
            let greeting = hours < 12 ? data.greetings.morning :
                hours < 18 ? data.greetings.afternoon :
                    data.greetings.evening;
            speak(greeting);
        })
        .catch(error => {
            console.error('Greetings fetch error:', error);
            speak("Hello buddy, how can I help you?");
        });
}

// Fetch "Who are you?" message from JSON file
function fetchWhoAreYou() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('WhoAmI data:', data);
            speak(data.whoAreYou);
        })
        .catch(error => {
            console.error('WhoAmI fetch error:', error);
            speak("I am virtual assistant named as Viras, created by Sai Krishna And Team");
        });
}

// Fetch and display greeting from XML
function fetchXMLGreetings() {
    fetch('data.xml')
        .then(response => response.text())
        .then(data => {
            console.log('XML Greetings data:', data);
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data, "text/xml");
            let hours = new Date().getHours();
            let greeting = hours < 12 ? xmlDoc.getElementsByTagName("morning")[0]?.childNodes[0]?.nodeValue :
                hours < 18 ? xmlDoc.getElementsByTagName("afternoon")[0]?.childNodes[0]?.nodeValue :
                    xmlDoc.getElementsByTagName("evening")[0]?.childNodes[0]?.nodeValue;
            speak(greeting || "Good day!");
        })
        .catch(error => {
            console.error('XML Greetings fetch error:', error);
            wishMe();
        });
}

// window.addEventListener('load',()=>{
//     wishMe()
// })
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = new speechRecognition()
recognition.onresult = (event) => {
    let currentIndex = event.resultIndex
    let transcript = event.results[currentIndex][0].transcript
    content.innerText = transcript
    takeCommand(transcript.toLowerCase())
}

btn.addEventListener("click", () => {
    recognition.start()
    voice.style.display = "block"
    btn.style.display = "none"
})
function takeCommand(message) {
    voice.style.display = "none"
    btn.style.display = "flex"

    if (message.includes("hello") || message.includes("hey") || message.includes("viras") || message.includes("hey viras") || message.includes("hello viras")) {
        fetchGreetings();
    }
    else if (message.includes("good morning")) {
        fetchXMLGreetings();
    }
    else if (message.includes("good afternoon")) {
        fetchXMLGreetings();
    }
    else if (message.includes("good evening")) {
        fetchXMLGreetings();
    }
    else if (message.includes("good night")) {
        fetchXMLGreetings();
    }
    else if (message.includes("who are you")) {
        fetchWhoAreYou();
    } else if (message.includes("open youtube")) {
        speak("opening youtube...")
        window.open("https://youtube.com/", "_blank")
    }
    else if (message.includes("open google")) {
        speak("opening google...")
        window.open("https://google.com/", "_blank")
    }
    else if (message.includes("open facebook")) {
        speak("opening facebook...")
        window.open("https://facebook.com/", "_blank")
    }
    else if (message.includes("open instagram")) {
        speak("opening instagram...")
        window.open("https://instagram.com/", "_blank")
    }
    else if (message.includes("open calculator")) {
        speak("opening calculator..")
        window.open("calculator://")
    }
    else if (message.includes("open whatsapp")) {
        speak("opening whatsapp..")
        window.open("whatsapp://")
    }
    else if (message.includes("time")) {
        fetchTime();
    }
    else if (message.includes("date")) {
        fetchDate();
    }
    // New function to search the news
    else if (message.includes("news") || message.includes("latest news")) {
        speak("Opening latest news...")
        window.open("https://news.google.com/", "_blank")
    }
    else if (message.includes("follow") && message.includes("on instagram")) {
        let name = message.replace("follow", "").replace("on instagram", "").trim();
        if (name) {
            speak(`Searching Instagram for accounts with the name ${name}...`);
            window.open(`https://www.instagram.com/explore/tags/${encodeURIComponent(name)}/`, "_blank");
        } else {
            speak("Please tell me the name of the Instagram account you want to follow.");
        }
    }

    // New function to open the weather website
    else if (message.includes("weather")) {
        speak("Opening weather updates...")
        window.open("https://weather.com/", "_blank")
    }

    // New function to open the Wikipedia page
    else if (message.includes("wikipedia") || message.includes("wiki")) {
        let searchTerm = message.replace("wikipedia", "").replace("wiki", "").trim()
        if (searchTerm) {
            speak("Searching Wikipedia for " + searchTerm)
            window.open(`https://en.wikipedia.org/wiki/${searchTerm}`, "_blank")
        } else {
            speak("Please tell me the topic you want to search on Wikipedia.")
        }
    }

    // New function to play music on YouTube
    else if (message.includes("play music") || message.includes("play song")) {
        speak("Playing music...")
        window.open("https://www.youtube.com/results?search_query=music", "_blank")
    }

    // New function to tell a joke
    else if (message.includes("tell me a joke")) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                speak(data.responses.joke || "Why don't skeletons fight each other? They don't have the guts!");
            })
            .catch(() => {
                speak("Why don't skeletons fight each other? They don't have the guts!");
            });
    }

    // New function to search for images on Google
    else if (message.includes("show me images of") || message.includes("images of")) {
        let searchTerm = message.replace("show me images of", "").replace("images of", "").trim()
        if (searchTerm) {
            speak("Here are images of " + searchTerm)
            window.open(`https://www.google.com/search?hl=en&tbm=isch&q=${searchTerm}`, "_blank")
        } else {
            speak("Please specify what images you'd like to see.")
        }
    }

    // New function to open Twitter
    else if (message.includes("open twitter")) {
        speak("Opening Twitter...")
        window.open("https://twitter.com/", "_blank")
    }

    // New function to open LinkedIn
    else if (message.includes("open linkedin")) {
        speak("Opening LinkedIn...")
        window.open("https://linkedin.com/", "_blank")
    }

    // New function to read a motivational quote
    else if (message.includes("motivational quote") || message.includes("quote")) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                speak(data.responses.quote || "The only way to do great work is to love what you do. - Steve Jobs");
            })
            .catch(() => {
                speak("The only way to do great work is to love what you do. - Steve Jobs");
            });
    }

    // New function to get the latest tech news
    else if (message.includes("tech news") || message.includes("technology news")) {
        speak("Opening the latest tech news...")
        window.open("https://techcrunch.com/", "_blank")
    }

    // New function to tell the time in a different time zone
    else if (message.includes("time in")) {
        let city = message.replace("time in", "").trim()
        if (city) {
            speak("Getting time for " + city + "...")
            // For simplicity, using Google's search to find the time in the specified city
            window.open(`https://www.google.com/search?q=time+in+${city}`, "_blank")
        } else {
            speak("Please tell me the city you're asking about.")
        }
    }

    // New function to read random facts
    else if (message.includes("tell me a fact") || message.includes("random fact")) {
        speak("Here is a random fact: Did you know that honey never spoils? Archaeologists have found pots of honey in ancient tombs that are over 3000 years old and still perfectly edible!")
    }

    // New function to play videos on YouTube based on a search
    else if (message.includes("play") && message.includes("video")) {
        let searchTerm = message.replace("play", "").replace("video", "").trim()
        if (searchTerm) {
            speak("Searching for a video on YouTube...")
            window.open(`https://www.youtube.com/results?search_query=${searchTerm}`, "_blank")
        } else {
            speak("Please tell me the video you want to play.")
        }
    }

    // New function to open a specific website by URL
    else if (message.includes("open") && message.includes("website")) {
        let website = message.replace("open", "").replace("website", "").trim()
        if (website) {
            speak("Opening " + website + "...")
            window.open(`https://${website}`, "_blank")
        } else {
            speak("Please provide the website name you want to open.")
        }
    }

    // else {
    //     let finalText = "this is what i found on internet regarding" + message.replace("Buddy", "") || message.replace("Buddy", "")
    //     speak(finalText)
    //     window.open(`https://www.google.com/search?q=${message.replace("Buddy", "")}`, "_blank")
    // }

    else if (message.includes("cricket") || message.includes("wicket")) {
        let searchTerm = message.replace("cricket", "").replace("wickets", "").trim();

        // If the search term is related to a query that ESPN Cricinfo's Ask page should handle:
        if (searchTerm) {
            speak("Redirecting you to ESPN Cricinfo's Ask section for your query...");
            // Construct the ESPN Cricinfo Ask URL with the query directly included in the search
            window.open(`https://www.espncricinfo.com/ask?search_query=${encodeURIComponent(searchTerm)}`, "_blank");
        } else {
            speak("Please provide a specific cricket question you would like to ask.");
        }
    }

    else if (message.includes("weather forecast") || message.includes("weather in")) {
        let city = message.replace("weather forecast", "").replace("weather in", "").trim();
        if (city) {
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    speak(data.responses.weather + " " + city);
                    window.open(`https://weather.com/weather/today/l/${city}`, "_blank");
                })
                .catch(() => {
                    speak("Fetching the weather forecast for " + city);
                    window.open(`https://weather.com/weather/today/l/${city}`, "_blank");
                });
        }
    }

    else if (message.includes("news about") || message.includes("latest news about")) {
        let topic = message.replace("news about", "").replace("latest news about", "").trim();
        if (topic) {
            speak(`Fetching the latest news about ${topic}...`)
            window.open(`https://news.google.com/search?q=${topic}`, "_blank")
        } else {
            speak("Please specify the topic you want the latest news about.")
        }
    }

    else if (message.includes("stock price of")) {
        let company = message.replace("stock price of", "").trim();
        if (company) {
            speak("Fetching the stock price for " + company + "...")
            window.open(`https://www.google.com/search?q=${company}+stock+price`, "_blank")
        } else {
            speak("Please tell me the company you want the stock price for.")
        }
    }

    else if (message.includes("convert") && message.includes("currency")) {
        let amounts = message.match(/\d+/);
        let currencies = message.match(/([a-zA-Z]+)/g);
        if (amounts && currencies && currencies.length >= 2) {
            let amount = amounts[0];
            let fromCurrency = currencies[0];
            let toCurrency = currencies[1];
            speak(`Converting ${amount} ${fromCurrency} to ${toCurrency}...`)
            window.open(`https://www.xe.com/currencyconverter/convert/?Amount=${amount}&From=${fromCurrency}&To=${toCurrency}`, "_blank")
        } else {
            speak("Please specify the amount and currencies to convert.")
        }
    }

    else if (message.includes("calculate") || message.includes("math")) {
        let calculation = message.replace("calculate", "").trim();
        if (calculation) {
            speak("Calculating " + calculation + "...")
            window.open(`https://www.google.com/search?q=${calculation}`, "_blank")
        } else {
            speak("Please tell me what you want to calculate.")
        }
    }

    else if (message.includes("define") || message.includes("meaning of")) {
        let word = message.replace("define", "").replace("meaning of", "").trim();
        if (word) {
            speak("Searching for the definition of " + word + "...")
            window.open(`https://www.google.com/search?q=define+${word}`, "_blank")
        } else {
            speak("Please tell me the word you want me to define.")
        }
    }

    else if (message.includes("suggest a movie") || message.includes("movie recommendations")) {
        speak("I recommend you watch 'Inception' if you like mind-bending thrillers!")
    }
    else if (message.includes("suggest a TV show") || message.includes("TV show recommendations")) {
        speak("How about 'Stranger Things' if you're into sci-fi horror?")
    }

    else if (message.includes("set an alarm") || message.includes("remind me")) {
        let time = message.replace("set an alarm for", "").replace("remind me to", "").trim();
        if (time) {
            speak(`Setting an alarm for ${time}...`)
            // Open clock app or trigger any reminder app (limited to browser functionality)
            window.open(`https://www.google.com/search?q=alarm+for+${time}`, "_blank");
        } else {
            speak("Please tell me the time for the alarm or reminder.")
        }
    }

    else if (message.includes("translate") || message.includes("in english") || message.includes("in kannada")) {
        let textToTranslate = message.replace("translate", "").replace("in english", "").replace("in kannada", "").trim();
        if (textToTranslate) {
            speak(`Translating "${textToTranslate}" into kannada...`)
            window.open(`https://translate.google.com/?sl=en&tl=es&text=${encodeURIComponent(textToTranslate)}&op=translate`, "_blank")
        } else {
            speak("Please provide the text you want me to translate.")
        }
    }

    else if (message.includes("quote of the day") || message.includes("daily quote")) {
        speak("Here is your quote of the day: 'The only way to do great work is to love what you do.' - Steve Jobs")
    }

    else if (message.includes("set a timer for")) {
        let duration = message.replace("set a timer for", "").trim();
        if (duration) {
            speak(`Setting a timer for ${duration}...`)
            // Timer feature requires a dedicated timer app or browser feature
            window.open(`https://www.google.com/search?q=set+timer+for+${duration}`, "_blank")
        } else {
            speak("Please specify the duration for the timer.")
        }
    }

    else if (message.includes("book flight to") || message.includes("flight to")) {
        let destination = message.replace("book flight to", "").replace("flight to", "").trim();
        if (destination) {
            speak("Searching for flights to " + destination + "...")
            window.open(`https://www.google.com/flights?q=${destination}`, "_blank")
        } else {
            speak("Please tell me the destination for your flight.")
        }
    }

    else if (message.includes("follow") && message.includes("on twitter")) {
        let account = message.replace("follow", "").replace("on twitter", "").trim();
        if (account) {
            speak(`Following ${account} on Twitter...`)
            window.open(`https://twitter.com/${account}`, "_blank")
        } else {
            speak("Please tell me the Twitter account you want to follow.")
        }
    }

    else if (message.includes("health tip") || message.includes("exercise")) {
        speak("Here's a health tip: Drink at least 8 glasses of water a day!")
    }

    else if (message.includes("health") || message.includes("exercise")) {
        let topic = message.replace("health", "").replace("exercise", "");
        if (topic) {
            speak(`Fetching the must follow tips about ${topic}...`)
            window.open(`https://news.google.com/search?q=${topic}`, "_blank")
        } else {
            speak("Please specify the topic you want the health tips about.")
        }
    }

    else if (message.includes("change background color")) {
        document.body.style.backgroundColor = "lightblue";
        speak("The background color has been changed to light blue!")
    }


    else if (message.includes("highest wicket taker") || message.includes("cricket")) {
        speak("Redirecting you to ESPN Cricinfo for cricket updates...");
        window.open("https://www.espncricinfo.com/ask ", "_blank");
    }
    // Check if the message contains keywords related to cricket or sports

    // Check if the message contains keywords related to other general queries (e.g., tech, news)
    else if (message.includes("who is") || message.includes("what is") || message.includes("when is")) {
        // You can check for more patterns here as needed
        speak("Let me find this information for you...");
        window.open(`https://www.google.com/search?q=${message}`, "_blank");
    }
    // For any other unmatched queries, fallback to a general search
    // else {
    //     speak(`Here are the details for ${message}`);
    //     window.open(`https://www.google.com/search?q=${message}`, "_blank");
    //     }
    else {
        fetch('data.xml')
            .then(response => response.text())
            .then(data => {
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(data, "text/xml");
                let defaultResponse = xmlDoc.getElementsByTagName("default")[0]?.childNodes[0]?.nodeValue
                    || `Here are the details for ${message}`;
                speak(defaultResponse);
                window.open(`https://www.google.com/search?q=${message}`, "_blank");
            })
            .catch(() => {
                speak(`Here are the details for ${message}`);
                window.open(`https://www.google.com/search?q=${message}`, "_blank");
            });
    }
}

const voiceHandler = (command) => {
    console.log('Voice command received:', command);
    // Your command handling logic
    try {
      // Execute command
      console.log('Command executed successfully');
    } catch (error) {
      console.error('Command failed:', error);
    }
  }
