require './app'
require 'sinatra/activerecord/rake'

namespace :db do
  task :environment do
    require File.expand_path(File.join(*%w[ config environments ]), File.dirname(__FILE__))
  end

  desc 'Load the seed data from db/seeds.rb'
  task :seed => :environment do
    seed_file = File.join(File.dirname(__FILE__), 'db', 'seeds.rb')
    load(seed_file) if File.exist?(seed_file)
  end
end
