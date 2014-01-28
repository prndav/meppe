# app.rb

require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require './environments'

class Category < ActiveRecord::Base
end

class App < Sinatra::Base
  helpers Sinatra::JSON

  get '/' do
    'Hello World'
  end
end

