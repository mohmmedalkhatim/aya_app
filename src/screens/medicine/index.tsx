import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useAsync } from "react-use"
import { Heading } from "../../components/heading"



function Medicine() {
    let { name } = useParams()
    let [loading, setLoading] = useState(false)
    let [data, setData] = useState<{ name: string, id: string }[]>([])
    let [error, setError] = useState()
    useAsync(async () => {
        setLoading(true)
        fetch(`http://localhost:4000/medicine/search/${name}`).then(async (res) => {
            if (res.status == 200) {
                setData((await res.json()))
            }
        }).catch(error => setError(error)).finally(() => setLoading(false))

    }, [name])

    return (
        <main className="container content">
            {
                data.map(item => (
                    <div className="border-b border-2">
                        <Link to={`/medicine/${item.id}`} className="w-full h-full">
                            <Heading level={3}>{item.name}</Heading>
                        </Link>
                    </div>
                ))
            }
        </main>
    )
}
export default Medicine