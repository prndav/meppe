    var s = angular.module('services', [])

    //todos
    s.service('pointsService', function ($filter, $q, $http) {

    // nextId and list both have mock starting data
    this.nextId = 4;
    this.items = [];

    this.getAll = function () {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/points' //'mocks/meppes.json',

        })
        .success(function (data) {
            this.items = data;
            deferred.resolve(data);
        })
        .error(function (e) {
            deferred.reject("Error while fetching points");
            console.log("Error while fetching points")
        })

        return deferred.promise;
    }
    /*this.items = [
      {
        id: 1,
        completed: false,
        title: 'Play Tennis',
        desc: '',
        lat: 43.09278984218124,
        lng: -89.36774236078266
      }, {
        id: 2,
        completed: true,
        title: 'Buy Groceries',
        desc: 'Steak, Pasta, Spinach',
        lat: 43.06487353914984,
        lng: -89.41749499107603
      }, {
        id: 3,
        completed: false,
        title: 'Picnic Time',
        desc: 'Hang out with friends',
        lat: 43.0869882068853,
        lng: -89.42141638065578
      }
    ];*/
    this.filter = {};
    this.filtered = function () {
      return $filter('filter')(this.items, this.filter);
    };
    this.remainingCount = function () {
      return $filter('filter')(this.items, {completed: false}).length;
    };
    this.getTodoById = function (todoId) {
      var todo, i;
      for (i = this.items.length - 1; i >= 0; i--) {
        todo = this.items[i];
        if (todo.id === todoId) {
          return todo;
        }
      }
      return false;
    };
    this.addTodo = function (title, desc, lat, lng) {
      var newTodo = {
        id: this.nextId++,
        /*completed: false,*/
        title: title,
        desc: desc,
        lat: lat,
        lng: lng
      };
      this.items.push(newTodo);
    };
    this.updateTodo = function (todoId, title, desc, lat, lng, comp) {
      var todo = this.getTodoById(todoId);
      if (todo) {
        todo.title = title;
        todo.desc = desc;
        todo.lat = lat;
        todo.lng = lng;
        todo.completed = comp;
        todo.id = this.nextId++;
      }
    };
    this.prune = function () {
      var flag = false, i;
      for (var i = this.items.length - 1; i >= 0; i--) {
        if (this.items[i].completed) {
          flag = true;
          this.items.splice(i, 1);
        }
      }
      if (flag) this.nextId++;
    };

    });



    //infowindow
    s.service('infoWindowService', function (mapService) {
      var infoWindow;
      this.data = {};
      this.registerInfoWindow = function (myInfoWindow) {
        infowindow = myInfoWindow;
      };
      this.setData = function (todoId, todoTitle, todoDesc) {
        this.data.id = todoId;
        this.data.title = todoTitle;
        this.data.desc = todoDesc;
      };
      this.open = function (marker) {
        infowindow.open(mapService.getMap(), marker);
      };
      this.close = function () {
        if (infowindow) {
          infowindow.close();
          this.data = {};
        }
      };
    });

    //map
    s.service('mapService', function () {
      var map;
      this.setMap = function (myMap) {
        map = myMap;
      };
      this.getMap = function () {
        if (map) return map;
        throw new Error("Map not defined");
      };
      this.getLatLng = function () {
        var center = map.getCenter();
        return {
          lat: center.lat(),
          lng: center.lng()
        };
      };
    });

    //mapcontrols
    s.service('mapControlsService', function (infoWindowService, markersService, NEW_TODO_ID) {
      this.editTodo = false;
      this.editTodoId = NEW_TODO_ID;
      this.newTodo = function () {
        this.editTodoById();
      };
      this.editTodoById = function (todoId) {
        this.editTodoId = todoId || NEW_TODO_ID;
        this.editTodo = true;
      };
      this.openInfoWindowByTodoId = function (todoId) {
        var marker = markersService.getMarkerByTodoId(todoId);
        if (marker) {
          infoWindowService.setData(todoId, marker.getTitle(), marker.get("desc"));
          infoWindowService.open(marker);
          return;
        }
      };
    });


    //markers
    s.service('markersService', function () {
      this.markers = [];
      this.getMarkerByTodoId = function (todoId) {
        var marker, i;
        for (i = this.markers.length - 1; i >= 0; i--) {
          marker = this.markers[i];
          if (marker.get("id") === todoId) {
            return marker;
          }
        }
        return false;
      };
    });

    s.service ('categoriesService', function ($http, $q) {

      this.getAll = function () {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: '/categories/' //'mocks/categories.json'
        })
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (e) {
            deferred.reject("Error while fetching categories");
        })
        return deferred.promise;
      }

      this.remove = function (id) {
        var deferred = $q.defer();

        $http({
          method: 'DELETE',
          url: '/categories/' + id
        })
        .success(function () {
            deferred.resolve();
        })
        .error(function (e) {
            deferred.reject("Error while removing category");
        })

        return deferred.promise;
      }

      this.update = function (category) {
        var deferred = $q.defer();

        $http({
          method: 'PUT',
          url: '/categories/' + category.id,
          params: category
        })
        .success(function () {
            deferred.resolve();
        })
        .error(function (e) {
            deferred.reject("Error while updating category");
        })

        return deferred.promise;

      }

      this.createNew = function () {
        return {
          name: "",
          description: ""
        };
      }

      this.save = function (category) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/categories/',
          params: category
        })
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (e) {
            deferred.reject("Error while saving category");
        })

        return deferred.promise;

      }

      this.getById = function (id) {
          var deferred = $q.defer();
          $http({
            method: 'GET',
            url: '/categories/'+id //'mocks/categories.json'
          })
          .success(function (data) {
              deferred.resolve(data);
          })
          .error(function (e) {
              deferred.reject("Error while fetching category");
          })
          return deferred.promise;
      }
    })



    s.service ("meppesService", function ($http, $q) {

      this.getAll = function (optionalCategory) {

        var deferred = $q.defer();

        $http({
          method: "GET",
          url: "/meppes/", //'mocks/meppes.json',
          params: {
            categoryName: optionalCategory
          }
        })
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (e) {
            deferred.reject("Error while fetching meppes");
            console.log("Error while fetching meppes")
        })

        return deferred.promise;
      }

      this.update = function (meppe) {
        var deferred = $q.defer();

        $http({
          method: 'PUT',
          url: '/meppes/' + meppe.id,
          params: meppe
        })
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (e) {
            deferred.reject("Error while updating meppe");
        })

        return deferred.promise;

      }


      this.save = function (meppe) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/meppes/',
          params: meppe
        })
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (e) {
            deferred.reject("Error while saving meppe");
        })

        return deferred.promise;

      }

      this.createNew = function () {
        return {
          name: "",
          description: "",
          category_id: ""
        };
      }

      this.remove = function (id) {
        var deferred = $q.defer();

        $http({
          method: 'DELETE',
          url: '/meppes/' + id
        })
        .success(function () {
            deferred.resolve();
        })
        .error(function (e) {
            deferred.reject("Error while removing meppe");
        })

        return deferred.promise;
      }

    })
