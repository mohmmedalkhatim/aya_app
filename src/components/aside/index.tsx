import { IconBasket, IconUser, IconX } from '@tabler/icons-react';
import { useAside } from '../../context/Aside';
import MyLink from '../Header/Link';
import { Link } from 'react-router-dom';

let links = [
  { name: 'Home', url: '/' },
  { name: 'products', url: '/products' },
  { name: 'collation', url: '/collations' },
  { name: 'about', url: '/about' },
];
let info = [
  { name: 'my_account', url: '/auth', icon: <IconUser size={'2rem'} /> },
  { name: 'cart', url: '/cart', icon: <IconBasket size={'2rem'} /> },
];

function Aside () {
  let opened = useAside(state => state.state);
  let toggle = useAside(state => state.toggle);
  return (
    <aside
      className='fixed top-0 w-full md:w-screen z-50 bg-white h-screen transition-all duration-300 border-l'
      style={{ right: opened ? '0' : '-100vw' }}
    >
      <div className='absolute top-5 right-8' onClick={toggle}>
        <IconX size={'1.5rem'} />
      </div>
      <ul className='w-screen list-none flex flex-col pt-16'>
        {links.map((item, i) => (
            <Link
              key={i}
              to={item.url}
              onClick={toggle}
              onTouchEnd={toggle}
              className='hover:bg-slate-200 px-4 py-6'
              content={item.name}
            >
              {item.name}
            </Link>
        ))}
      </ul>
      <ul className='absolute bottom-8 flex gap-4 items-center text-[4rem] right-8'>
        {info.map((item, i) => (
          <MyLink key={i} url={item.url} content={item.icon} />
        ))}
      </ul>
    </aside>
  );
}
export default Aside;
