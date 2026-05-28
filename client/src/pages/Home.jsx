import axios from "axios"
import { useNavigate } from "react-router-dom"

function Home() {

  const navigate = useNavigate()

  const createDocument = async () => {

    try {

      const response = await axios.post(
        "`${import.meta.env.VITE_API_URL}/documents/create`"
      )

      const documentId = response.data._id

      navigate(`/document/${documentId}`)

    } catch (error) {

      console.log(error)

    }

  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6">

      <h1 className="text-6xl font-bold">
        SyncPad 🚀
      </h1>

      <p className="text-zinc-400 text-lg">
        Real-Time Collaborative Document Editor
      </p>

      <button
        onClick={createDocument}
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
      >
        Create Document
      </button>

    </div>
  )
}

export default Home