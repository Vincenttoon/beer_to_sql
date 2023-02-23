INSERT INTO breweries (name)
VALUES 
    -- 1
    ('4 Hands'),

INSERT INTO ratings (value)
VALUES
    -- 1 vv
    ('0.25') 
    -- 2 vv
    ('0.50')
    -- 3 vv
    ('0.75')
    -- 4 vv
    ('1.00')
    -- 5 vv
    ('1.25')
    -- 6 vv
    ('1.50')
    -- 7 vv
    ('1.75')
    -- 8 vv
    ('2.00')
    -- 9 vv
    ('2.25')
    -- 10 vv
    ('2.50')
    -- 11 vv
    ('2.75')
    -- 12 vv
    ('3.00')
    -- 13 vv
    ('3.25')
    -- 14 vv
    ('3.50')
    -- 15 vv
    ('3.75')
    -- 16 vv
    ('4.00')
    -- 17 vv
    ('4.25')
    -- 18 vv
    ('4.50')
    -- 19 vv
    ('4.75')
    -- 20 vv
    ('5.00');

INSERT INTO locations (name, city, state)
VALUES
    -- 1
    ('Global Brew Taphouse', 'Edwardsville', 'IL'),
    ('Global Brew Taphouse', "O'fallon", 'IL');

INSERT INTO styles (name)
VALUES
    ('Imperial IPA')

INSERT INTO beers (name, brewery_id, style_id, abv, rating_id, date_drunk, location_id, notes)
VALUES
    ('Warhammer', 1, 1, 9.0, 18, '2023-02-22', 1, "Happy it's back. Love this beer." )



