import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useAsync } from "react-use"
import { Heading } from "../../../components/heading"
import { useStore } from "../../../context"



function Medicine() {
  let { id } = useParams()
  let token = useStore(state => state.keys.access_token)
  let [loading, setLoading] = useState(false)
  let [data, setData] = useState<{ name: string, id: string }[]>([])
  let [error, setError] = useState()
  useAsync(async () => {
    setLoading(true)
    fetch(`http://localhost:4000/medicine/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      }
    }).then(async (res) => {
      if (res.status == 200) {
        setData((await res.json()))
      }
    }).catch(error => setError(error)).finally(() => setLoading(false))

  }, [name])

  return (
    <main className="container content p-4">
      {error && <Heading level={5} size="4xl">couldn't find in the database</Heading>}
      {loading && <>
        <div className="animate-pulse w-full h-20"></div>
        <div className="animate-pulse w-full h-20"></div>
        <div className="animate-pulse w-full h-20"></div>
      </>}
    </main>
  )
}
export default Medicine