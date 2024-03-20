
const express = require("express");
let server = express();

server.get("/api/stories", function (req, res) {
    res.send([
      { title: "Story 1", content: "story 1 content" },
      { title: "story 2", content: "story 2 content" },
    ]);
  });
  
server.listen(4000);