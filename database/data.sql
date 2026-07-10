-- BookVerse Seed Data
USE bookverse;

-- 1. Seed Users (passwords are BCrypt hash for 'password')
INSERT INTO users (name, email, password, role, status, profile_picture) VALUES
('System Administrator', 'admin@bookverse.com', '$2a$10$7R0wUq8UvjP9yT6lO6UDeOxZ67x3yS6Vd3n4Wl9D.z5u/KkCj22mK', 'ADMIN', 'ACTIVE', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'),
('John Doe', 'john.doe@gmail.com', '$2a$10$7R0wUq8UvjP9yT6lO6UDeOxZ67x3yS6Vd3n4Wl9D.z5u/KkCj22mK', 'CUSTOMER', 'ACTIVE', 'https://api.dicebear.com/7.x/adventurer/svg?seed=John'),
('Jane Smith', 'jane.smith@gmail.com', '$2a$10$7R0wUq8UvjP9yT6lO6UDeOxZ67x3yS6Vd3n4Wl9D.z5u/KkCj22mK', 'CUSTOMER', 'ACTIVE', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane'),
('Blocked User', 'blocked@bookverse.com', '$2a$10$7R0wUq8UvjP9yT6lO6UDeOxZ67x3yS6Vd3n4Wl9D.z5u/KkCj22mK', 'CUSTOMER', 'BLOCKED', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Blocked');

-- 2. Seed Addresses
INSERT INTO addresses (user_id, street, city, state, country, zip_code, phone, is_default) VALUES
(2, '123 Main St, Apt 4B', 'New York', 'NY', 'USA', '10001', '+15551234567', TRUE),
(2, '456 Business Rd', 'Boston', 'MA', 'USA', '02108', '+15557654321', FALSE),
(3, '789 Elm Lane', 'San Francisco', 'CA', 'USA', '94102', '+15559876543', TRUE);

-- 3. Seed Authors
INSERT INTO authors (name, bio) VALUES
('J.R.R. Tolkien', 'John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic, best known as the author of the high fantasy works The Hobbit and The Lord of the Rings.'),
('George Orwell', 'Eric Arthur Blair, better known by his pen name George Orwell, was an English novelist, essayist, journalist, and critic, famous for 1984 and Animal Farm.'),
('J.K. Rowling', 'Joanne Rowling, writing under the pen names J. K. Rowling and Robert Galbraith, is a British author, philanthropist, film producer, and screenwriter, best known for the Harry Potter series.'),
('Stephen King', 'Stephen Edwin King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.'),
('F. Scott Fitzgerald', 'Francis Scott Key Fitzgerald was an American novelist, essayist, screenwriter, and short-story writer, widely regarded as one of the greatest American writers of the 20th century.');

-- 4. Seed Publishers
INSERT INTO publishers (name, address) VALUES
('Penguin Random House', '1745 Broadway, New York, NY 10019, USA'),
('HarperCollins Publishers', '195 Broadway, New York, NY 10007, USA'),
('Bloomsbury Publishing', '50 Bedford Square, London, WC1B 3DP, UK');

-- 5. Seed Categories
INSERT INTO categories (name, description) VALUES
('Fantasy', 'Literature set in an imaginary universe, often associated with magic, supernatural events, and mythical creatures.'),
('Fiction', 'Literature in the form of prose, especially short stories and novels, that describes imaginary events and people.'),
('Science Fiction', 'A genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology.'),
('Mystery & Thriller', 'Suspenseful stories about solving a crime or uncovering secrets, filled with plot twists and high stakes.'),
('Biography', 'Detailed descriptions of a person\'s life, written by someone else.');

-- 6. Seed Books
INSERT INTO books (title, subtitle, isbn, author_id, publisher_id, category_id, language, description, price, discount_price, discount_percentage, stock, pages, publication_date, rating, review_count, cover_image) VALUES
('The Hobbit', 'There and Back Again', '9780261102217', 1, 2, 1, 'English', 'The Hobbit is a children\'s fantasy novel by English author J. R. R. Tolkien. It was published in 1937 to wide critical acclaim, opening the door to his masterpiece The Lord of the Rings.', 14.99, 12.99, 13, 25, 310, '1937-09-21', 4.8, 1, 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=400&auto=format&fit=crop'),
('The Fellowship of the Ring', 'The Lord of the Rings Book 1', '9780261102354', 1, 2, 1, 'English', 'The first part of J.R.R. Tolkien\'s epic fantasy masterpiece The Lord of the Rings, featuring the young hobbit Frodo Baggins as he inherits the One Ring.', 19.99, 17.99, 10, 15, 423, '1954-07-29', 4.9, 1, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop'),
('Nineteen Eighty-Four', 'A Novel', '9780451524935', 2, 1, 3, 'English', 'Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With every lie he writes, Winston grows to hate the Party that seeks power for its own sake.', 9.99, 8.49, 15, 50, 328, '1949-06-08', 4.7, 1, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop'),
('Animal Farm', 'A Fairy Story', '9780451526342', 2, 1, 2, 'English', 'A satirical allegorical novella by George Orwell, first published in England on 17 August 1945. The book tells the story of a group of farm animals who rebel against their human farmer.', 7.99, 7.99, 0, 8, 112, '1945-08-17', 4.5, 0, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop'),
('Harry Potter and the Sorcerer\'s Stone', 'Book 1', '9780590353427', 3, 3, 1, 'English', 'Harry Potter has no idea how famous he is. That\'s because he\'s being raised by his miserable aunt and uncle who are terrified he\'ll discover he\'s a wizard.', 12.99, 10.99, 15, 100, 309, '1997-06-26', 4.9, 1, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&auto=format&fit=crop'),
('The Shining', 'A Novel', '9780307743657', 4, 1, 4, 'English', 'Jack Torrance\'s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he\'ll have plenty of time to spend reconnecting with his family.', 15.99, 13.59, 15, 30, 447, '1977-01-28', 4.6, 0, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400&auto=format&fit=crop'),
('The Great Gatsby', 'Original Classic', '9780743273565', 5, 2, 2, 'English', 'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers.', 10.99, 9.99, 9, 3, 180, '1925-04-10', 4.4, 0, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop');

-- 7. Seed Book Images
INSERT INTO book_images (book_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=400&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop'),
(3, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop');

-- 8. Seed Coupons
INSERT INTO coupons (code, discount_amount, discount_type, min_purchase, start_date, expiry_date, is_active) VALUES
('SAVE10', 10.00, 'FLAT', 50.00, '2026-01-01', '2027-12-31', TRUE),
('WELCOME20', 20.00, 'PERCENTAGE', 0.00, '2026-01-01', '2027-12-31', TRUE),
('EXPIRED50', 50.00, 'FLAT', 100.00, '2025-01-01', '2025-12-31', FALSE);

-- 9. Seed Reviews
INSERT INTO reviews (user_id, book_id, rating, comment) VALUES
(2, 1, 5, 'Absolutely delightful. A masterpiece of fantasy literature that is a must-read for all ages.'),
(3, 2, 5, 'The world-building is unmatched. An epic journey begins and captures your imagination completely.'),
(2, 3, 4, 'A chillingly prophetic depiction of totalitarianism. Very thought-provoking.'),
(2, 5, 5, 'This book started a magic revolution! Reading it again brought back all the childhood nostalgia.');

-- 10. Seed Notifications
INSERT INTO notifications (user_id, title, message, is_read) VALUES
(2, 'Welcome to BookVerse!', 'Thank you for signing up for BookVerse. Start exploring our wide collection of books today!', FALSE),
(2, 'Exclusive Offer', 'Get 20% off on your first order with coupon code WELCOME20 at checkout!', FALSE),
(3, 'Welcome to BookVerse!', 'Thank you for signing up for BookVerse. Start exploring our wide collection of books today!', TRUE);

-- 11. Seed Wishlist
INSERT INTO wishlists (user_id, book_id) VALUES
(2, 3),
(2, 5),
(3, 1);

-- 12. Seed Cart Items
INSERT INTO cart_items (user_id, book_id, quantity) VALUES
(2, 1, 1),
(2, 2, 2),
(3, 5, 1);
