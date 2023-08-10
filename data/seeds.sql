INSERT INTO breweries (brewery_name, brewery_city, brewery_state)
VALUES 
    -- 1
    ('4 Hands', 'St. Louis', 'MO');

INSERT INTO ratings (value)
VALUES
    -- 1 vv
    (0.25), 
    -- 2 vv
    (0.50),
    -- 3 vv
    (0.75),
    -- 4 vv
    (1.00),
    -- 5 vv
    (1.25),
    -- 6 vv
    (1.50),
    -- 7 vv
    (1.75),
    -- 8 vv
    (2.00),
    -- 9 vv
    (2.25),
    -- 10 vv
    (2.50),
    -- 11 vv
    (2.75),
    -- 12 vv
    (3.00),
    -- 13 vv
    (3.25),
    -- 14 vv
    (3.50),
    -- 15 vv
    (3.75),
    -- 16 vv
    (4.00),
    -- 17 vv
    (4.25),
    -- 18 vv
    (4.50),
    -- 19 vv
    (4.75),
    -- 20 vv
    (5.00);

INSERT INTO locations (location_name, location_city, location_state)
VALUES
    -- 1
    ('Global Brew Taphouse', 'Edwardsville', 'IL'),
    ('Global Brew Taphouse', "O'fallon", 'IL');

INSERT INTO styles (name)
VALUES
    -- 1-15 ++(IPA)++ vv
    ('Imperial IPA'),
    ('American IPA'),
    ('New England IPA'),
    ('IPA'),
    ('Double IPA'),
    ('Triple IPA'),
    ('Rye IPA'),
    -- 8 vv
    ('Belgian IPA'),
    ('Belgian Double IPA'),
    ('Double New England IPA'),
    ('Triple New England IPA'),
    ('West Coast IPA'),
    ('Double West Coast IPA'),
    ('English Brown Ale'),
    ('Black IPA'),

    -- 16-20 ++(Pale Ale)++ vv
    ('Pale Ale'),
    ('Double Pale Ale'),
    ('Hoppy Pale'),
    ('English Pale'),
    ('Triple Pale'),

    -- 21-29  ++(Pilsner, Blondes)++ vv
    ('Pilsner'),
    ('German Pilsner'),
    ('Czech Pilsner'),
    ('Hoppy Pilsner'),
    ('Hazy Pilsner'),
    ('Blonde Ale'),
    ('Hoppy Blonde'),
    ('Belgian Blonde'),
    ('White Ale'),

    -- 30-37 ++(Lager)++ vv
    ('Lager'),
    ('Mexican Lager'),
    ('Black Lager'),
    ('Munich Lager'),
    ('Dark Lager'),
    ('Pale Lager'),

    -- 38-48 ++(Amber, Red, Brown, Porter)++
    ('Porter'),
    ('Imperial Porter'),
    ('Brown Ale'),
    ('Coffee Brown'),
    ('Amber Ale'),
    ('Red Ale'),
    ('English Red Ale'),
    ('English Style Bitter'),
    ('Winter Ale'),
    ('Old Ale'),
    ('Irish Red'),

    -- 49-64 ++(Stouts)++ vv
    ('Irish Stout'),
    ('Dry Stout'),
    ('Sweet Stout'),
    ('Double Stout'),
    ('Triple Stout'),
    ('American Stout'),
    ('Milk Stout'),
    ('White Stout'),
    ('Chocolate Stout'),
    ('Coffee Stout'),
    ('English Stout'),
    ('Espresso Stout'),
    ('Pastry Stout'),
    ('Double Pastry Stout'),
    ('Imperial Pastry Stout'),

    -- 65-70 ++(Barrel Aged)++ vv
    ('Barrel Aged Brown'),
    ('Barrel Aged Porter'),
    ('Barrel Aged Ale'),
    ('Barrel Aged Stout'),
    ('Barrel Aged Russian Imperial Stout'),
    ('Barrel Aged Baltic Porter'),

    -- 71-93 ++(Wheats, Belgians, Import Skews)++ vv
    ('Belgian Ale'),
    ('Farmhouse Ale'),
    ('Saison'),
    -- 74 vv
    ('American Saison'),
    ('Belgian Dubbel'),
    ('Belgian Trippel'),
    ('Belgian Quad'),
    ('Trappist Ale'),
    ('Belgian Strong Golden Ale'),
    ('Belgian Strong Dark Ale'),
    ('Belgian Strong Ale'),
    ('Hefeweizen'),
    ('Dopplebock'),
    -- 84 vv
    ('Schwarzbier'),
    ('Dunkel'),
    ('Zwickelbier'),
    ('Weizendopplebock'),
    ('Kolsch'),
    ('Munich Dunkel'),
    ('Witbier'),
    ('Weissbier'),
    ('Scotch Ale'),
    ('Fruited Wheat'),

    -- 94-99 ++(Sours)++ vv
    ('Fruited Sour'),
    ('Sour Ale'),
    ('Wild Ale'),
    ('Foeder Aged Sour'),
    ('Belgian Sour'),
    ('Flanders Red'),

    -- 100-105 ++(Sweet Stuff)++ vv
    ('Dry Cider'),
    ('Cider'),
    ('Radler'),
    ('Sweet Cider'),
    ('Hard Seltzer'),
    ('Framboise'),

    -- 106 ++(Other)++ vv
    ('Gluten Free'),
    ('Non-Alcoholic'),
    ('Ale');

INSERT INTO beers (name, brewery_name, style_id, abv, rating_id, date_drunk, location_id, notes)
VALUES
    ('Warhammer', 1, 1, 9.0, 18, '2023-02-22', 1, "Happy it's back. Love this beer." );



