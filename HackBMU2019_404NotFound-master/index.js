// var railway = require('railway-api')
// railway.setApikey('70bus84o7i')
const exec = require("child_process").exec;
const request = require("request");
const fs = require("fs");

const http = require("http");

s = "https://api.railwayapi.com/v2/route/train/12621/apikey/70bus84o7i/";

const hts = http
  .createServer(function(req, res) {
    // fs.readFile('index.html', function(error, data){
    // 	if(error) throw error;
    // 	res.end(data);
    // })
  })
  .listen(4000);

function scanResponseCode(responseCode, callback) {
  if (responseCode == 200) {
    callback(null);
  } else if (responseCode == 401) {
    callback("error");
  } else {
    callback("error");
  }
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
function getTrain(trainNo, start, end, callback) {
  request(
    `https://api.railwayapi.com/v2/route/train/${trainNo}/apikey/70bus84o7i/`,
    function(err, res) {
      if (!err) {
        // console.log(res);
        stations = [];
        let data = res.body.split('"route":')[1];
        // console.log(data);
        let data1 = data.split('"station":');
        for (let i = 1; i < data1.length; i++) {
          let name = data1[i].split('"name":')[1];
          let final_name = name.split('"')[1];
          let pre_final_name = final_name.split(" JN")[0];
          let full_final_name = pre_final_name.split(" CANTT")[0];
          full_final_name = toTitleCase(full_final_name);
          full_final_name = full_final_name.trim();
          stations.push(full_final_name);
          // console.log(final_name);
          // console.log(name);
        }
        final_stations = [];
        (li = 0), (le = stations.length);
        for (let i = 0; i < stations.length; i++) {
          if (stations[i] == toTitleCase(start)) {
            li = i;
          }
          console.log(stations[i], toTitleCase(end));
          if (stations[i] == toTitleCase(end)) {
            console.log("end");
            le = i;
          }
        }
        for (let i = li; i < le + 1; i++) {
          if (stations[i] != undefined) final_stations.push(stations[i]);
        }
        // for (let i = 0; i < stations.length; i++) {
        //   f = false;
        //   console.log(stations[i], toTitleCase(end));
        //   if (stations[i] == toTitleCase(start)) {
        //     // console.log(stations[i]);
        //     for (let j = i; j < stations.length; j++) {
        //       if (stations[j] == toTitleCase(end)) {
        //         f = true;
        //         break;
        //       }
        //       final_stations.push(stations[j]);
        //     }
        //     if (f) break;
        //   }
        // }
        callback(false, final_stations);
        return final_stations;
        // console.log(stations);
        // console.log(stations)
      }
    }
  );
}

const io = require("socket.io")(hts);

io.on("connection", function(socket) {
  console.log("A user connected");

  socket.on("train_no", function(res, start, end) {
    console.log("train");
    getTrain(res, start, end, function(error, stations) {
      input = "";
      for (let i = 0; i < stations.length; i++) {
        input += stations[i] + "\n";
      }
      input += "exit\n";
      fs.writeFileSync("input.txt", input);
      console.log(toTitleCase(start) + toTitleCase(end));
      var child = exec(
        `python red_zone_predction.py < ${toTitleCase(start) +
          toTitleCase(end)}.txt`,
        { maxBuffer: 1024 * 100 },
        function(err, stdout, stderr) {
          if (err) throw err;
          if (stderr) console.log(stderr);
          output = stdout.split(";");
          let final_output = {};
          for (let i = 0; i < output.length - 1; i++) {
            final_output[output[i].split(" ")[0]] = output[i].split(" ")[1];
          }
          socket.emit("get_path_data", final_output);
          console.log(stdout);
        }
      );
      console.log(stations);
    });
    // console.log(res);
  });
  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function() {
    console.log("A user disconnected");
  });
});

// getTrain(12621, function(err, res){
// 	// console.log(res);
// });
