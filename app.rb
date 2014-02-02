require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require './sinatra/resource_routes'
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
  register Sinatra::ResourceRoutes
  register Sinatra::Namespace
  helpers Sinatra::JSON

  # namespace '/categories' do
  #   get do # /categories
  #     content_type :json
  #     Category.all.to_json
  #   end

  #   get '/:id' do |id| # /categories/:id
  #     content_type :json
  #     Category.find(id).to_json
  #   end

  #   get '/:category_id/meppes' do |category_id| # categories/:category_id/meppes
  #     content_type :json
  #     Category.find(category_id).meppes.to_json
  #   end
  # end

  namespace '/meppes' do
    get do # /meppes
      content_type :json
      Meppe.all.to_json
    end

    get '/:id' do |id| # /meppes/:id
      content_type :json
      Meppe.find(id).to_json
    end

    get '/:meppe_id/points' do |meppe_id| # / meppes/:meppe_id/points
      content_type :json
      Meppe.find(meppe_id).points.to_json
    end
  end

  namespace '/points' do
    get do # /points
      content_type :json
      Point.all.to_json
    end

    get '/:id' do |id| # /points/:id
      # content_type :json
      Point.find(id).to_json
    end
  end

  resources :category do |scope|
    resources :meppe, scope: scope
  end
end

# ['/one', '/two', '/three'].each do |route|
#   get route do
#   "Triggered #{route} via GET"
#   end
# end
# before '/protected/*' do
#   authenticate!
# end

# after '/create/:slug' do |slug|
#   session[:last_slug] = slug
# end

# before('/index') { ... } # executed only before the '/index' route

# not_found do
# "Whoops! You requested a route that wasn't available."
# end

# error do
# "Y U NO WORK?"
# end

