import { AllHTMLAttributes } from 'react';
import { IconBasket, IconMenu2, IconSearch, IconUser } from '@tabler/icons-react';
import MyLink from './Link';
import { useAside } from '../../context/Aside';

let links = [
  { name: 'Dashboard', url: '/' },
  { name: 'products', url: '/products' },
  { name: 'collation', url: '/collations' },
  { name: 'about', url: '/about' },
];
let info = [
  { name: 'my_account', url: '/auth', icon: <IconUser size={'1.5rem'} /> },
  { name: 'cart', url: '/cart', icon: <IconBasket size={'1.5rem'} /> },
];
type Header_Props = {} & AllHTMLAttributes<HTMLDivElement>;

function Header (props: Header_Props) {
  let openAsdie = useAside(state => state.toggle);
  return (
    <header className={'border-b py-4 text-sm  w-full bg-white '} {...props}>
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
        <div>logo</div>
        <IconMenu2 onClick={openAsdie} size={'1.6rem'} />
      </div>
    </header>
  );
}
export default Header;
