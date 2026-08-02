package com.bookverse.backend.config;

import com.bookverse.backend.entity.*;
import com.bookverse.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
public class DataSeederRunner implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final BookExcerptRepository bookExcerptRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;

    public DataSeederRunner(BookRepository bookRepository,
                            BookExcerptRepository bookExcerptRepository,
                            AuthorRepository authorRepository,
                            CategoryRepository categoryRepository,
                            PublisherRepository publisherRepository) {
        this.bookRepository = bookRepository;
        this.bookExcerptRepository = bookExcerptRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.publisherRepository = publisherRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedAuthors();
        seedPublishers();
        seedIndianBooksAndExcerpts();
        seedExcerptsForExistingBooks();
    }

    private void seedCategories() {
        createCategoryIfNotExist("Indian Classics", "Classic literature from the Indian subcontinent across multiple regional languages.");
        createCategoryIfNotExist("Historical Fiction", "Fiction set in a historical period with real or imagined historical characters.");
        createCategoryIfNotExist("Drama", "Narrative fiction intended to be more serious than humorous, focusing on character interactions.");
        createCategoryIfNotExist("Biography", "Autobiographies and biographical accounts of prominent personalities.");
        createCategoryIfNotExist("History", "Historical writings and accounts documenting ancient, medieval, and modern events.");
        createCategoryIfNotExist("Philosophy", "Philosophical treaties, wisdom literature, and spiritual thoughts.");
    }

    private void seedAuthors() {
        createAuthorIfNotExist("R.K. Narayan", "Rasipuram Krishnaswami Iyer Narayanaswami was an Indian writer known for his work set in the fictional South Indian town of Malgudi.");
        createAuthorIfNotExist("Munshi Premchand", "Dhanpat Rai Srivastava, better known by his pen name Munshi Premchand, was an Indian writer famous for his modern Hindustani literature.");
        createAuthorIfNotExist("Satyam Sankaramanchi", "Satyam Sankaramanchi was an eminent Telugu writer, famous for his short stories Amaravati Kathalu.");
        createAuthorIfNotExist("Mokkapati Narasimha Sastry", "Mokkapati Narasimha Sastry was a prominent Telugu writer, best known for his humorous novel Barrister Parvateesam.");
        createAuthorIfNotExist("Kalki Krishnamurthy", "Ramaswamy Krishnamurthy, better known by his pen name Kalki, was a Tamil writer, journalist, and historical novelist.");
        createAuthorIfNotExist("Khushwant Singh", "Khushwant Singh was an Indian novelist, lawyer, politician, and journalist, famous for his historical novel Train to Pakistan.");
        createAuthorIfNotExist("A.P.J. Abdul Kalam", "Avul Pakir Jainulabdeen Abdul Kalam was an Indian aerospace scientist and statesman who served as the 11th President of India.");
        createAuthorIfNotExist("Jawaharlal Nehru", "Jawaharlal Nehru was an Indian anti-colonial nationalist, secular humanist, social democrat, and author, who served as the first Prime Minister of India.");
        createAuthorIfNotExist("Sumitranandan Pant", "Sumitranandan Pant was an Indian poet, one of the major poets of the Chhayavaad school of Hindi literature.");
        createAuthorIfNotExist("Mahadevi Varma", "Mahadevi Varma was an Indian Hindi poet, essayist, sketch writer, and an eminent personality of Hindi literature.");
        createAuthorIfNotExist("Gurajada Apparao", "Gurajada Venkata Apparao was a Telugu playwright, poet, novelist, and social reformer, famous for his drama Kanyasulkam.");
        createAuthorIfNotExist("Viswanatha Satyanarayana", "Viswanatha Satyanarayana was a 20th-century Telugu writer, first Telugu writer to receive the Jnanpith Award.");
        createAuthorIfNotExist("Thiruvalluvar", "Thiruvalluvar was a celebrated Tamil poet and philosopher, best known as the author of the Thirukkural.");
    }

    private void seedPublishers() {
        createPublisherIfNotExist("National Book Trust", "Nehru Bhawan, 5 Institutional Area, Phase-II, Vasant Kunj, New Delhi, Delhi 110070, India");
        createPublisherIfNotExist("Jaico Publishing House", "121, Mahatma Gandhi Road, Mumbai, Maharashtra 400001, India");
    }

    private void createCategoryIfNotExist(String name, String desc) {
        if (!categoryRepository.existsByName(name)) {
            categoryRepository.save(Category.builder().name(name).description(desc).build());
        }
    }

    private void createAuthorIfNotExist(String name, String bio) {
        if (!authorRepository.existsByName(name)) {
            authorRepository.save(Author.builder().name(name).bio(bio).build());
        }
    }

    private void createPublisherIfNotExist(String name, String address) {
        if (!publisherRepository.existsByName(name)) {
            publisherRepository.save(Publisher.builder().name(name).address(address).build());
        }
    }

    private void seedIndianBooksAndExcerpts() {
        // 1. The Guide (English)
        createIndianBookIfNotExist(
                "The Guide",
                "Classic Novel of Malgudi",
                "9788129114389",
                "R.K. Narayan",
                "Jaico Publishing House",
                "Indian Classics",
                "English",
                "The Guide is a 1958 novel written by R. K. Narayan. The book brought him the Sahitya Akademi Award in 1960. The novel describes the transformation of the protagonist, Raju, from a tour guide to a spiritual guide and one of the greatest holy men of India.",
                new BigDecimal("11.99"),
                30,
                220,
                LocalDate.of(1958, 3, 1),
                "/the_guide_cover.png",
                List.of(
                        new ExcerptSeed(1, "Raju's Release", "Raju welcomed the release from prison. It was a bright morning. He sat on the steps of the river Sarayu, thinking of his past life as a tourist guide in Malgudi, his love for Rosie, and how he got embroiled in forgery. A villager named Velan mistook him for a holy man and sat quietly by his feet."),
                        new ExcerptSeed(2, "Rosie's Dance", "Rosie was a passionate dancer, but her husband Marco despised her art. Raju saw the spark in her eyes. 'You are a born star, Rosie,' he told her. That was the beginning of their secret romance and the rise of Nalini, the stage name that took the cultural world by storm.")
                )
        );

        // 2. Godan (Hindi)
        createIndianBookIfNotExist(
                "Godan",
                "गोदान - प्रेमचंद का अमर उपन्यास",
                "9788121606707",
                "Munshi Premchand",
                "National Book Trust",
                "Indian Classics",
                "Hindi",
                "गोदान, प्रेमचन्द का अन्तिम और सबसे महत्वपूर्ण उपन्यास माना जाता है। इसमें भारतीय ग्रामीण जीवन और कृषक समाज की समस्याओं का सजीव चित्रण किया गया है। उपन्यास की कहानी होरी महतो और उसकी पत्नी धनिया के चारों ओर घूमती है।",
                new BigDecimal("8.99"),
                40,
                340,
                LocalDate.of(1936, 6, 15),
                "/godan_cover.png",
                List.of(
                        new ExcerptSeed(1, "होरी का संकल्प", "होरी महतो ने बैलों को सानी-पानी देकर अपनी लाठी कंधे पर रखी और पत्नी धनिया से बोला- 'गोबर को ज़रा देख लेना, वह बहुत आलसी हो गया है। मैं ज़रा महाराज के दर्शन करने जा रहा हूँ।' धनिया ने उसे टोकते हुए कहा- 'दर्शन करने जा रहे हो या काम से? ज़रा संभल कर जाना।' होरी के मन में वर्षों से एक ही इच्छा थी—एक गाय पालने की। वह सोचता था कि यदि उसके द्वार पर एक गाय बंध जाए, तो उसका जीवन धन्य हो जाएगा।"),
                        new ExcerptSeed(2, "धनिया का विद्रोह", "जब गोबर ने गाँव की एक गरीब लड़की झुनिया से प्रेम किया, तो पंचायत ने होरी के परिवार पर भारी दंड लगा दिया। होरी झुनिया को अपने घर में पनाह देने से कतरा रहा था, लेकिन धनिया शेरनी की तरह खड़ी हो गई। उसने चिल्लाकर कहा- 'मैं इस लड़की को घर से बाहर नहीं जाने दूँगी! समाज चाहे जो कहे, हम धर्म का पालन करेंगे।'")
                )
        );

        // 3. Amaravati Kathalu (Telugu)
        createIndianBookIfNotExist(
                "Amaravati Kathalu",
                "అమరావతి కథలు - ప్రసిద్ధ కథా సంకలనం",
                "9789351448891",
                "Satyam Sankaramanchi",
                "National Book Trust",
                "Indian Classics",
                "Telugu",
                "అమరావతి కథలు సత్యం శంకరమంచి రాసిన ప్రసిద్ధ తెలుగు కథల సంపుటి. ఆంధ్రప్రదేశ్ లోని అమరావతి గ్రామం మరియు దాని చుట్టుపక్కల నివసించే సాధారణ ప్రజల జీవితాలు, వారి ఆచారాలు, నమ్మకాలు ఈ కథల ద్వారా అద్భుతంగా చిత్రించబడ్డాయి.",
                new BigDecimal("9.50"),
                25,
                180,
                LocalDate.of(1975, 8, 20),
                "/amaravati_kathalu_cover.png",
                List.of(
                        new ExcerptSeed(1, "వరదలు మరియు నది ఒడ్డు", "కృష్ణా నది పరవళ్ళు తొక్కుతోంది. అమరావతి గ్రామంలో ప్రజలందరూ వరదల భయంతో నది ఒడ్డున గుమిగూడారు. ఆలయ పూజారి గారు అమ్మవారి విగ్రహాన్ని కాపాడటానికి ఆలయంలోనే ఉండిపోయారు. నది ఉధృతి పెరుగుతున్న కొద్దీ ఊరి పెద్దలు మరియు యువకులు అందరూ పూజారి గారిని రక్షించడానికి ధైర్యంగా నదిలోకి వెళ్ళాలని నిశ్చయించుకున్నారు."),
                        new ExcerptSeed(2, "దేవుడి ఊరేగింపు", "దసరా ఉత్సవాల సందర్భంగా ఊరిలో పెద్ద కోలాహలం నెలకొంది. దేవుడి రథాన్ని లాగడానికి భక్తులు ఎగబడుతున్నారు. కానీ హఠాత్తుగా రథం చక్రం ఇసుకలో కూరుకుపోయింది. ఎంత మంది ప్రయత్నించినా కదలలేదు. అప్పుడు ఊరిలో ఉన్న ఒక చిన్న బాలుడు వచ్చి భక్తితో రథాన్ని తాకగానే అది ముందుకు కదిలింది.")
                )
        );

        // 4. Barrister Parvateesam (Telugu)
        createIndianBookIfNotExist(
                "Barrister Parvateesam",
                "బారిస్టర్ పార్వతీశం - హాస్య నవల",
                "9788126315802",
                "Mokkapati Narasimha Sastry",
                "Jaico Publishing House",
                "Drama",
                "Telugu",
                "బారిస్టర్ పార్వతీశం మొగలిగీత వెంకట నరసింహశాస్త్రి రాసిన అద్భుతమైన హాస్య నవల. ఒక పల్లెటూరి యువకుడు ఇంగ్లాండ్ వెళ్లి బారిస్టర్ చదవడానికి చేసే ప్రయాణంలో ఎదుర్కొనే హాస్యాస్పదమైన సంఘటనల సమాహారం ఈ నవల.",
                new BigDecimal("7.99"),
                15,
                250,
                LocalDate.of(1924, 5, 10),
                "/barrister_parvateesam_cover.png",
                List.of(
                        new ExcerptSeed(1, "మొదటి ప్రయాణం", "పార్వతీశం ఇంగ్లాండ్ వెళ్లి బారిస్టర్ చదవాలని నిర్ణయించుకున్నాడు. కానీ అతనికి ఇంగ్లీష్ రాదు, పైగా కొత్త ప్రదేశాలు అంటే భయం. గుంటూరు నుండి మద్రాసు వెళ్లే రైలు ఎక్కడానికి స్టేషన్ కి వచ్చాడు. బండి రాగానే గందరగోళంలో మూడో తరగతి పెట్టెలో దూరి అందరినీ తోసుకుంటూ కూర్చున్నాడు. పక్కన ఉన్న పెద్ద మనుషులు అతని వేషధారణ చూసి నవ్వసాగారు."),
                        new ExcerptSeed(2, "స్టీమర్ ఎక్కడం", "మద్రాస్ లో కొన్ని రోజులు ఉన్న తర్వాత ఇంగ్లాండ్ వెళ్లే పెద్ద ఓడ (స్టీమర్) ఎక్కడానికి రేవుకు చేరుకున్నాడు పార్వతీశం. సముద్రపు నీటిని చూసి అతనికి కళ్ళు తిరిగాయి. ఓడ లోపల డెక్ పైన ఉన్న పెద్ద గదిని చూసి ఇది ఒక చిన్న ఊరులా ఉందే అనుకున్నాడు. తోటి ప్రయాణికులతో సంభాషించడానికి పడ్డ ఇబ్బందులు అన్నీ ఇన్నీ కావు.")
                )
        );

        // 5. Ponniyin Selvan (Tamil)
        createIndianBookIfNotExist(
                "Ponniyin Selvan",
                "பொன்னியின் செல்வன் - வரலாற்று புதினம்",
                "9788126300051",
                "Kalki Krishnamurthy",
                "Jaico Publishing House",
                "Historical Fiction",
                "Tamil",
                "பொன்னியின் செல்வன் கல்கி கிருஷ்ணமூர்த்தியால் எழுதப்பட்ட ஒரு புகழ்பெற்ற தமிழ் வரலாற்றுப் புதினம். சோழப் பேரரசின் மாபெரும் மன்னனான முதலாம் இராஜராஜ சோழனின் இளமைக்கால வரலாற்றை அடிப்படையாகக் கொண்டு இந்த நாவல் எழுதப்பட்டுள்ளது.",
                new BigDecimal("15.99"),
                50,
                600,
                LocalDate.of(1950, 10, 29),
                "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=400",
                List.of(
                        new ExcerptSeed(1, "ஆடித்திருநாள்", "புது வெள்ளம் பாய்ந்து வரும் காவிரியின் கரையில் ஆடிப் பெருக்கு விழா கோலாகலமாக நடந்து கொண்டிருந்தது. சோழ நாட்டு இளவரசன் வந்தியத்தேவன் தன் குதிரையின் மேல் ஏறி தஞ்சாவூரை நோக்கிப் பயணம் செய்து கொண்டிருந்தான். அவன் வழியில் வீரநாராயண ஏரியின் பிரம்மாண்டமான அழகைக் கண்டு வியந்தான். ஏரியின் கரையில் மக்கள் கூட்டம் கூட்டமாக நின்று விழா கொண்டாடுவதைக் கண்டு அவன் நெஞ்சம் மகிழ்ச்சியில் திளைத்தது."),
                        new ExcerptSeed(2, "நந்தினியின் மாயம்", "வந்தியத்தேவன் கடம்பூர் மாளிகைக்குள் நுழைந்த போது, அங்கே ஏதோ இரகசிய சதி நடப்பதை உணர்ந்தான். பழுவேட்டரையரின் இளம் மனைவி நந்தினியின் அழகும் அவளது கண்களில் தெரிந்த மர்மமும் அவனை நடுங்கச் செய்தது. அவள் ஒரு சாதாரணப் பெண் அல்ல, சோழ வம்சத்தை அழிக்க வந்த மாய அரசி என்பதை அவன் விரைவில் புரிந்து கொண்டான்.")
                )
        );
    }

    private void createIndianBookIfNotExist(String title, String subtitle, String isbn,
                                            String authorName, String publisherName, String categoryName,
                                            String language, String desc, BigDecimal price, int stock, int pages,
                                            LocalDate pubDate, String coverUrl, List<ExcerptSeed> excerpts) {
        Optional<Book> existing = bookRepository.findByIsbn(isbn);
        if (existing.isPresent()) {
            Book book = existing.get();
            book.setCoverImage(coverUrl);
            book.setLanguage(language);
            bookRepository.save(book);
        } else {
            Author author = authorRepository.findByName(authorName).orElseThrow();
            Publisher publisher = publisherRepository.findByName(publisherName).orElseThrow();
            Category category = categoryRepository.findByName(categoryName).orElseThrow();

            Book book = Book.builder()
                    .title(title)
                    .subtitle(subtitle)
                    .isbn(isbn)
                    .author(author)
                    .publisher(publisher)
                    .category(category)
                    .language(language)
                    .description(desc)
                    .price(price)
                    .stock(stock)
                    .pages(pages)
                    .publicationDate(pubDate)
                    .coverImage(coverUrl)
                    .rating(BigDecimal.valueOf(4.5))
                    .reviewCount(0)
                    .build();

            Book savedBook = bookRepository.save(book);

            for (ExcerptSeed ex : excerpts) {
                bookExcerptRepository.save(BookExcerpt.builder()
                        .book(savedBook)
                        .chapterNumber(ex.chapterNumber)
                        .chapterTitle(ex.chapterTitle)
                        .content(ex.content)
                        .build());
            }
        }
    }

    private void seedExcerptsForExistingBooks() {
        List<Book> books = bookRepository.findAll();
        for (Book book : books) {
            // Only seed generic excerpts if it's one of the original seed books and has no excerpts yet
            if (bookExcerptRepository.findByBookIdOrderByChapterNumberAsc(book.getId()).isEmpty()) {
                seedExcerptsForGenericBook(book);
            }
        }
    }

    private void seedExcerptsForGenericBook(Book book) {
        String title = book.getTitle();
        if (title.contains("Hobbit")) {
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(1)
                    .chapterTitle("An Unexpected Party")
                    .content("In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.\n\nIt had a perfectly round door like a porthole, painted green, with a shiny yellow brass knob in the exact middle. The door opened on to a tube-shaped hall like a tunnel: a very comfortable tunnel without smoke, with panelled walls, and floors tiled and carpeted, provided with polished chairs, and lots and lots of pegs for hats and coats—the hobbit was fond of visitors. The tunnel wound on and on, going fairly but not quite straight into the side of the hill—The Hill, as all the people for many miles round called it—and many little round doors opened out of it, first on one side and then on another. No going upstairs for him: bedrooms, bathrooms, cellars, pantries (lots of these), wardrobes (he had whole rooms devoted to clothes), kitchens, dining-rooms, all were on the same floor, and indeed on the same passage.")
                    .build());
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(2)
                    .chapterTitle("Roast Mutton")
                    .content("Bilbo rushed out of the door, up the Hill, and down the road. He had no pocket-handkerchief, no hat, and no money. But he had a pocketful of dreams. The dwarves were waiting for him by the Great Dragon Inn, ready to begin the legendary quest.\n\nThey marched through the misty hills as darkness settled. Soon, a light flickered in the distance. 'Go and inspect that light, hobbit,' whispered Thorin. Bilbo sneaked closer, only to discover three massive trolls sitting around a fire, roasting mutton. 'What's a hobbit?' grumbled one troll, grabbing Bilbo by the neck.")
                    .build());
        } else if (title.contains("Fellowship")) {
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(1)
                    .chapterTitle("A Long-expected Party")
                    .content("When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.\n\nBilbo was very rich and very peculiar, and had been the wonder of the Shire for sixty years, ever since his remarkable disappearance and unexpected return. The riches he had brought back from his travels had now become a local legend, and it was popular belief, whatever the old folk might say, that the Hill at Bag End was full of tunnels stuffed with treasure. And if that was not enough for fame, there was also his prolonged vigour to marvel at. Time wore on, but it seemed to have little effect on Mr. Baggins. At ninety he was much the same as at fifty. At ninety-nine they began to call him well-preserved; but unaltered would have been nearer the mark. There were some that shook their heads and thought this was too much of a good thing; it seemed unfair that anyone should possess (apparently) perpetual youth as well as (reputedly) inexhaustible wealth.")
                    .build());
        } else if (title.contains("Nineteen Eighty-Four") || title.contains("1984")) {
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(1)
                    .chapterTitle("Big Brother is Watching")
                    .content("It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.\n\nThe hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features. Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during the daylight hours. It was part of the economy drive in preparation for Hate Week. The flat was seven flights up, and Winston, who was thirty-nine and had a varicose ulcer above his right ankle, went slowly, resting several times on the way. On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall. It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran.")
                    .build());
        } else if (title.contains("Animal Farm")) {
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(1)
                    .chapterTitle("Old Major's Dream")
                    .content("Mr. Jones, of the Manor Farm, had locked the hen-houses for the night, but was too drunk to remember to shut the pop-holes. With the ring of light from his lantern dancing from side to side, he lurched across the yard, kicked off his boots at the back door, drew himself a last glass of beer from the barrel in the scullery, and made his way up to bed, where Mrs. Jones was already snoring.\n\nAs soon as the light in the bedroom went out, there was a stirring and a fluttering all through the farm buildings. Word had gone round during the day that old Major, the prize Middle White boar, had had a strange dream on the previous night and wished to communicate it to the other animals.")
                    .build());
        } else if (title.contains("Harry Potter")) {
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(1)
                    .chapterTitle("The Boy Who Lived")
                    .content("Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious, because they just didn't hold with such nonsense.\n\nMr. Dursley was the director of a firm called Grunnings, which made drills. He was a big, beefy man with hardly any neck, although he did have a very large mustache. Mrs. Dursley was thin and blonde and had nearly twice the usual amount of neck, which came in very useful as she spent so much of her time necking over garden fences, spying on the neighbors. The Dursleys had a small son called Dudley and in their opinion there was no finer boy anywhere.")
                    .build());
        } else if (title.contains("Gatsby")) {
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(1)
                    .chapterTitle("In My Younger Years")
                    .content("In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.\n\n'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'\n\nHe didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.")
                    .build());
        } else {
            bookExcerptRepository.save(BookExcerpt.builder()
                    .book(book)
                    .chapterNumber(1)
                    .chapterTitle("Introduction")
                    .content("Welcome to the exclusive excerpt preview of " + title + ". This introductory chapter introduces the central themes, character motivations, and historical context of the text.\n\nReading a preview allows you to get a taste of the author's writing style, language flow, and structural choices before deciding to purchase the complete edition for your personal library.")
                    .build());
        }
    }

    private static class ExcerptSeed {
        int chapterNumber;
        String chapterTitle;
        String content;

        ExcerptSeed(int chapterNumber, String chapterTitle, String content) {
            this.chapterNumber = chapterNumber;
            this.chapterTitle = chapterTitle;
            this.content = content;
        }
    }
}
