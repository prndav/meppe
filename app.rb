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
  register Sinatra::Namespace
  helpers Sinatra::JSON

  namespace '/categories' do
    get do # /categories
      content_type :json
      Category.all.to_json
    end

    get '/:id' do |id| # /categories/:id
      content_type :json
      Category.find(id).to_json
    end

    get '/:category_id/meppes' do |category_id| # categories/:category_id/meppes
      content_type :json
      Category.find(category_id).meppes.to_json
    end
  end

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
end

# before '/protected/*' do
#   authenticate!
# end

# after '/create/:slug' do |slug|
#   session[:last_slug] = slug
# end

# namespace '/orders' do
#     get do # /orders
#       @orders = Order.all
#       @dishes = DISHES
#       haml %s(orders/index)
#     end

#     get '/new' do # /orders/new
#       @dishes = DISHES
#       haml %s(orders/new)
#     end

#     post do # /orders
#       # binding.pry
#       @order = Order.create! params[:order]
#       params[:dishes].each do |dish|
#         OrderItem.create! order_id: @order.id, dish_id: dish
#       end

#       flash[:notice] = 'Thank you for placing the order.'
#       redirect '/orders/new'
#     end

#     put '/:id.json' do |id|
#       @order = Order.get id
#       @order.update done: params[:order][:done] # order[done]

#       json message: 'Order was successfully updated.'
#     end
#   end
