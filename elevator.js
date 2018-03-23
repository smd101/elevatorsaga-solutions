{
  init: function(elevators, floors) {

      floors.waitQueue = new Array();
      floors.pushWaitQueue = function(floorNum) {
          if(floors.waitQueue.indexOf(floorNum) === -1) {
              floors.waitQueue.push(floorNum);
          }
      };
      floors.removeWaitQueue = function(floorNum) {
          let index = floors.waitQueue.indexOf(floorNum);
          if(index !== -1) {
              floors.waitQueue.splice(index, 1);
          }
      };

      // Floor Event
      floors.forEach(function(floor) {
          floor.peopleWaiting = false;
          floor.on("up_button_pressed down_button_pressed", function() {
              console.log("up_button_pressed down_button_pressed #" + floor.floorNum());
              floor.peopleWaiting = true;
              floors.pushWaitQueue(floor.floorNum());
          });
      });


      // Elevator Event
      elevators.forEach(function(elevator, elevatorNum) {
          elevator.elevatorNum = elevatorNum;

          // エレベータがすべてのタスクを完了して何もしていないときにトリガされます。
          elevator.on("idle", function() {
              console.log("idle #" + elevator.elevatorNum);
              console.log("waitQueue #" + elevator.elevatorNum + ": " + floors.waitQueue);
              floors.waitQueue.forEach(function(floorNum) {
                  elevator.goToFloor(floorNum);
                  return true;
              });
          });
          // エレベータが床に到着したときにトリガされます。
          elevator.on("stopped_at_floor", function(floorNum) {
              console.log("stopped_at_floor #" + elevator.elevatorNum + " floorNum: " + floorNum);
              floors.removeWaitQueue(floorNum);
              console.log("waitQueue #" + elevator.elevatorNum + ": " + floors.waitQueue);
          });
          // 乗客がエレベータ内のボタンを押したときにトリガされます。
          elevator.on("floor_button_pressed", function(floorNum) {
              console.log("floor_button_pressed #" + elevator.elevatorNum + "floorNum: " + floorNum);
              elevator.goToFloor(floorNum);
              console.log("destinationQueue #" + elevator.elevatorNum + ": " + elevator.destinationQueue);
          });

      });

  },
      update: function(dt, elevators, floors) {
          // We normally don't need to do anything here
      }
}