cats = {'Sports' => {'Bike routes' => ['Lviv', 'Kyiv', 'Kharkiv'], 'Skate tracks' => ['Lviv', 'Kyiv', 'Kharkiv'], 'Pools' => ['Lviv', 'Kyiv', 'Kharkiv']},
        'Tourism' => {'Lakes' => ['Svityaz', 'Synevir'], 'Hiking' => ['Crimea', 'Hoverla']},
        'Bars' => {'Beer' => ['Lviv bar', 'Kyiv bar'], 'Vine' => ['Lviv vine', 'Kyiv vine'], 'Free snacks' => ['Lviv snacks', 'Kyiv snacks']},
        'Shops' => {'Grosery' => ['Ashan', 'Arsen'], 'Electronics' => ['Rozetka', 'Deshevshe'], 'Cloth' => ['Lviv secondhand', 'Kyiv secondhand']}
      }

cats.each do |cat_name, maps|
  c = Category.create(name: cat_name, description: "#{cat_name} description")
  maps.each do |map_name, points|
    m = c.meppes.create(name: map_name, lat: 49.839683, lng: 24.029717)
    points.each_with_index do |point_name, index|
      m.points.create(name: point_name, lat: 49.839683 + index*2, lng: 24.029717 - index*2)
    end
  end
end
