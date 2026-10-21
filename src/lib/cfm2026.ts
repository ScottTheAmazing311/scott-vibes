// Come Follow Me 2026 (Old Testament) for the Kid Zone's Sunday Prep.
// Schedule source: churchofjesuschrist.org CFM 2026 contents page. The official
// manual lists scripture blocks per week, not titles, so kidTitle below is our
// own family-friendly name for the week, not an official lesson title.

export interface CfmWeek {
  /** ISO date of the week's Monday */
  start: string;
  /** scripture block, or the official special-week title */
  block: string;
}

export const cfmSchedule: CfmWeek[] = [
  { start: "2025-12-29", block: "Introduction to the Old Testament" },
  { start: "2026-01-05", block: "Moses 1; Abraham 3" },
  { start: "2026-01-12", block: "Genesis 1-2; Moses 2-3; Abraham 4-5" },
  { start: "2026-01-19", block: "Genesis 3-4; Moses 4-5" },
  { start: "2026-01-26", block: "Genesis 5; Moses 6" },
  { start: "2026-02-02", block: "Moses 7" },
  { start: "2026-02-09", block: "Genesis 6-11; Moses 8" },
  { start: "2026-02-16", block: "Genesis 12-17; Abraham 1-2" },
  { start: "2026-02-23", block: "Genesis 18-23" },
  { start: "2026-03-02", block: "Genesis 24-33" },
  { start: "2026-03-09", block: "Genesis 37-41" },
  { start: "2026-03-16", block: "Genesis 42-50" },
  { start: "2026-03-23", block: "Exodus 1-6" },
  { start: "2026-03-30", block: "Easter" },
  { start: "2026-04-06", block: "Exodus 7-13" },
  { start: "2026-04-13", block: "Exodus 14-18" },
  { start: "2026-04-20", block: "Exodus 19-20; 24; 31-34" },
  { start: "2026-04-27", block: "Exodus 35-40; Leviticus 1; 4; 16; 19" },
  { start: "2026-05-04", block: "Numbers 11-14; 20-24; 27" },
  { start: "2026-05-11", block: "Deuteronomy 6-8; 15; 18; 29-30; 34" },
  { start: "2026-05-18", block: "Joshua 1-8; 23-24" },
  { start: "2026-05-25", block: "Judges 2-4; 6-8; 13-16" },
  { start: "2026-06-01", block: "Ruth; 1 Samuel 1-7" },
  { start: "2026-06-08", block: "1 Samuel 8-10; 13; 15-16" },
  { start: "2026-06-15", block: "1 Samuel 17-18; 24-26; 2 Samuel 5-7" },
  { start: "2026-06-22", block: "2 Samuel 11-12; 1 Kings 3; 6-9; 11" },
  { start: "2026-06-29", block: "1 Kings 12-13; 17-22" },
  { start: "2026-07-06", block: "2 Kings 2-7" },
  { start: "2026-07-13", block: "2 Kings 16-25" },
  { start: "2026-07-20", block: "2 Chronicles 14-20; 26; 30" },
  { start: "2026-07-27", block: "Ezra 1; 3-7; Nehemiah 2; 4-6; 8" },
  { start: "2026-08-03", block: "Esther" },
  { start: "2026-08-10", block: "Job 1-3; 12-14; 19; 21-24; 38-40; 42" },
  { start: "2026-08-17", block: "Psalms 1-2; 8; 19-33; 40; 46" },
  { start: "2026-08-24", block: "Psalms 49-51; 61-66; 69-72; 77-78; 85-86" },
  { start: "2026-08-31", block: "Psalms 102-103; 110; 116-119; 127-128; 135-139; 146-150" },
  { start: "2026-09-07", block: "Proverbs 1-4; 15-16; 22; 31; Ecclesiastes 1-3; 11-12" },
  { start: "2026-09-14", block: "Isaiah 1-12" },
  { start: "2026-09-21", block: "Isaiah 13-14; 22; 24-30; 35" },
  { start: "2026-09-28", block: "Isaiah 40-49" },
  { start: "2026-10-05", block: "Isaiah 50-57" },
  { start: "2026-10-12", block: "Isaiah 58-66" },
  { start: "2026-10-19", block: "Jeremiah 1-3; 7; 16-18; 20" },
  { start: "2026-10-26", block: "Jeremiah 31-33; 36-39; Lamentations 1; 3" },
  { start: "2026-11-02", block: "Ezekiel 1-3; 33-34; 36-37; 47" },
  { start: "2026-11-09", block: "Daniel 1-7" },
  { start: "2026-11-16", block: "Hosea 1-6; 10-14; Joel" },
  { start: "2026-11-23", block: "Amos; Obadiah; Jonah" },
  { start: "2026-11-30", block: "Micah; Nahum; Habakkuk; Zephaniah" },
  { start: "2026-12-07", block: "Haggai 1-2; Zechariah 1-4; 7-14" },
  { start: "2026-12-14", block: "Malachi" },
  { start: "2026-12-21", block: "Christmas" },
];

export interface CfmActivity {
  id: string;
  title: string;
  detail: string;
}

export interface CfmLesson {
  /** matches cfmSchedule start */
  start: string;
  /** our kid-friendly name for the week, not an official title */
  kidTitle: string;
  story: string[];
  bigIdea: string;
  verse: { ref: string; text: string };
  activities: CfmActivity[];
  talkAbout: string[];
}

export const cfmLessons: CfmLesson[] = [
  {
    start: "2026-10-19",
    kidTitle: "The Potter and the Clay",
    story: [
      "When God asked Jeremiah to be a prophet, Jeremiah said he was too young and didn't know how to speak. God told him something amazing: before you were even born, I knew you, and I picked you for this.",
      "Later, God sent Jeremiah to watch a potter work. When a pot came out wrong, the potter didn't throw the clay away. He squished it down and shaped it again into something good. Jeremiah said God's message felt like a fire in his bones. He couldn't keep it in!",
    ],
    bigIdea: "Heavenly Father knew you before you were born, and He never gives up on shaping you into something wonderful.",
    verse: { ref: "Jeremiah 1:5", text: "Before I formed thee in the belly I knew thee." },
    activities: [
      { id: "potter", title: "Be the potter", detail: "Get out playdough or clay. Make a pot, squash it flat, then shape it into something even better. That's what God does with us when things go wrong." },
      { id: "baby", title: "Known before you were born", detail: "Look at baby pictures together. Ask Mom or Dad to tell one thing they noticed about you when you were tiny." },
      { id: "fire", title: "Fire in my bones", detail: "Jeremiah couldn't hold in good news. Play the whisper game: pass an exciting message around the family and see if it comes out right." },
    ],
    talkAbout: [
      "What would you say if God gave you a big job and you felt too small for it?",
      "When has one of your mistakes turned into something better?",
      "What good news is hard for you to keep in?",
    ],
  },
  {
    start: "2026-10-26",
    kidTitle: "Written on Your Heart",
    story: [
      "God made a promise through Jeremiah: one day His teachings wouldn't just be carved on stone. They would be written right inside people's hearts.",
      "A grumpy king cut up Jeremiah's scroll and burned it piece by piece. But you can't burn up God's word. Jeremiah just wrote it all again, even longer. And in the saddest book of the Bible, Jeremiah still wrote that God's mercies are brand new every single morning.",
    ],
    bigIdea: "The most important things you know don't live on paper. They live in your heart, and nobody can take them from there.",
    verse: { ref: "Lamentations 3:22-23", text: "His compassions fail not. They are new every morning." },
    activities: [
      { id: "hearts", title: "Heart promises", detail: "Cut out paper hearts. Everyone writes or draws one promise to keep this week, then tapes it to their bedroom door." },
      { id: "scroll", title: "The scroll that wouldn't quit", detail: "Write your family motto on paper. Crumple it up like the king! Then write it again, bigger and fancier than before." },
      { id: "morning", title: "New every morning jar", detail: "Each morning this week, drop a note in a jar: one thing you're happy about today. Read them all on Saturday." },
    ],
    talkAbout: [
      "Where do you keep the most important things you know?",
      "How could Jeremiah still have hope when everything went wrong?",
      "What feels brand new to you in the morning?",
    ],
  },
  {
    start: "2026-11-02",
    kidTitle: "Dry Bones Can Dance",
    story: [
      "Ezekiel saw some of the wildest visions in the whole Bible. God made him a watchman, a lookout whose job was to warn people and keep them safe. God also said He is like a shepherd who goes out looking for every single lost sheep.",
      "In his most famous vision, Ezekiel stood in a valley full of old dry bones. Then the bones rattled together, grew strong, and came back to life as a huge army. God was showing him that nothing is ever too broken or too lost for Him to fix.",
    ],
    bigIdea: "Nothing is too broken, too lost, or too dried up for Heavenly Father to bring back to life.",
    verse: { ref: "Ezekiel 36:26", text: "A new heart also will I give you, and a new spirit will I put within you." },
    activities: [
      { id: "bones", title: "Build a skeleton", detail: "Build a person out of pasta, sticks, or blocks. Then bring them to life: draw the same person happy, strong, and dancing." },
      { id: "watchman", title: "The watchman game", detail: "One person is the lookout. Everyone else tries to sneak across the hall. The watchman calls out a warning when they spot someone!" },
      { id: "sheep", title: "Find the lost sheep", detail: "Hide a stuffed animal somewhere in the house. The shepherd has to find it and carry it safely home." },
    ],
    talkAbout: [
      "Who watches out for you, and who do you watch out for?",
      "What's something that seemed totally ruined but got fixed?",
      "How do you think the lost sheep feels when the shepherd finds it?",
    ],
  },
  {
    start: "2026-11-09",
    kidTitle: "Brave Like Daniel",
    story: [
      "Daniel and his friends were carried far from home to Babylon. The king offered them his fancy food, but they chose simple food instead, and after ten days they were the strongest ones there. When everyone was told to bow to a giant gold statue, Shadrach, Meshach, and Abed-nego stood tall. They were thrown into a blazing furnace, but Someone stood in the fire with them, and they walked out without even smelling like smoke.",
      "Years later a law said nobody could pray. Daniel went home, opened his window, and prayed just like always. He spent the night in a den of hungry lions, and God shut their mouths tight.",
    ],
    bigIdea: "Being brave doesn't always look big. Sometimes it's just quietly doing the right thing, every day, no matter what.",
    verse: { ref: "Daniel 6:22", text: "My God hath sent his angel, and hath shut the lions' mouths." },
    activities: [
      { id: "veggies", title: "The ten day taste test", detail: "Daniel chose vegetables over the king's treats. Everyone tries one new vegetable tonight and rates it with stars." },
      { id: "den", title: "Lions' den fort", detail: "Build a den out of blankets and chairs. Climb in with a flashlight and tell the story of Daniel and the lions." },
      { id: "statue", title: "Stand tall", detail: "Play freeze dance. When the music stops, freeze standing tall like Daniel's friends, who would not bow no matter what." },
    ],
    talkAbout: [
      "When is it hardest to choose the right in front of friends?",
      "What do you do every single day no matter what, like Daniel's prayers?",
      "Who stood in the fire with Daniel's friends?",
    ],
  },
  {
    start: "2026-11-16",
    kidTitle: "Love That Never Quits",
    story: [
      "Hosea's whole life was a lesson about God's love. Even when people ran far away from God and forgot Him completely, He didn't stop loving them. He just kept calling them home, like a parent waiting at the door with open arms.",
      "The prophet Joel added a promise for the future: God would pour out His Spirit on everyone. Not just kings and prophets. Everyone. Even kids.",
    ],
    bigIdea: "You can never run so far that Heavenly Father stops loving you. His favorite thing is welcoming people home.",
    verse: { ref: "Hosea 14:4", text: "I will love them freely." },
    activities: [
      { id: "welcome", title: "Welcome home party", detail: "Plan a tiny surprise for someone coming home today: a sign, a cheer, or a high five tunnel at the door." },
      { id: "heartwall", title: "The heart that grows", detail: "Trace everyone's hands and arrange them into one big heart. Write the names of people who love you inside it." },
      { id: "pour", title: "Pour it out relay", detail: "Joel said God pours out His Spirit. Race to fill a cup to the very top using only a spoon. Teams allowed!" },
    ],
    talkAbout: [
      "What does it feel like to be welcomed back after a bad day?",
      "Who could use a bigger welcome from our family this week?",
      "What do you think it means that God pours His Spirit on kids too?",
    ],
  },
  {
    start: "2026-11-23",
    kidTitle: "Jonah and the Giant Fish",
    story: [
      "God asked Jonah to warn the city of Nineveh. Jonah didn't want to, so he got on a boat and sailed the opposite way. A huge storm came, Jonah ended up in the sea, and a giant fish swallowed him whole. Inside the fish, in the dark, Jonah prayed. The fish spit him out on the beach, and this time Jonah went.",
      "And here's the best part: the whole city listened, changed, and God forgave every one of them. The prophet Amos taught the same week's lesson a different way: God checks if our hearts are straight, like a builder checking a wall with a string.",
    ],
    bigIdea: "You can't outrun Heavenly Father's love, and nobody is too far gone for Him to forgive.",
    verse: { ref: "Jonah 2:2", text: "I cried by reason of mine affliction unto the Lord, and he heard me." },
    activities: [
      { id: "whale", title: "Build a blanket whale", detail: "Make the inside of a giant fish out of blankets and chairs. Climb in and tell Jonah's story from inside the belly." },
      { id: "compass", title: "The run away walk", detail: "One person calls out directions. First follow them exactly, then do the exact opposite. Where did running the wrong way get you?" },
      { id: "plumb", title: "The straight test", detail: "Amos used a plumb line. Tie a weight to a string, hold it up, and check doorways and block towers. Are they straight and true?" },
    ],
    talkAbout: [
      "Why do you think Jonah ran away?",
      "Is anyone too far away for Heavenly Father to love?",
      "Jonah prayed from inside a fish. Where's the strangest place you've said a prayer?",
    ],
  },
  {
    start: "2026-11-30",
    kidTitle: "A Baby Promised in Bethlehem",
    story: [
      "Seven hundred years before the first Christmas, the prophet Micah named the exact town where the Savior would be born. Not a big famous city. Tiny little Bethlehem.",
      "Micah also gave one of the simplest recipes for being good: be fair, love being kind, and walk humbly with God. And the prophet Habakkuk learned a secret for hard times: you can still sing, even when nothing is going right yet.",
    ],
    bigIdea: "God keeps His promises, even ones made hundreds of years early, and He loves doing big things in small places.",
    verse: { ref: "Micah 5:2", text: "But thou, Bethlehem... out of thee shall he come forth... that is to be ruler in Israel." },
    activities: [
      { id: "map", title: "Find Bethlehem", detail: "Hunt for Bethlehem on a map or globe. How far is it from your house? Who can guess closest?" },
      { id: "missions", title: "Three secret missions", detail: "Micah's recipe: one fair thing, one kind thing, one humble thing. Do all three in secret today and confess at dinner." },
      { id: "sing", title: "Sing anyway", detail: "Everyone shares one grumpy thing from their week. Then sing a favorite song together anyway, as loud as you can." },
    ],
    talkAbout: [
      "Why would God pick a tiny town instead of a big city?",
      "Which is easiest for you: being fair, being kind, or being humble? Which is hardest?",
      "What song makes you feel brave?",
    ],
  },
  {
    start: "2026-12-07",
    kidTitle: "Build What Matters First",
    story: [
      "When God's people finally came home from exile, they built their own houses first and left God's temple sitting in ruins. The prophet Haggai asked them a great question: why are your houses fancy while God's house is rubble? So they put first things first, and everything else started going better.",
      "Zechariah saw the future King coming. Not on a mighty war horse, but humble, riding a donkey. And he heard the secret of how God's work really gets done: not by muscles, not by armies, but by His Spirit.",
    ],
    bigIdea: "When you put the most important things first, everything else fits better behind them.",
    verse: { ref: "Zechariah 4:6", text: "Not by might, nor by power, but by my spirit, saith the Lord." },
    activities: [
      { id: "temple", title: "The great temple build", detail: "Build the grandest temple you can out of blocks or bricks. Every family member has to add at least one piece." },
      { id: "first", title: "First things first", detail: "Write things you do on slips of paper: prayers, video games, homework, brushing teeth. Now put them in order. What belongs first?" },
      { id: "parade", title: "The humble parade", detail: "Zechariah saw the King on a donkey while people laid down coats. Lay towels in a path and march a royal parade over them." },
    ],
    talkAbout: [
      "What does our family put first? What should we?",
      "Why would the true King ride a donkey instead of a war horse?",
      "What's something our family could finish building together?",
    ],
  },
  {
    start: "2026-12-14",
    kidTitle: "Windows of Heaven",
    story: [
      "Malachi wrote the very last book of the Old Testament, and he saved some of the best promises for the end. He said that when we give our tithing, God opens the windows of heaven and pours out more blessings than we even have room for.",
      "He also promised that the prophet Elijah would come back someday to turn the hearts of children to their fathers, which means families finding and loving each other across time. Grandparents, great-grandparents, all of us connected.",
    ],
    bigIdea: "God promises that giving and remembering your family both come back as blessings too big to hold.",
    verse: { ref: "Malachi 3:10", text: "I will... open you the windows of heaven, and pour you out a blessing." },
    activities: [
      { id: "coins", title: "Ten coins", detail: "Count out ten coins. Which one is tithing? Decorate a tithing jar so it's ready for your next ten." },
      { id: "call", title: "Hearts turning call", detail: "Call or video chat a grandparent. Ask them to tell you a story from when they were your age. That's Malachi's promise happening!" },
      { id: "sun", title: "Sun with healing wings", detail: "Malachi said the Son would rise with healing in his wings. Cut out a paper sun with wing shaped rays and write one blessing on each ray." },
    ],
    talkAbout: [
      "What blessings have come through our windows of heaven?",
      "Which grandparent story do you want to hear next?",
      "Why do you think Malachi's promises were saved for the very last page?",
    ],
  },
  {
    start: "2026-12-21",
    kidTitle: "The Savior Is Born",
    story: [
      "Everything we read all year long was pointing to this week. Isaiah called Him the Prince of Peace. Micah named the town of Bethlehem. Malachi called Him the sunrise with healing in His wings. For hundreds and hundreds of years, the prophets kept saying: He is coming.",
      "And then, on one quiet night, He came. Not to a palace. To a stable, with shepherds hurrying down the hills and angels filling the sky. Every promise in the whole Old Testament landed softly in a manger.",
    ],
    bigIdea: "Jesus Christ is the answer to every promise the prophets ever made. Christmas is the whole Old Testament coming true.",
    verse: { ref: "Luke 2:11", text: "For unto you is born this day in the city of David a Saviour, which is Christ the Lord." },
    activities: [
      { id: "nativity", title: "Act out the nativity", detail: "Towels and bathrobes make great costumes. Cast every single person, even if somebody has to be the sheep." },
      { id: "carols", title: "Candlelight carols", detail: "Turn off all the lights. Light candles or use flashlights, and sing two favorite carols together in the glow." },
      { id: "gift", title: "A gift for Jesus", detail: "It's His birthday! Everyone secretly writes one kind thing they'll do as a gift for Him. Seal them up to open next Christmas Eve." },
    ],
    talkAbout: [
      "If you had been there, what gift would you have carried to the manger?",
      "Which Old Testament story from this year pointed to Jesus best?",
      "What was your favorite week of Come Follow Me this year?",
    ],
  },
];
