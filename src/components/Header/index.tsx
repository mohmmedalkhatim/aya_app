import { AllHTMLAttributes } from 'react';
import { IconBasket, IconUser } from '@tabler/icons-react';
import { useStore } from "../../context"
import MyLink from './Link';

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

function Header(props: Header_Props) {
  let setInfo = useStore(state => state.setInfo)
  let logout = () => setInfo({ access_token: "" })
  return (
    <header className={'border-b py-4 text-sm  fixed top-0 w-full bg-white '} {...props}>
      <div className='md:flex hidden content w-full pt-4 flex-col gap-4'>
        <nav className='flex justify-between w-full'>
          <div className='flex list-none gap-4 font-semibold'>
            {links.map((item, i) => (
              <MyLink key={i} url={item.url} content={item.name} />
            ))}
          </div>
          <div className='flex gap-4 list-none'>
            {info.map((item, i) => (
              <MyLink key={i} url={item.url} content={item.icon} />
            ))}
          </div>
        </nav>
      </div>
      <div className='flex md:hidden content items-center justify-between gap-4 '>
        <div className='flex gap-4 items-center'>
          <div>
            <h5>Good evening</h5>
            <div className='text-gray-400/80'>mohammed alkhatims</div>
          </div>
        </div>
        <div className='bg-sky-400 rounded-full p-2' onClick={logout}>
          <IconUser color='white' />
        </div>
      </div>
    </header>
  );
}
export default Header;
