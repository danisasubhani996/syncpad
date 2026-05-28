import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import ReactQuill from "react-quill-new"
import { io } from "socket.io-client"

function Editor() {

  const { id } = useParams()
const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [socket, setSocket] = useState(null)
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState("Saved ✅")
  const [usersCount, setUsersCount] = useState(1)

  // CONNECT SOCKET
  useEffect(() => {

    const newSocket = io(import.meta.env.VITE_API_URL)

    setSocket(newSocket)

    return () => newSocket.disconnect()

  }, [])
  useEffect(() => {

  if (!socket) return

  socket.emit("join-document", id)

}, [socket, id])

  // FETCH DOCUMENT
  useEffect(() => {

    const fetchDocument = async () => {

      try {

       const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/documents/${id}`
)

        setTitle(response.data.title)
setContent(response.data.content)

      } catch (error) {

        console.log(error)

      }

    }

    fetchDocument()

  }, [id])

  // RECEIVE LIVE CHANGES
  useEffect(() => {

    if (!socket) return

    socket.on("receive-changes", (data) => {

      setContent(data)

    })

    return () => {

      socket.off("receive-changes")

    }

  }, [socket])
useEffect(() => {

  if (!socket) return

  socket.on("users-count", (count) => {

    setUsersCount(count)

  })

  return () => {

    socket.off("users-count")

  }

}, [socket])
  // AUTO SAVE
  useEffect(() => {

    const interval = setInterval(() => {

      saveDocument()

    }, 2000)

    return () => clearInterval(interval)

  }, [content])

  const saveDocument = async () => {

    try {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/documents/${id}`,
       {
  title,
  content
}
      )
      setSaveStatus("Saved ✅")

    } catch (error) {

      console.log(error)

    }

  }
const copyLink = async () => {

  try {

    await navigator.clipboard.writeText(window.location.href)

    setCopied(true)

    setTimeout(() => {

      setCopied(false)

    }, 2000)

  } catch (error) {

    console.log(error)

  }

}
  return (
    <div className="min-h-screen bg-zinc-100 p-10">

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

       <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between gap-4">

  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Untitled Document"
    className="bg-transparent text-white text-2xl font-semibold outline-none w-full"
  />
  <p className="text-sm text-zinc-300 whitespace-nowrap">
  👥 {usersCount} Online
</p>
<p className="text-sm text-zinc-300 whitespace-nowrap">
  {saveStatus}
</p>
  <button
    onClick={copyLink}
    className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:scale-105 transition"
  >
    {copied ? "Copied ✅" : "Share"}
  </button>

</div>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => {

  setContent(value)

  setSaveStatus("Saving...")

  if (socket) {

    socket.emit("send-changes", {
      documentId: id,
      content: value
    })

  }

}}
          className="h-[80vh]"
        />

      </div>

    </div>
  )
}

export default Editor