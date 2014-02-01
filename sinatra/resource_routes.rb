require 'sinatra/base'

module Sinatra
  module ResourceRoutes
    def resources(resource, options={}, &block)
      resource = resource

      if options[:nested]
        parent_resource = options[:nested]
        nested_resource_routes(resource, parent_resource)
      else
        std_resource_routes(resource, options)
      end

      create_nested_routes(resource, &block) if block_given?
    end

    def create_nested_routes(resource, &block)
      nested = Proc.new(&block).call
      instance_exec(resource) {|r| resources nested, nested: r }
    end

    def nested(resource)
      resource
    end

    def std_resource_routes(resource, options={})
      paths = prepare_paths(resource, options)
      define_std_routes(paths, resource)
    end

    def nested_resource_routes(resource, parent_resource)
      std_paths = prepare_paths(resource, only: [:show, :edit, :update, :destroy])
      nested_paths = prepare_nested_paths(resource, parent_resource)

      define_std_routes(std_paths, resource)
      define_nested_routes(nested_paths, resource, parent_resource)
    end

    def prepare_paths(resource, options = {})
      resource = resource.to_s
      crud_actions = options[:only] || [:index, :new, :create, :show, :edit, :update, :destroy]
      paths = {}
      crud_actions.each do |action|
        case action
          when :index   then paths[:index]   = "/#{resource}"
          when :new     then paths[:new]     = "/#{resource}/new"
          when :create  then paths[:create]  = "/#{resource}"
          when :show    then paths[:show]    = "/#{resource}/:id"
          when :edit    then paths[:edit]    = "/#{resource}/:id/edit"
          when :update  then paths[:update]  = "/#{resource}/:id"
          when :destroy then paths[:destroy] = "/#{resource}/:id"
          else
            nil
        end
      end
      paths
    end

    def prepare_nested_paths(resource, parent_resource)
      resource = resource.to_s
      parent_resource = parent_resource.to_s
      nested_paths = {}
      nested_paths[:index]  = "/#{parent_resource}/:id/#{resource}"
      nested_paths[:new]    = "/#{parent_resource}/:id/#{resource}/new"
      nested_paths[:create] = "/#{parent_resource}/:id/#{resource}"
      nested_paths
    end

    def define_std_routes(paths, resource)
      paths = paths
      const = convert_to_const(resource.to_s.capitalize)
      paths.each do |action, path|
        send("#{action.to_s}_action", path, const)
      end
    end

    def define_nested_routes(paths, resource, parent_resource)
      paths = paths
      parent_resource_const = convert_to_const(parent_resource.to_s.capitalize)
      resource_const = convert_to_const(resource.to_s.capitalize)
      paths.each do |action, path|
        send("nested_#{action.to_s}_action", path, parent_resource_const, resource_const)
      end
    end

    def index_action(path, const)
      get "#{path}" do
        const.all.to_json
      end
    end

    def show_action(path, const)
      get "#{path}" do |id|
        const.find(id).to_json
      end
    end

    def new_action(path, const)
      get "#{path}" do
        const.new
      end
    end

    def create_action(path, const)
      post "#{path}" do
        halt 403, 'Not implemented yet!'
      end
    end

    def edit_action(path, const)
      get "#{path}" do
        halt 403, 'Not implemented yet!'
      end
    end

    def update_action(path, const)
      post "#{path}" do
        halt 403, 'Not implemented yet!'
      end
    end

    def destroy_action(path, const)
      post "#{path}" do
        halt 403, 'Not implemented yet!'
      end
    end

    def nested_index_action(path, parent_resource_const, resource_const)
      assoc = resource_const.to_s.downcase + 's'
      get "#{path}" do |id|
        parent_resource_const.find(id).send(assoc).to_json
      end
    end

    def nested_new_action(path, parent_resource_const, resource_const)
      get "#{path}" do
        halt 403, 'Not implemented yet!'
      end
    end

    def nested_create_action(path, parent_resource_const, resource_const)
      post "#{path}" do
        halt 403, 'Not implemented yet!'
      end
    end

    def convert_to_const(str)
      klass = Kernel.const_get(str)
      klass.is_a?(Class) ? klass : nil
      rescue NameError
        nil
    end
  end

  register ResourceRoutes
end
