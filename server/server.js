const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const http = require("http")
const { Server } = require("socket.io")

require("dotenv").config()

const documentRoutes = require("./routes/documentRoutes")

const app = express()

// CREATE HTTP SERVER
const server = http.createServer(app)

// SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
  origin: "*",
  methods: ["GET", "POST", "PUT"]
}
})

app.use(cors())
app.use(express.json())

app.use("/documents", documentRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err))

app.get("/", (req, res) => {
  res.send("SyncPad Server Running 🚀")
})


// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log("User Connected 🔥")

  let currentDocument = null

  socket.on("join-document", (documentId) => {

    currentDocument = documentId

    socket.join(documentId)

    console.log(`Joined document: ${documentId}`)

    const room = io.sockets.adapter.rooms.get(documentId)

    const numberOfUsers = room ? room.size : 0

    io.to(documentId).emit("users-count", numberOfUsers)

  })

  socket.on("send-changes", ({ documentId, content }) => {

    socket.to(documentId).emit("receive-changes", content)

  })

  socket.on("disconnect", () => {

    console.log("User Disconnected ❌")

    if (currentDocument) {

      const room = io.sockets.adapter.rooms.get(currentDocument)

      const numberOfUsers = room ? room.size : 0

      io.to(currentDocument).emit("users-count", numberOfUsers)

    }

  })

})
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})