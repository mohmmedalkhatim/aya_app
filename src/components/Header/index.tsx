import { AllHTMLAttributes, Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconBasket, IconChevronLeft, IconChevronRight, IconCloudCheck, IconCloudDataConnection, IconCloudOff, IconUser } from '@tabler/icons-react';
import { Data, useStore } from "../../context"
import MyLink from './Link';
import { storage } from '../../main';
import dayjs from 'dayjs';
import { Link, useActionData, useLocation, useNavigate } from 'react-router-dom';
import { deleteSecret } from 'tauri-plugin-keyring-api';
import { hostname } from '@tauri-apps/plugin-os';
import { Heading } from '../heading';
import { Button } from '../Button/Button';

let links = [
  { name: 'Dashboard', url: '/' },
  { name: 'payments', url: '/payments' },
  { name: 'courses', url: '/courses' },
  { name: 'about', url: '/about' },
];
let info = [
  { name: 'my_account', url: '/auth', icon: <IconUser size={'1.5rem'} /> },
  { name: 'cart', url: '/cart', icon: <IconBasket size={'1.5rem'} /> },
];
type Header_Props = {} & AllHTMLAttributes<HTMLDivElement>;

let dataFetch = (access_token: String, setData: (data: Data) => void, setLoading: Dispatch<SetStateAction<boolean>>, setError: Dispatch<SetStateAction<string>>) => {

  return () => {
    setLoading(true)
    fetch("http://localhost:4000", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${access_token}`
      },
    }).then((data) => {
      if (data) {
        data.json().then((json) => {
          console.log(json)
          useStore.setState({ user_info: json })
        })
      }
    }).catch(err => {
      setError(err)
    }).finally(() => {
      setLoading(false)
      useStore.setState({ onLine: true })
    })
  }
}


function Header(props: Header_Props) {
  let setInfo = useStore(state => state.setInfo)
  let date = dayjs().hour()
  let navigate = useNavigate()
  let name = useStore(state => state.user_info.name)
  let location = useLocation()
  let access_token = useStore(state => state.keys.access_token)
  let [loading, setLoading] = useState(false)
  let [Error, setError] = useState("")
  let setData = useStore(state => state.setData)
  useEffect(dataFetch(access_token, setData, setLoading, setError), [])
  return (
    <header className={'border-b py-4 text-sm h-20 pl-4  items-center  fixed top-0 w-full bg-white '} {...props}>
      <div className="fixed top-7 right-20 z-60">
        {loading ? <IconCloudDataConnection /> : Error !== "" ? <IconCloudOff /> : <IconCloudCheck />}
      </div>
      {location.pathname !== "/profile" ?
        <div>
          <div className='flex md:hidden content items-center justify-between gap-4 '>
            <div className='flex gap-4 items-center'>
              <div>
                <h5>{date > 12 ? "Good eveing" : "Good morning"}</h5>
                <div className='text-gray-400/80'>{name}</div>
              </div>
            </div>
            <Link className='bg-sky-400 rounded-full p-2 cursor-pointer' viewTransition to={"/profile"}>
              <IconUser color='white' />
            </Link>
          </div>
        </div> :
        <div className='h-full w-full flex items-center'>
          <Button variant="secondary" className='bg-white' onClick={(e) => { e.preventDefault(); navigate("/", { viewTransition: true }) }}>
            <IconArrowLeft size={"1.2rem"} />
            <Heading>
              Dashboard
            </Heading>
          </Button>
        </div>
      }
    </header>
  );
}
export default Header;
