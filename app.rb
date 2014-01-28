require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require './config/environments'

class Category < ActiveRecord::Base
  has_many :meppes
  has_many :points, through: :meppes
end
class Meppe < ActiveRecord::Base
  belongs_to :category
  has_many :points
end
class Point < ActiveRecord::Base
  belongs_to :meppe
end

class App < Sinatra::Base
  helpers Sinatra::JSON

  get '/' do
    'Hello World'
  end
end

