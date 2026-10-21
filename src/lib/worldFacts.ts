// Featured countries for the Kid Zone World Map. The `say` field is a rough
// kid-friendly pronunciation; `lang` is the BCP 47 tag handed to SpeechSynthesis
// (browsers fall back to a default voice when a language pack is missing).

export interface WorldCountry {
  /** ISO 3166-1 alpha-2, matches worldPaths.json ids */
  id: string;
  capital: string;
  hello: { word: string; say: string; lang: string };
  food: { name: string; desc: string };
  fact: string;
}

export const worldCountries: WorldCountry[] = [
  /* ---- North America ---- */
  { id: "US", capital: "Washington, D.C.", hello: { word: "Howdy", say: "HOW-dee", lang: "en-US" }, food: { name: "Cheeseburger", desc: "Invented in America and now eaten all over the planet." }, fact: "The United States has 63 national parks, and Yellowstone was the first national park in the whole world." },
  { id: "CA", capital: "Ottawa", hello: { word: "Bonjour", say: "bohn-ZHOOR", lang: "fr-CA" }, food: { name: "Poutine", desc: "French fries covered in gravy and squeaky cheese curds." }, fact: "Canada has more lakes than every other country on Earth combined." },
  { id: "MX", capital: "Mexico City", hello: { word: "Hola", say: "OH-lah", lang: "es-MX" }, food: { name: "Tacos al pastor", desc: "Sizzling meat carved off a spinning spit, with pineapple on top." }, fact: "If you clap your hands at the pyramid of Chichen Itza, the echo chirps back like a bird." },

  /* ---- South America ---- */
  { id: "BR", capital: "Brasília", hello: { word: "Olá", say: "oh-LAH", lang: "pt-BR" }, food: { name: "Pão de queijo", desc: "Warm, chewy little cheese bread puffs." }, fact: "The Amazon rainforest in Brazil is home to about one out of every ten animal species on Earth." },
  { id: "AR", capital: "Buenos Aires", hello: { word: "Hola", say: "OH-lah", lang: "es-AR" }, food: { name: "Empanadas", desc: "Little pastry pockets stuffed with yummy fillings." }, fact: "Some of the biggest dinosaurs ever found, like Argentinosaurus, were dug up in Argentina." },
  { id: "PE", capital: "Lima", hello: { word: "Hola", say: "OH-lah", lang: "es-PE" }, food: { name: "Lomo saltado", desc: "Sizzling beef stir fry served with rice AND french fries." }, fact: "Machu Picchu is a whole stone city hidden high in the clouds, built over 500 years ago." },
  { id: "CO", capital: "Bogotá", hello: { word: "Hola", say: "OH-lah", lang: "es-CO" }, food: { name: "Arepas", desc: "Warm corn cakes you can stuff with cheese or anything you like." }, fact: "Colombia has more kinds of birds than almost any country, nearly 2,000 different species." },
  { id: "CL", capital: "Santiago", hello: { word: "Hola", say: "OH-lah", lang: "es-CL" }, food: { name: "Completo", desc: "A hot dog piled sky-high with avocado and tomatoes." }, fact: "Chile's Atacama Desert is the driest place on Earth. Some spots have almost never seen rain." },

  /* ---- Europe ---- */
  { id: "GB", capital: "London", hello: { word: "Hello", say: "heh-LOH", lang: "en-GB" }, food: { name: "Fish and chips", desc: "Crispy fried fish with thick-cut fries, wrapped up hot." }, fact: "London's Underground is the oldest subway in the world. Trains have run there since 1863." },
  { id: "FR", capital: "Paris", hello: { word: "Bonjour", say: "bohn-ZHOOR", lang: "fr-FR" }, food: { name: "Croissant", desc: "A flaky, buttery crescent that shatters when you bite it." }, fact: "The Eiffel Tower grows about 15 centimeters taller in summer because heat makes the metal stretch." },
  { id: "ES", capital: "Madrid", hello: { word: "Hola", say: "OH-lah", lang: "es-ES" }, food: { name: "Paella", desc: "A giant pan of golden rice cooked with seafood or chicken." }, fact: "Every year one Spanish town holds La Tomatina, a festival that is basically a giant tomato fight." },
  { id: "IT", capital: "Rome", hello: { word: "Ciao", say: "CHOW", lang: "it-IT" }, food: { name: "Pizza margherita", desc: "The original pizza, born in Naples with tomato, mozzarella, and basil." }, fact: "Italy has a whole other country hiding inside it: Vatican City, the smallest country in the world." },
  { id: "DE", capital: "Berlin", hello: { word: "Hallo", say: "hah-LOH", lang: "de-DE" }, food: { name: "Brezel", desc: "A giant soft pretzel, golden outside and fluffy inside." }, fact: "Neuschwanstein, a real castle in Germany's mountains, helped inspire the Disney castle." },
  { id: "NO", capital: "Oslo", hello: { word: "Hei", say: "HAY", lang: "nb-NO" }, food: { name: "Brunost", desc: "A brown cheese that tastes a little like caramel. Really!" }, fact: "In northern Norway the summer sun never sets. It is bright outside even at midnight." },
  { id: "GR", capital: "Athens", hello: { word: "Yassou", say: "YAH-soo", lang: "el-GR" }, food: { name: "Gyros", desc: "Warm pita wrapped around sizzling meat, tomatoes, and tzatziki." }, fact: "The Olympic Games started in Greece about 2,800 years ago." },
  { id: "NL", capital: "Amsterdam", hello: { word: "Hallo", say: "hah-LOH", lang: "nl-NL" }, food: { name: "Stroopwafel", desc: "Two thin waffles glued together with warm caramel syrup." }, fact: "The Netherlands has more bicycles than people." },
  { id: "CH", capital: "Bern", hello: { word: "Grüezi", say: "GREW-tsee", lang: "de-CH" }, food: { name: "Fondue", desc: "A pot of melted cheese you dip bread into with long forks." }, fact: "Swiss people eat more chocolate than anyone else on Earth." },
  { id: "IE", capital: "Dublin", hello: { word: "Dia dhuit", say: "DEE-ah GWIT", lang: "ga-IE" }, food: { name: "Irish stew", desc: "A cozy pot of lamb, potatoes, and carrots." }, fact: "There are no wild snakes anywhere in Ireland. Not a single one." },
  { id: "IS", capital: "Reykjavík", hello: { word: "Halló", say: "hah-LOH", lang: "is-IS" }, food: { name: "Skyr", desc: "A thick, creamy yogurt Icelanders have eaten for a thousand years." }, fact: "The word geyser comes from Iceland, named after a real fountain of hot water called Geysir." },
  { id: "PT", capital: "Lisbon", hello: { word: "Olá", say: "oh-LAH", lang: "pt-PT" }, food: { name: "Pastel de nata", desc: "A little custard tart with a crackly, toasted top." }, fact: "Lisbon has the oldest bookstore on Earth. It has been selling books since 1732." },
  { id: "PL", capital: "Warsaw", hello: { word: "Cześć", say: "CHESH-ch", lang: "pl-PL" }, food: { name: "Pierogi", desc: "Soft dumplings stuffed with potato, cheese, or fruit." }, fact: "Poland has a salt mine with whole underground chapels carved completely out of salt." },

  /* ---- Africa ---- */
  { id: "EG", capital: "Cairo", hello: { word: "Ahlan", say: "AH-lahn", lang: "ar-EG" }, food: { name: "Koshari", desc: "A comfy bowl of rice, pasta, lentils, and crispy onions." }, fact: "The Great Pyramid was the tallest building on Earth for almost 4,000 years." },
  { id: "KE", capital: "Nairobi", hello: { word: "Jambo", say: "JAHM-boh", lang: "sw-KE" }, food: { name: "Ugali", desc: "A warm cornmeal dish you scoop up with your hands." }, fact: "Every year more than a million wildebeest thunder across Kenya in the Great Migration." },
  { id: "ZA", capital: "Pretoria (plus two more!)", hello: { word: "Sawubona", say: "sah-woo-BOH-nah", lang: "zu-ZA" }, food: { name: "Braai", desc: "A big backyard barbecue. Braai day is practically a holiday." }, fact: "South Africa has not one but THREE capital cities, one for each branch of government." },
  { id: "MA", capital: "Rabat", hello: { word: "Salam", say: "sah-LAHM", lang: "ar-MA" }, food: { name: "Tagine", desc: "A slow-cooked stew made in a pot with a wizard-hat lid." }, fact: "Morocco has a town called Chefchaouen where almost every building is painted bright blue." },
  { id: "NG", capital: "Abuja", hello: { word: "Bawo", say: "BAH-woh", lang: "yo-NG" }, food: { name: "Jollof rice", desc: "A smoky, spicy red rice that whole countries argue over who makes best." }, fact: "Nigeria's movie industry, Nollywood, makes more films every year than Hollywood does." },
  { id: "MG", capital: "Antananarivo", hello: { word: "Salama", say: "sah-LAH-mah", lang: "mg-MG" }, food: { name: "Romazava", desc: "A hearty beef and greens stew eaten with mountains of rice." }, fact: "Lemurs live in the wild in only one place on the whole planet: Madagascar." },
  { id: "TZ", capital: "Dodoma", hello: { word: "Jambo", say: "JAHM-boh", lang: "sw-TZ" }, food: { name: "Chipsi mayai", desc: "A french fry omelette. Yes, fries cooked right into the eggs." }, fact: "Mount Kilimanjaro is Africa's tallest mountain, with snow on top even though it sits near the equator." },

  /* ---- Asia ---- */
  { id: "JP", capital: "Tokyo", hello: { word: "Konnichiwa", say: "koh-nee-chee-WAH", lang: "ja-JP" }, food: { name: "Ramen", desc: "A steaming bowl of noodles, broth, and toppings to slurp loudly." }, fact: "Japan's bullet trains zoom at 200 miles per hour and are almost never late." },
  { id: "CN", capital: "Beijing", hello: { word: "Nǐ hǎo", say: "nee-HOW", lang: "zh-CN" }, food: { name: "Jiaozi", desc: "Dumplings the whole family folds together for good luck." }, fact: "The Great Wall of China stretches for thousands of miles. It is the longest thing humans have ever built." },
  { id: "IN", capital: "New Delhi", hello: { word: "Namaste", say: "nah-mah-STAY", lang: "hi-IN" }, food: { name: "Samosa", desc: "A crispy golden triangle stuffed with spiced potatoes." }, fact: "The game of chess was invented in India about 1,500 years ago." },
  { id: "KR", capital: "Seoul", hello: { word: "Annyeong", say: "ahn-NYOUNG", lang: "ko-KR" }, food: { name: "Bulgogi", desc: "Sweet and savory beef grilled right at the table." }, fact: "In South Korea, video game matches fill entire stadiums with cheering fans." },
  { id: "TH", capital: "Bangkok", hello: { word: "Sawasdee", say: "sah-wah-DEE", lang: "th-TH" }, food: { name: "Pad thai", desc: "Stir-fried noodles with peanuts, lime, and a little sizzle." }, fact: "Bangkok's full ceremonial name is 169 letters long, one of the longest city names in the world." },
  { id: "IL", capital: "Jerusalem", hello: { word: "Shalom", say: "shah-LOHM", lang: "he-IL" }, food: { name: "Falafel", desc: "Crunchy chickpea balls tucked into warm pita bread." }, fact: "The Dead Sea is so salty that you float on top of the water like a beach ball." },
  { id: "TR", capital: "Ankara", hello: { word: "Merhaba", say: "MEHR-hah-bah", lang: "tr-TR" }, food: { name: "Baklava", desc: "Layers of flaky pastry, honey, and crushed pistachios." }, fact: "The city of Istanbul sits on two continents at once: half in Europe, half in Asia." },
  { id: "VN", capital: "Hanoi", hello: { word: "Xin chào", say: "sin CHOW", lang: "vi-VN" }, food: { name: "Pho", desc: "A fragrant noodle soup families eat even for breakfast." }, fact: "Ha Long Bay has nearly 2,000 stone islands rising out of emerald green water." },
  { id: "PH", capital: "Manila", hello: { word: "Kumusta", say: "koo-MOOS-tah", lang: "fil-PH" }, food: { name: "Lumpia", desc: "Crispy little spring rolls that disappear fast at parties." }, fact: "The Philippines is made of more than 7,600 islands. Nobody could visit them all in one lifetime of vacations." },
  { id: "SA", capital: "Riyadh", hello: { word: "Salam", say: "sah-LAHM", lang: "ar-SA" }, food: { name: "Kabsa", desc: "A big festive platter of spiced rice and chicken to share." }, fact: "Saudi Arabia has zero rivers. Not one river flows through the whole country." },
  { id: "ID", capital: "Jakarta", hello: { word: "Halo", say: "HAH-loh", lang: "id-ID" }, food: { name: "Nasi goreng", desc: "Sweet and smoky fried rice, often topped with a fried egg." }, fact: "Komodo dragons, the biggest lizards on Earth, live wild only on a few Indonesian islands." },
  { id: "MN", capital: "Ulaanbaatar", hello: { word: "Sain baina uu", say: "SAIN BYE-noh", lang: "mn-MN" }, food: { name: "Buuz", desc: "Steamed dumplings filled with juicy meat." }, fact: "Mongolia is the least crowded country on Earth, with huge open grasslands and millions of horses." },

  /* ---- Oceania ---- */
  { id: "AU", capital: "Canberra", hello: { word: "G'day", say: "guh-DAY", lang: "en-AU" }, food: { name: "Meat pie", desc: "A warm, flaky hand-sized pie. Aussies eat millions of them." }, fact: "Australia has way more kangaroos than people." },
  { id: "NZ", capital: "Wellington", hello: { word: "Kia ora", say: "kee-ah OR-ah", lang: "en-NZ" }, food: { name: "Pavlova", desc: "A cloud of crispy meringue topped with cream and fruit." }, fact: "New Zealand has about five sheep for every single person." },
  { id: "FJ", capital: "Suva", hello: { word: "Bula", say: "BOO-lah", lang: "en-FJ" }, food: { name: "Kokoda", desc: "Fresh fish in coconut cream, cool and creamy on a hot day." }, fact: "Fiji is made of more than 300 islands, and Bula means hello, welcome, AND good health all at once." },
];
