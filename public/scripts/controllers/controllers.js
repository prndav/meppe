angular.module('controllers', [])
.controller('EditTodoCtrl', function ($scope, mapService, pointsService, infoWindowService, mapControlsService, NEW_TODO_ID) {
  var editPinImage,
    editMarker;

  $scope.todos = [];
  $scope.getTodos = function () {
      var promise = pointsService.getAll();
      promise.then(function(data) {
        $scope.todos = data;
      }, function(data) {
        alert('Failed while getting points: ' + data);
      });
  }

  $scope.editTodo = {};

  // editMarker Setup Start

  editPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "55FF00",
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));

  editMarker = new google.maps.Marker({
    title: "Drag Me",
    draggable: true,
    clickable: false,
    icon: editPinImage,
    position: new google.maps.LatLng(0, 0)
  });

  function editMarkerDragCallback (scope, myMarker) {
    return function () {
      var pos = myMarker.getPosition();
      scope.editTodo.lat = pos.lat();
      scope.editTodo.lng = pos.lng();
      if(!scope.$$phase) scope.$apply();
    };
  }
  google.maps.event.addListener(editMarker, 'drag', editMarkerDragCallback($scope, editMarker));

  function editMarkerDblClickCallback (scope) {
    return function () {
      scope.$apply(function () {
        scope.submitTodo();
      });
    };
  }
  google.maps.event.addListener(editMarker, 'dblclick', editMarkerDblClickCallback($scope));

  $scope.$watch('editTodo.lat + editTodo.lng', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      var pos = editMarker.getPosition(),
        latitude = pos.lat(),
        longitude = pos.lng();
      if ($scope.editTodo.lat !== latitude || $scope.editTodo.lng !== longitude)
        editMarker.setPosition(new google.maps.LatLng($scope.editTodo.lat || 0, $scope.editTodo.lng || 0));
    }
  });

  // editMarker Setup End

  $scope.$watch('controls.editTodo + controls.editTodoId', function () {
    var pos, todo = mapControlsService.editTodoId !== NEW_TODO_ID && pointsService.getTodoById(mapControlsService.editTodoId);
    infoWindowService.close();
    if (mapControlsService.editTodo) {
      if (todo) {
        $scope.editTodo = {
          id: todo.id,
          title: todo.title,
          desc: todo.desc,
          lat: todo.lat,
          lng: todo.lng,
          /*comp: todo.completed,*/
          saveMsg: "Update Todo",
          cancelMsg: "Discard Changes"
        };
      } else {
        pos = mapService.getLatLng();
        $scope.editTodo = {
          id: NEW_TODO_ID,
          lat: pos.lat,
          lng: pos.lng,
          saveMsg: "Save Todo",
          cancelMsg: "Discard Todo"
        };
      }
      editMarker.setMap(mapService.getMap());
    }
  });

  $scope.submitTodo = function () {
    if ($scope.editTodoForm.$valid) {
      if ($scope.editTodo.id === NEW_TODO_ID)
        addTodo();
      else
        editTodo();
    }
  }

  $scope.resetCloseTodoForm = function () {
    editMarker.setMap(null);
    mapControlsService.editTodo = false;
    mapControlsService.editTodoId = NEW_TODO_ID;
    $scope.editTodo = {};
  }

  function addTodo () {
    pointsService.addTodo(
      $scope.editTodo.title,
      $scope.editTodo.desc,
      $scope.editTodo.lat,
      $scope.editTodo.lng);
    $scope.resetCloseTodoForm();
  }

  function editTodo () {
    pointsService.updateTodo(
      $scope.editTodo.id,
      $scope.editTodo.title,
      $scope.editTodo.desc,
      $scope.editTodo.lat,
      $scope.editTodo.lng
      /*$scope.editTodo.comp*/);
    $scope.resetCloseTodoForm();
  }

  $scope.getTodos();
})









.controller("HomeCtrl", function ($scope, $routeParams, categoriesService, meppesService) {

    $scope.categories = {};
    $scope.meppes = {};

    //if no category is selected => get all meppes, if category is selected => filter
    var optionalCategory = (typeof $routeParams.category === "undefined") ? "" : $routeParams.category;

    $scope.getCategories = function () {
      var promise = categoriesService.getAll();
      promise.then(function(data) {
        $scope.categories = data;
      }, function(data) {
        alert('Failed while getting categories: ' + data);
      });
    };

    $scope.getMeppes = function () {
      var promise = meppesService.getAll(optionalCategory);
      promise.then(function(data) {
        $scope.meppes = data;
      }, function(data) {
        alert('Failed while getting meppes: ' + data);
      });
    };



    function init () {
      $scope.getMeppes();
      $scope.getCategories();
    }

    init();

})




//manageMeppe


.controller("ManageMeppesCtrl", function ($scope, meppesService, categoriesService ) {

  $scope.models = {};
  $scope.models.pristineMeppeModel = {};
  $scope.models.dirtyMeppeModel = {};
  $scope.models.tempSelectedCategory = {};
  $scope.meppes = {};

  $scope.getMeppes = function () {
    meppesService.getAll().then(function(data) {
      $scope.meppes.items = data;
    });
  }

  $scope.removeMeppe = function (meppe) {
    var id = meppe.id;
    $scope.isViewLoading = true;

    meppesService.remove(id).then(function () {
      for (var i=0; i < $scope.meppes.items.length; i++) {
        if ($scope.meppes.items[i].id == id){
          $scope.meppes.items.splice(i, 1);
        }
      }
      $scope.isViewLoading = false;
    })

  }
  $scope.saveMeppe = function (meppe) {
    if (meppe.id) {
      meppesService.update($scope.models.dirtyMeppeModel).
        then(function () {
          $scope.modal.showModal = false;
          for (var i in $scope.models.dirtyMeppeModel){
            $scope.models.pristineMeppeModel[i] = $scope.models.dirtyMeppeModel[i]
          }
        },
        function () {
          alert ('oops, something went wrong')
        });
    } else {
      meppesService.save($scope.models.dirtyMeppeModel).
        then(function (savedMeppe) { $scope.modal.showModal = false; $scope.meppes.items.push (savedMeppe) },
          function () { alert ('oops, something went wrong')
        });
    }
  }

  $scope.manageMeppe = function (meppe) {
    $scope.models.pristineMeppeModel = meppe ? meppe : {};
    $scope.models.dirtyMeppeModel = meppe ? angular.copy(meppe) : meppesService.createNew();

    $scope.$watch(function() {return $scope.models.tempSelectedCategory},
      function() {$scope.models.dirtyMeppeModel.category_id =
        $scope.models.tempSelectedCategory.id});

    var result = categoriesService.getAll().then(function (categories) {
      $scope.categories = categories;
    })
    $scope.modal.showModal = true;
  }

  $scope.saveUpdateSwitch = function () {
    if ($scope.models.pristineMeppeModel.id != undefined) {
      return "Update";
    } else {
      return "Save";
    }
  }



  //modal
  $scope.modal = {};
  $scope.modal.showModal = false;
  $scope.modal.open = function () {
    $scope.modal.showModal = true;
  }

  $scope.modal.close = function () {
    $scope.modal.showModal = false;
  }



  var init = function () {
    $scope.getMeppes();
  }
  init();




})
// end manageMeppe






.controller("ManageCategoriesCtrl", function ($scope, categoriesService, $location) {

  $scope.manageCategories = {};
  $scope.manageCategories.name = "";
  $scope.categoriesLoaded = false;
  $scope.newCategory = {};

  $scope.removeCategory = function (category) {
    categoriesService.remove(category)
    .then(function () {
      for (var i=0; i < $scope.manageCategories.categories.length; i++) {
        if ($scope.manageCategories.categories[i].id == category){
          $scope.manageCategories.categories.splice(i, 1);
        }
      }
    })
  }

  $scope.addCategory = function () {
    $scope.newCategory = categoriesService.createNew();
  }


  $scope.getCategories = function () {
    categoriesService.getAll().then(function(data) {
      $scope.manageCategories.categories = data;
      $scope.categoriesLoaded = true;
    });
  }

  var init = function () {
    $scope.getCategories();
  }

  init();

})

.controller("ManageCategoryCtrl", function ($scope, $stateParams, categoriesService) {
  $scope.category = {};

  var init = function () {
    $scope.$watch( function () { return $scope.newCategory }, function (newValue) {
      if(newValue){
        $scope.category = $scope.newCategory;
      }
    })
    categoriesService.getById($stateParams.category).then(function(data) {
      $scope.category = data;
    });
  }

  $scope.saveCategory = function () {
    if (!$scope.category.id) {
      console.log("savin")
      var promise = categoriesService.save($scope.category);
      promise.then(function (data) {
        console.log('saved')
        $scope.manageCategories.categories.push(data)
      })
    } else {
      console.log("updatin");
      var promise = categoriesService.update($scope.category);
      promise.then(function () {
        for (var i=0; i < $scope.manageCategories.categories.length; i++) {
          if ($scope.manageCategories.categories[i].id == $scope.category.id){
            $scope.manageCategories.categories[i] = $scope.category;
          }
        }
      })
    }

  }



  init();

})
;
