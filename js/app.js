(function(){
  'use strict';

  angular.module("NarrowItDownApp",[])
  .controller("NarrowItDownController",NarrowItDownController)
  .service("MenuSearchService",MenuSearchService)
  .directive("foundItems",FoundItemsDirctive);

  function FoundItemsDirctive(){
    return {
      scope : {
        found : '<',
        errorMessage : '@message',
        onRemove : '&'
      },
      templateUrl: 'foundItem.html',
      controller: NarrowItDownController,
      controllerAs: 'narrowItDown',
      bindToController: true
    }
  }

  NarrowItDownController.$inject=['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var narrowItDown = this;
    narrowItDown.searchText = "";

    narrowItDown.getMenuItems = function(){
      var promise = MenuSearchService.getMatchedMenuItems(narrowItDown.searchText);

      promise.then(function (data) {
        narrowItDown.found = data;
        if(data.length == 0 ){narrowItDown.errorMessage ="Nothing found!!!!";}
        else{narrowItDown.errorMessage ="";}
      })
      .catch(function (error) {
        console.log("Something went terribly wrong.");
      });

    }

    narrowItDown.removeItem = function(index){
      narrowItDown.found.splice(index,1);
    }
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http){
    var service = this;
    service.getMatchedMenuItems = function(searchItem){
      return $http({
        method: "GET",
        url : ("https://davids-restaurant.herokuapp.com/menu_items.json")
      }).then(function(response){
        var foundItems = [],
            menuItems = response.data.menu_items;
        if(searchItem != null && searchItem.trim() != ""){
          for(var i=0;i < menuItems.length;i++){
            if(menuItems[i].description.indexOf(searchItem) > -1){
              foundItems.push(menuItems[i])
            }
          }
        }
        return foundItems;
      });
    }
  }
})();
