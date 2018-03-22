  {
    init: function(elevators, floors) {

      floors.waitQueue = new Array();
      floors.pushWaitQueue = function(floorNum) {
        if(floors.waitQueue.indexOf(floorNum) === -1) {
          floors.waitQueue.push(floorNum);
        }
      };
      floors.removeWaitQueue = function(floorNum) {
        let index = floors.indexOf(floorNum);
        if(index !== -1) {
          floors.waitQueue.splice(index, 1);
        }
      };

      // Floor Event
      floors.forEach(function(floor) {
        floor.peopleWaiting = false;
        floor.on("up_button_pressed down_button_pressed", function() {
            console.log("up_button_pressed down_button_pressed");
            floor.peopleWaiting = true;
            floors.pushWaitQueue(floor.floorNum());
        });
      });


      // Elevator Event
      elevators.forEach(function(elevator) {
        // エレベータがすべてのタスクを完了して何もしていないときにトリガされます。
        elevator.on("idle", function() {
          console.log("idle");
          elevator.goToFloor(0);
        });
        // エレベータが床に到着したときにトリガされます。
        elevator.on("stopped_at_floor", function(floorNum) {
          console.log("stopped_at_floor");
          floors.removeWaitQueue(floorNum);
        });
        // 乗客がエレベータ内のボタンを押したときにトリガされます。
        elevator.on("floor_button_pressed", function(floorNum) {
          console.log("floor_button_pressed");
          elevator.goToFloor(floorNum);
          console.log(elevator.destinationQueue);
        });
        
      });

    },
    update: function(dt, elevators, floors) {
      // We normally don't need to do anything here
    }
  }